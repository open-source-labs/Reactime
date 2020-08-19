/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Map = (props) => {
  // Current snapshot
  const { snapshot } = props;
  console.log('MAP SNAPSHOT', snapshot);

  // set the heights and width of the tree to be passed into treeMap function
  const width: number = 1100;
  const height: number = 600;

  // this state allows the canvas to stay at the zoom level on multiple re-renders
  const [{ x, y, k }, setZoomState]: any = useState({ x: 0, y: 0, k: 0 });
  useEffect(() => {
    setZoomState(d3.zoomTransform(d3.select('#canvas').node()));
  }, [snapshot.children]);

  // Create D3 Tree Diagram 
  useEffect(() => {

    const appState: any = {
      name: ' Root',
      children: snapshot.children,
    };
    console.log('STATE', appState);

    document.getElementById('canvas').innerHTML = '';

    // creating the main svg container for d3 elements
    const svgContainer: any = d3
      .select('#canvas')
      .attr('width', width)
      .attr('height', height);

    // creating a pseudo-class for reusability
    const g: any = svgContainer
      .append('g')
      .attr('transform', `translate(${x}, ${y}), scale(${k})`); // sets the canvas to the saved zoomState

   
    // creating the tree map
    const treeMap: any = d3.tree().nodeSize([width, height]);

    // creating the nodes of the tree
    const hierarchyNodes: any = d3.hierarchy(appState);

    // calling the tree function with nodes created from data
    const finalMap: any = treeMap(hierarchyNodes);

    // renders a flat array of objects containing all parent-child links
    // renders the paths onto the component
    let paths: any = finalMap.links();

    // this creates the paths to each node and its contents in the tree
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#646464')
      .attr('stroke-width', 5)
      .selectAll('path')
      .data(paths)
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
      );

    // returns a flat array of objects containing all the nodes and their information
    let nodes: any = hierarchyNodes.descendants();

    // this segment places all the nodes on the canvas
    const node: any = g
      .append('g')
      .attr('stroke-linejoin', 'round') // no clue what this does
      .attr('stroke-width', 1)
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.y}, ${d.x})`)
      .attr('class', 'atomNodes');

    // for each node that got created, append a circle element
    node
      .append('circle')
      .attr('fill', (d: any) => (d.children ? '#95B6B7' : '#46edf2'))
      .attr('r', 50);

    // for each node that got created, append a text element that displays the name of the node
    node
      .append('text')
      .attr('dy', '.31em')
      .attr('x', (d: any) => (d.children ? -50 : 50))
      .attr('text-anchor', (d: any) => (d.children ? 'end' : 'start'))
      .text((d: any) => d.data.name)
      .style('font-size', `2rem`)
      .style('fill', 'white')
      .clone(true)
      .lower()
      .attr('stroke', '#646464')
      .attr('stroke-width', 2);


    // display the data in the node on hover
    node.on('mouseover', function (d: any, i: number): any {
      if (!d.children) {
        d3.select(this)
          .append('text')
          .text(JSON.stringify(d.data, undefined, 2))
          .style('fill', 'white')
          .attr('x', -999)
          .attr('y', 100)
          .style('font-size', '3rem')
          .style('text-align', 'center')
          .attr('stroke', '#646464')
          .attr('id', `popup${i}`);
      }
    });

    // add mouseOut event handler that removes the popup text
    node.on('mouseout', function (d: any, i: number): any {
      d3.select(`#popup${i}`).remove();
    });

    // allows the canvas to be draggable
    node.call(
      d3
        .drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
    );

    // allows the canvas to be zoom-able
    svgContainer.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0, 5])
        .on('zoom', zoomed)
    );

    // helper functions that help with dragging functionality
    function dragStarted(): any {
      d3.select(this).raise();
      g.attr('cursor', 'grabbing');
    }

    function dragged(d: any): any {
      d3.select(this)
        .attr('dx', (d.x = d3.event.x))
        .attr('dy', (d.y = d3.event.y));
    }

    function dragEnded(): any {
      g.attr('cursor', 'grab');
    }

    // helper function that allows for zooming
    function zoomed(): any {
      g.attr('transform', d3.event.transform);
    }
  });

  return (
    <div data-testid="canvas">
      <div className="Visualizer">
        <svg id="canvas"></svg>
      </div>
    </div>
  );
};

export default Map;
