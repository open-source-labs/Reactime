/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from 'react';
// formatting findDiff return data to show the changes with colors, aligns with actions.tsx
import { diff, formatters } from 'jsondiffpatch';
import * as d3 from 'd3';
import { DefaultMargin } from '../../FrontendTypes';
import { changeView, changeSlider, setCurrentTabInApp } from '../../actions/actions';
import { useStoreContext } from '../../store';

/*
  Render's history page after history button has been selected. Allows user to traverse state history and relevant state branches.
*/

const defaultMargin: DefaultMargin = {
  top: 30,
  left: 30,
  right: 55,
  bottom: 70,
};

// main function exported to StateRoute
// below we destructure the props
function History(props: Record<string, unknown>): JSX.Element {
  const {
    width: totalWidth,
    height: totalHeight,
    margin = defaultMargin,
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    dispatch, // from useStoreContext in 'StateRoute'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
  } = props;
  const [, dispatch] = useStoreContext(); // use the dispatch that is connected with our storeContext

  const svgRef = React.useRef(null);
  const root = JSON.parse(JSON.stringify(hierarchy)); // why do we stringify and then parse our hierarchy back to JSON? (asked 7/31/23)

  // setting the margins for the Map to render in the tab window.
  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  function labelCurrentNode(d3root) {
    if (d3root.data.index === currLocation.index) {
      let currNode = d3root;
      while (currNode.parent) {
        currNode.color = '#999';
        currNode = currNode.parent;
      }
      currNode.color = '#999';
      return d3root;
    }
    let found;
    if (!d3root.children) {
      return found;
    }
    d3root.children.forEach((child) => {
      if (!found) {
        found = labelCurrentNode(child);
      }
    });
    return found;
  }

  // findDiff function uses same logic as ActionContainer.tsx
  function findDiff(index) {
    const statelessCleanning = (obj: {
      name?: string;
      componentData?: object;
      state?: string | any;
      stateSnaphot?: object;
      children?: any[];
    }) => {
      const newObj = { ...obj };
      if (newObj.name === 'nameless') {
        delete newObj.name;
      }
      if (newObj.componentData) {
        delete newObj.componentData;
      }
      if (newObj.state === 'stateless') {
        delete newObj.state;
      }
      if (newObj.stateSnaphot) {
        newObj.stateSnaphot = statelessCleanning(obj.stateSnaphot);
      }
      if (newObj.children) {
        newObj.children = [];
        if (obj.children.length > 0) {
          obj.children.forEach((element: { state?: object | string; children?: [] }) => {
            if (element.state !== 'stateless' || element.children.length > 0) {
              const clean = statelessCleanning(element);
              newObj.children.push(clean);
            }
          });
        }
      }
      return newObj;
    };

    function findStateChangeObj(delta, changedState = []) {
      if (!delta.children && !delta.state) {
        return changedState;
      }
      if (delta.state && delta.state[0] !== 'stateless') {
        changedState.push(delta.state);
      }
      if (!delta.children) {
        return changedState;
      }
      Object.keys(delta.children).forEach((child) => {
        // if (isNaN(child) === false) {
        changedState.push(...findStateChangeObj(delta.children[child]));
        // }
      });
      return changedState;
    }

    const delta = diff(
      statelessCleanning(snapshots[index - 1]),
      statelessCleanning(snapshots[index]),
    );
    const changedState = findStateChangeObj(delta);
    // figured out the formatting for hover, applying diff.csss
    const html = formatters.html.format(changedState[0]);
    // uneeded, not returning a react component in SVG div
    // const output = ReactHtmlParser(html);
    return html;
  }

  /**
   * @method makeD3Tree :Creates a new D3 Tree
   */

  const makeD3Tree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear svg content before adding new elements
    const tree = (data) => {
      const treeRoot = d3.hierarchy(data);
      return d3.tree().size([innerWidth, innerHeight])(treeRoot);
    };
    const d3root = tree(root);

    const currNode = labelCurrentNode(d3root);

    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left},${d3root.height === 0 ? totalHeight / 2 : margin.top})`,
      );

    const link = g
      .selectAll('.link')
      // root.links() gets an array of all the links,
      // where each element is an object containing a
      // source property, which represents the link's source node,
      // and a target property, which represents the link's target node.
      .data(d3root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        (d) =>
          `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${
            (d.y + d.parent.y) / 2
          } ${d.parent.x},${d.parent.y}`,
      );

    const node = g
      .selectAll('.node')
      .data(d3root.descendants())
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .attr('class', `snapshotNode`)
      .on('click', (event, d) => {
        dispatch(changeView(d.data.index));
        dispatch(changeSlider(d.data.index));

        // created popup div and appended it to display div(returned in this function)
        // D3 doesn't utilize z-index for priority,
        // rather decides on placement by order of rendering
        // needed to define the return div with a className to have a target to append to
        // with the correct level of priority
        function renderToolTip() {
          const [x, y] = d3.pointer(event);
          const div = d3
            .select('.display:first-child')
            .append('div')
            .attr('class', `tooltip`)
            .attr('id', `tt-${d.data.index}`)
            .style('left', `${event.clientX - 10}px`)
            .style('top', `${event.clientY - 10}px`)
            .style('max-height', `25%`)
            .style('overflow', `scroll`);
          d3.selectAll('.tooltip').html(findDiff(d.data.index));
        }

        if (d3.selectAll('.tooltip')._groups['0'].length === 0) {
          renderToolTip();
        } else {
          if (d3.selectAll(`#tt-${d.data.index}`)._groups['0'].length === 0) {
            d3.selectAll('.tooltip').remove();
            renderToolTip();
          }
        }
      })
      .on('mouseenter', function (event, d) {
        const [x, y] = d3.pointer(event);
        if (d3.selectAll('.tooltip')._groups['0'].length === 0) {
          const div = d3
            .select('.display:first-child')
            .append('div')
            .attr('class', `tooltip`)
            .attr('id', `tt-${d.data.index}`)
            .style('left', `${event.clientX + 0}px`)
            .style('top', `${event.clientY + 0}px`)
            .style('max-height', `25%`)
            .style('overflow', `auto`)
            .on('mouseenter', function (event, d) {})
            .on('mouseleave', function (event, d) {
              d3.selectAll('.tooltip').remove().style('display', 'hidden');
            });

          d3.selectAll('.tooltip').html(findDiff(d.data.index));
        }
      })
      .on('mouseleave', function (event, d) {
        if (event.relatedTarget.id !== `tt-${d.data.index}`) {
          d3.selectAll('.tooltip').transition().delay(100).remove();
        }
      })

      .attr('transform', function (d) {
        return `translate(${d.x},${d.y})`;
      });

    const tooltip = d3
      .select('.tooltip')
      .on('mousemove', function (event, d) {
        d3.select('.tooltip').style('opacity', '1');
      })
      .on('mouseleave', function (event, d) {
        d3.selectAll('.tooltip').remove();
      });

    node
      .append('circle')

      .attr('fill', (d) => {
        if (d.data.index === currLocation.index) {
          return 'red';
        }
        return d.color ? d.color : '#555';
      })
      .attr('r', 14);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('text-anchor', 'middle')
      .text((d) => `${d.data.name}.${d.data.branch}`)
      .clone(true)
      .lower()
      .attr('stroke', 'white');
    return svg.node();
  };

  useEffect(() => {
    makeD3Tree();
  }, [root, currLocation]);

  useEffect(() => {
    dispatch(setCurrentTabInApp('history'));
  }, []);
  // then rendering each node in History tab to render using D3, which will share area with LegendKey
  return (
    <div className='display'>
      <svg ref={svgRef} width={totalWidth} height={totalHeight} />
    </div>
  );
}

export default History;
