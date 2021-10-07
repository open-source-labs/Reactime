/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { Component, useEffect, useState } from 'react';
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
      console.log('DEBUG >>> no child: ', d3root);
      return found;
    }
    d3root.children.forEach(child => {
      if (!found) {
        console.log('DEBUG >>> child: ', child);
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
    console.log('DEBUG >>> d3root: ', d3root);

    const currNode = labelCurrentNode(d3root);
    console.log('DEBUG >>> currNode: ', currNode);

    const g = svg.append('g')
      // .attr("font-family", "sans-serif")
      // .attr("font-size", 10)
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
        dispatch(changeView(d.data.index));
        dispatch(changeSlider(d.data.index));
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

  // below we are rendering the LegendKey component and passing hierarchy as props
  // then rendering each node in History tab to render using D3, which will share area with LegendKey
  return (
    <>
      {/* <LegendKey hierarchy={hierarchy} /> */}
      <svg
        ref={svgRef}
        width={totalWidth}
        height={totalHeight}
      />
    </>
  );
}

export default History;
