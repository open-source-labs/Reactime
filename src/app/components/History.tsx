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
    sliderIndex,
    viewIndex,
  } = props;

  const svgRef = React.useRef(null);
  const root = JSON.parse(JSON.stringify(hierarchy));

  console.log("DEBUG >>> hierarchy: ", hierarchy);

  // setting the margins for the Map to render in the tab window.
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom - 60;

  useEffect(() => {
    makeD3Tree();
  }, [root]);

  /**
 * @method makeD3Tree :Creates a new D3 Tree
 */
  const makeD3Tree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements 
    const tree = data => {
      const root = d3.hierarchy(data);
      // root.dx = 10;
      // root.dy = width / (root.height + 1);
      // return d3.tree().nodeSize([root.dx, root.dy])(root);
      return d3.tree().size([innerWidth, innerHeight])(root);
    }
    // const hierarchy = d3.hierarchy(root);
    const d3root = tree(root);
    console.log("DEBUG >>> d3root: ", d3root);

    const g = svg.append("g")
      // .attr("font-family", "sans-serif")
      // .attr("font-size", 10)
      .attr("transform", `translate(${margin.left},${d3root.height === 0 ? (totalHeight / 2) : margin.top})`);

    const link = g.selectAll('.link')
      // root.links() gets an array of all the links,
      // where each element is an object containing a
      // source property, which represents the link's source node,
      // and a target property, which represents the link's target node.
      .data(d3root.descendants().slice(1))
      .enter()
      .append('path')
      .attr("class", "link")
      .attr("d", d => {
        return "M" + d.x + "," + d.y
          + "C" + d.x + "," + (d.y + d.parent.y) / 2
          + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
          + " " + d.parent.x + "," + d.parent.y;
      });

    const node = g.selectAll(".node")
      .data(d3root.descendants())
      .enter()
      .append("g")
      // .selectAll("g")
      // .data(d3root.descendants())
      // .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 14);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white");

    return svg.node();
  }

  // /**
  //  * @method maked3Tree Creates a new Tree History
  //  * @var
  //  */
  // let maked3Tree = function () {
  //   removed3Tree();
  //   // Why the fuck are these values fixed?
  //   const width = 800;
  //   const height = 600;
  //   const svgContainer = d3
  //     .select(HistoryRef.current)
  //     .append('svg') // svgContainer is now pointing to svg
  //     .attr('width', width)
  //     .attr('height', height);

  //   const g = svgContainer
  //     .append('g');
  //   // this is changing where the graph is located physically
  //   // .attr('transform', `translate(${containerWidth}, ${height})`);

  //   // d3.hierarchy constructs a root node from the specified hierarchical data
  //   // (our object titled dataset), which must be an object representing the root node
  //   const hierarchy = d3.hierarchy(root);
  //   console.log("DEBUG >>> hierarchy: ", hierarchy);
  //   const tree = d3
  //     .tree()
  //     .nodeSize([width / 10, height / 10]);
  //   // .separation((a: { parent: object }, b: { parent: object }) => (a.parent == b.parent ? 2 : 2));

  //   const d3root = tree(hierarchy);

  //   g.selectAll('.link')
  //     // root.links() gets an array of all the links,
  //     // where each element is an object containing a
  //     // source property, which represents the link's source node,
  //     // and a target property, which represents the link's target node.
  //     .data(d3root.links())
  //     .enter()
  //     .append('path')
  //     .attr('class', 'link')
  //     .attr(
  //       'd',
  //       d3
  //         .linkRadial()
  //         .angle((d: { x: number }) => d.x)
  //         .radius((d: { y: number }) => d.y),
  //     );

  //   const node = g
  //     .selectAll('.node')
  //     // root.descendants gets an array of of all nodes
  //     .data(d3root.descendants())
  //     .enter()
  //     .append('g')
  //     .style('fill', d => {
  //       let loadTime;
  //       if (d.data.stateSnapshot.children[0].componentData.actualDuration) {
  //         loadTime = d.data.stateSnapshot.children[0].componentData.actualDuration;
  //       } else {
  //         loadTime = 1;
  //       }

  //       if (loadTime !== undefined) {
  //         if (loadTime > 16) {
  //           return '#d62b2b';
  //         }
  //       }

  //       if (d.data.branch < colors.length) {
  //         return colors[d.data.branch];
  //       }
  //       let indexColors = d.data.branch - colors.length;
  //       while (indexColors > colors.length) {
  //         indexColors -= colors.length;
  //       }
  //       return colors[indexColors];
  //     })
  //     .attr('class', 'node--internal')
  //     .attr('transform', (d: { x: number; y: number }) => `translate(${reinfeldTidierAlgo(d.x, d.y)})`);

  //   // here we the node circle is created and given a radius size, we are also giving it a mouseover and onClick  functionality
  //   // mouseover will highlight the node
  //   // the onCLick of a selected node will dispatch changeSlider and changeView actions. This will act as a timeJump request.
  //   // further optimization would improve the onclick feature, onclick seems to only register on the lower half of the node
  //   node
  //     .append('circle')
  //     .attr('r', 14)
  //     .on('mouseover', function (d: 'Record<string, unknown>') {
  //       d3.select(this).transition(90).duration(18).attr('r', 21);
  //     })
  //     .on('click', (d: 'Record<string, unknown>') => {
  //       // TODO: change
  //       const index = parseInt(`${d.data.name}.${d.data.branch}`);
  //       dispatch(changeSlider(index));
  //       dispatch(changeView(index));
  //     })
  //     // think about how I can convert this any to typescript
  //     .on('mouseout', function () {
  //       d3.select(this).transition().duration(300).attr('r', 14);
  //     });

  //   node
  //     .append('text')
  //     // adjusts the y coordinates for the node text
  //     .attr('dy', '0.5em')
  //     .attr('x', (d: { x: number; children?: [] }) =>
  //       // this positions how far the text is from leaf nodes (ones without children)
  //       // negative number before the colon moves the text of right side nodes,
  //       // positive number moves the text for the left side nodes
  //       (d.x < Math.PI === !d.children ? 0 : 0))
  //     .attr('text-anchor', 'middle')
  //     // this arranges the angle of the text
  //     .attr('transform', (d: { x: number; y: number }) => (
  //       `rotate(${((d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 1)
  //       / Math.PI
  //       })`
  //     ))
  //     .text((d: { data: { name: number; branch: number } }) =>
  //       // display the name of the specific patch
  //       `${d.data.name}`);

  //   // Zoom Functions
  //   const zoom = d3.zoom().on('zoom', zoomed);
  //   svgContainer.call(
  //     zoom.transform,
  //     // Changes the initial view, (left, top)
  //     d3.zoomIdentity.translate(width / 3, height / 4).scale(1),
  //   );
  //   // allows the canvas to be zoom-able
  //   svgContainer.call(
  //     d3
  //       .zoom()
  //       .scaleExtent([0, 0.9]) // [zoomOut, zoomIn]
  //       .on('zoom', zoomed),
  //   );
  //   // helper function that allows for zooming ( think about how I can convert this any to typescript)
  //   function zoomed(d: any) {
  //     g.attr('transform', d3.event.transform);
  //   }

  //   // DRAG FUNCTIONS
  //   node.call(
  //     d3
  //       .drag()
  //       .on('start', dragstarted)
  //       .on('drag', dragged)
  //       .on('end', dragended),
  //   );

  //   function dragstarted() {
  //     d3.select(this).raise();
  //     g.attr('cursor', 'grabbing');
  //   }

  //   function dragged(d: { x: number; y: number }) {
  //     d3.select(this)
  //       .attr('dx', (d.x = d3.event.x))
  //       .attr('dy', (d.y = d3.event.y));
  //   }

  //   function dragended() {
  //     g.attr('cursor', 'grab');
  //   }

  //   // define the div for the tooltip
  //   const tooltipDiv = d3
  //     .select('body')
  //     .append('div')
  //     .attr('class', 'tooltip')
  //     .style('opacity', 0);

  //   function reinfeldTidierAlgo(x: number, y: number) {
  //     return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
  //   }
  // };

  // below we are rendering the LegendKey component and passing hierarchy as props
  // then rendering each node in History tab to render using D3, which will share area with LegendKey
  return (
    <>
      <LegendKey hierarchy={hierarchy} />
      <svg
        ref={svgRef}
        width={totalWidth}
        height={totalHeight}
      />
    </>
  );
}

export default History;
