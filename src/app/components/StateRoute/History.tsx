/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from 'react';
// formatting findDiff return data to show the changes with colors, aligns with actions.tsx
import { diff, formatters } from 'jsondiffpatch';
import * as d3 from 'd3';
import { DefaultMargin } from '../../FrontendTypes';
import { useDispatch } from 'react-redux';
import { changeView, changeSlider, setCurrentTabInApp } from '../../slices/mainSlice';

/*
  Render's history page after history button has been selected. Allows user to traverse state history and relevant state branches.
*/

const defaultMargin: DefaultMargin = {
  top: 60,
  left: 30,
  right: 55,
  bottom: 70,
};

// Fixed node separation distances
const FIXED_NODE_HEIGHT = 150; // Vertical distance between nodes
const FIXED_NODE_WIDTH = 200; // Horizontal distance between nodes

// main function exported to StateRoute
// below we destructure the props
function History(props: Record<string, unknown>): JSX.Element {
  const {
    width: totalWidth, // from ParentSize provided in StateRoute
    height: totalHeight, // from ParentSize provided in StateRoute
    margin = defaultMargin, //default margin is used when margins aren't passed into props
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
  } = props;

  //here we are adding useSelector and useDispatch for RTK state conversion
  const dispatch = useDispatch();

  const svgRef = React.useRef(null);
  const root = JSON.parse(JSON.stringify(hierarchy));
  // setting the margins for the Map to render in the tab window.
  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  function findDiff(index) {
    const statelessCleaning = (obj: {
      name?: string;
      componentData?: object;
      state?: string | any;
      stateSnaphot?: object;
      children?: any[];
    }) => {
      if (!obj) return {}; // Add null check

      const newObj = { ...obj };
      if (newObj.name === 'nameless') delete newObj.name;
      if (newObj.componentData) delete newObj.componentData;
      if (newObj.state === 'stateless') delete newObj.state;
      if (newObj.stateSnaphot) {
        newObj.stateSnaphot = statelessCleaning(obj.stateSnaphot);
      }
      if (newObj.children) {
        newObj.children = [];
        // Add null check for children array
        if (Array.isArray(obj.children) && obj.children.length > 0) {
          obj.children.forEach((element: { state?: object | string; children?: [] }) => {
            // Add null check for element
            if (
              element &&
              ((element.state && element.state !== 'stateless') ||
                (element.children && element.children.length > 0))
            ) {
              const clean = statelessCleaning(element);
              newObj.children.push(clean);
            }
          });
        }
      }
      return newObj;
    };

    function findStateChangeObj(delta, changedState = []) {
      if (!delta) return changedState; // Add null check
      if (!delta.children && !delta.state) return changedState;
      if (delta.state && delta.state[0] !== 'stateless') {
        changedState.push(delta.state);
      }
      if (!delta.children) return changedState;
      Object.keys(delta.children).forEach((child) => {
        if (delta.children[child]) {
          // Add null check
          changedState.push(...findStateChangeObj(delta.children[child]));
        }
      });
      return changedState;
    }

    if (index === 0) return 'Initial State';

    // Add null checks for snapshots
    if (!snapshots || !snapshots[index] || !snapshots[index - 1]) {
      return 'No state changes';
    }

    try {
      const delta = diff(
        statelessCleaning(snapshots[index - 1]),
        statelessCleaning(snapshots[index]),
      );

      if (!delta) return 'No state changes';

      const changedState = findStateChangeObj(delta);
      console.log('changed state', formatters.html.format(changedState[0]));
      return changedState.length > 0 ? formatters.html.format(changedState[0]) : 'No state changes';
    } catch (error) {
      console.error('Error in findDiff:', error);
      return 'Error comparing states';
    }
  }

  /**
   * @method makeD3Tree :Creates a new D3 Tree
   */

  const makeD3Tree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create tree layout with fixed node size
    const treeLayout = d3
      .tree()
      .nodeSize([FIXED_NODE_WIDTH, FIXED_NODE_HEIGHT])
      .separation((a, b) => {
        // Increase separation between unrelated subtrees
        return a.parent === b.parent ? 1.2 : 2;
      });

    // Create hierarchy and compute initial layout
    const d3root = d3.hierarchy(root);
    treeLayout(d3root);

    // Calculate the bounds of the tree
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    d3root.each((d) => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    // Calculate the actual dimensions needed
    const actualWidth = maxX - minX + FIXED_NODE_WIDTH;
    const actualHeight = maxY - minY + FIXED_NODE_HEIGHT;

    // Set SVG dimensions to accommodate the tree
    const svgWidth = Math.max(actualWidth + margin.left + margin.right, totalWidth);
    svg
      .attr('width', svgWidth)
      .attr('height', Math.max(actualHeight + margin.top + margin.bottom, totalHeight));

    // Calculate center offset to keep root centered
    const rootOffset = -d3root.x;
    const horizontalCenter = svgWidth / 2;

    // Create container group and apply transforms
    const g = svg
      .append('g')
      .attr('transform', `translate(${horizontalCenter + rootOffset},${margin.top})`);

    // Draw links
    const link = g
      .selectAll('.link')
      .data(d3root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', (d) => {
        return d.data.index === currLocation.index ? 'link current-link' : 'link';
      })
      .attr('d', (d) => {
        return `M${d.x},${d.y}
                C${d.x},${(d.y + d.parent.y) / 2}
                  ${d.parent.x},${(d.y + d.parent.y) / 2}
                  ${d.parent.x},${d.parent.y}`;
      });

    // Create node groups
    const node = g
      .selectAll('.node')
      .data(d3root.descendants())
      .enter()
      .append('g')
      .attr('class', (d) => {
        const baseClass = 'node';
        const internalClass = d.children ? ' node--internal' : '';
        const activeClass = d.data.index === currLocation.index ? ' active' : '';
        return baseClass + internalClass + activeClass;
      })
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        dispatch(changeView(d.data.index));
        dispatch(changeSlider(d.data.index));
      });

    // Add rectangles for nodes with consistent size
    node
      .append('rect')
      .attr('width', 200)
      .attr('height', 120)
      .attr('x', -100)
      .attr('y', -40)
      .attr('rx', 8)
      .attr('ry', 8);

    // Add snapshot titles
    node
      .append('text')
      .attr('dy', '-20')
      .attr('text-anchor', 'middle')
      .attr('class', 'snapshot-title')
      .text((d) => `Snapshot ${d.data.index + 1}`);

    // Add state changes text
    node
      .append('foreignObject')
      .attr('x', -85)
      .attr('y', -15)
      .attr('width', 170)
      .attr('height', 90)
      .append('xhtml:div')
      .style('font-size', '12px')
      .style('text-align', 'left')
      .style('padding-left', '8px')
      .html((d) => findDiff(d.data.index));

    return svg.node();
  };

  useEffect(() => {
    makeD3Tree();
  }, [root /*, currLocation*/]); // if the 'root' or 'currLocation' changes, re-build the D3 Tree

  useEffect(() => {
    dispatch(setCurrentTabInApp('history')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'webmetrics' to facilitate render.
  }, []);

  // then rendering each node in History tab to render using D3, which will share area with LegendKey
  return (
    <div className='display'>
      <svg ref={svgRef} width={totalWidth} height={totalHeight} />
    </div>
  );
}

export default History;
