/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { Component, useEffect, useState } from 'react';
import ReactHover, { Trigger, Hover } from 'react-hover';
import ReactHtmlParser from 'react-html-parser';
import { diff, formatters } from 'jsondiffpatch';
import * as d3 from 'd3';
import LegendKey from './legend';
import { changeView, changeSlider } from '../actions/actions';

const filterHooks = (data: any[]) => {
  if (data[0].children && data[0].state === 'stateless') {
    return filterHooks(data[0].children);
  }
  return JSON.stringify(data[0].state);
};

const defaultMargin = {
  top: 30, left: 30, right: 55, bottom: 70,
};

// main function exported to StateRoute
// below we destructure the props
function History(props: Record<string, unknown>) {
  const {
    width: totalWidth,
    height: totalHeight,
    margin = defaultMargin,
    hierarchy,
    dispatch,
    currLocation,
    snapshots,
  } = props;

  const svgRef = React.useRef(null);
  const root = JSON.parse(JSON.stringify(hierarchy));

  // setting the margins for the Map to render in the tab window.
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom - 60;

  useEffect(() => {
    makeD3Tree();
  }, [root, currLocation]);

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
    d3root.children.forEach(child => {
      if (!found) {
        found = labelCurrentNode(child);
      }
    });
    return found;
  }

  /**
 * @method makeD3Tree :Creates a new D3 Tree
 */
  const makeD3Tree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear svg content before adding new elements
    const tree = data => {
      const treeRoot = d3.hierarchy(data);
      return d3.tree().size([innerWidth, innerHeight])(treeRoot);
    };
    // const hierarchy = d3.hierarchy(root);
    const d3root = tree(root);

    const currNode = labelCurrentNode(d3root);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${d3root.height === 0 ? (totalHeight / 2) : margin.top})`);

    const link = g.selectAll('.link')
      // root.links() gets an array of all the links,
      // where each element is an object containing a
      // source property, which represents the link's source node,
      // and a target property, which represents the link's target node.
      .data(d3root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => `M${d.x},${d.y
        }C${d.x},${(d.y + d.parent.y) / 2
        } ${d.parent.x},${(d.y + d.parent.y) / 2
        } ${d.parent.x},${d.parent.y}`);

    const node = g.selectAll('.node')
      .data(d3root.descendants())
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', d => {
        // console.log('d', d);
        // dispatch(changeView(d.data.index));
        dispatch(changeSlider(d.data.index));
      })
      .on('mouseover', d => {
        const div = d3.select('.display').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 1)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY) + 'px')
          .text(JSON.stringify(findDiff(d.data.index)));
        d3.selectAll('.tooltip').attr('color', '#2b2f39');
        // div.text(findDiff(d.data.index));
        // console.log('findDiff(d.data.index)', findDiff(d.data.index));
        // console.log('snapshots in History.jsx', snapshots);
      })
      .on('mouseout', d => {
        d3.selectAll('.tooltip').remove();
      })
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('fill', d => {
        if (d.data.index === currLocation.index) {
          return 'red';
        }
        return d.color ? d.color : '#555';
      })
      .attr('r', 14);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('text-anchor', 'middle')
      .text(d => `${d.data.name}.${d.data.branch}`)
      .clone(true)
      .lower()
      .attr('stroke', 'white');
    return svg.node();
  };

  // finding difference
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
          obj.children.forEach(
            (element: { state?: object | string; children?: [] }) => {
              if (
                element.state !== 'stateless'
                || element.children.length > 0
              ) {
                const clean = statelessCleanning(element);
                newObj.children.push(clean);
              }
            },
          );
        }
      }
      // nathan test
      return newObj;
    };
    // displays stateful data
    // console.log(index, index - 1);

    const previousDisplay = statelessCleanning(snapshots[index - 1]);
    const delta = diff(previousDisplay, snapshots[index]);
    const changedState = findStateChangeObj(delta);
    console.log('changedState in History.tsx', changedState[0]);
    // took out the formatting for History.tsx nodes, Rob 11/4
    // const html = formatters.html.format(changedState[0]);
    // const output = ReactHtmlParser(html);
    // return output;

    if (changedState[0][0] !== 'root') {
      delete changedState[0]['hooksState']['_t'];
    }
    return changedState[0];
  }

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
    Object.keys(delta.children).forEach(child => {
      // if (isNaN(child) === false) {
      changedState.push(...findStateChangeObj(delta.children[child]));
      // }
    });
    return changedState;
  }

  // below we are rendering the LegendKey component and passing hierarchy as props
  // then rendering each node in History tab to render using D3, which will share area with LegendKey
  return (
    <div className="display">
      {/* <LegendKey hierarchy={hierarchy} /> */}
      <svg
        ref={svgRef}
        width={totalWidth}
        height={totalHeight}
      />
    </div>
  );
}

export default History;
