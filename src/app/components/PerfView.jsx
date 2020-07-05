/* eslint-disable no-use-before-define */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable no-multi-spaces */
/* eslint-disable newline-per-chained-call */
/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line object-curly-newline
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-console */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { schemeSet1 as colorScheme } from 'd3';

// import { addNewSnapshots } from '../actions/actions';


const PerfView = ({ snapshots, viewIndex, width = 600, height = 600 }) => {
  // console.log('***** constructor *****');
  const svgRef = useRef(null);

  // Figure out which snapshot index to use
  let indexToDisplay = null;
  if (viewIndex < 0) indexToDisplay = snapshots.length - 1;
  else indexToDisplay = viewIndex;

  // Set up color scaling function
  const colorScale = d3.scaleLinear()
    .domain([0, 7])
    .range(['hsl(200,60%,60%)', 'hsl(255,30%,30%)'])
    .interpolate(d3.interpolateHcl);

  // Set up circle-packing layout function
  const packFunc = useCallback(data => {
    return d3.pack()
    .size([width, height])
    // .radius(d => { return d.r; })
    .padding(3)(d3.hierarchy(data)
                    .sum(d => { return d.componentData.actualDuration || 0; })
                    .sort((a, b) => { return b.value - a.value; }));
  }, [width, height]);

  // If indexToDisplay changes, clear old tree nodes
  useEffect(() => {
    // console.log('***** useEffect - CLEARING');
    while (svgRef.current.hasChildNodes()) {
      svgRef.current.removeChild(svgRef.current.lastChild);
    }
  }, [indexToDisplay, svgRef]);

  useEffect(() => {
    console.log(`***** useEffect - MAIN -> snapshots[${indexToDisplay}]`, snapshots[indexToDisplay]);

    // Error, no App-level component present
    if (snapshots[indexToDisplay].children.length < 1) return;

    // Generate tree with our data
    const packedRoot = packFunc(snapshots[indexToDisplay]);
    console.log('PerfView -> packedRoot', packedRoot);

    // Set initial focus to root node
    let curFocus = packedRoot;

    // View [x, y, r]
    let view;

    // Set up viewBox dimensions and onClick for parent svg
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .on('click', () => zoomToNode(packedRoot));

    // Connect circles below root to data
    const node = svg.append('g')
      .selectAll('circle')
      .data(packedRoot.descendants().slice(1))
      .enter().append('circle')
        .attr('fill', d => (d.children ? colorScale(d.depth) : 'white'))
        .attr('pointer-events', d => (!d.children ? 'none' : null))
        .on('mouseover', function () { d3.select(this).attr('stroke', '#000'); })
        .on('mouseout', function () { d3.select(this).attr('stroke', null); })
        .on('click', d => curFocus !== d && (zoomToNode(d), d3.event.stopPropagation()));

    // Generate text labels. Set (only) root to visible initially
    const label = svg.append('g')
        .attr('class', 'perf-chart-labels')
      .selectAll('text')
      .data(packedRoot.descendants())
      .enter().append('text')
        .style('fill-opacity', d => (d.parent === packedRoot ? 1 : 0))
        .style('display', d => (d.parent === packedRoot ? 'inline' : 'none'))
        .text(d =>  `${d.data.name}: \
          ${Number.parseFloat(d.data.componentData.actualDuration || 0).toFixed(2)}ms`);

    // Remove any unused nodes
    label.exit().remove();
    node.exit().remove();

    // Zoom size of nodes and labels to focus view on root node
    zoomViewArea([packedRoot.x, packedRoot.y, packedRoot.r * 2]);

    // Zoom/relocated nodes and labels based on dimensions given [x, y, r]
    function zoomViewArea(newXYR) {
      // console.log('zoomTo -> newXYR', newXYR);
      // if (!newXYR.every(val => Number.isNaN(val))) { console.log('NaN'); return; }

      const k = (width / newXYR[2]);
      view = newXYR;
      label.attr('transform', d => `translate(${(d.x - newXYR[0]) * k},${(d.y - newXYR[1]) * k})`);
      node.attr('transform', d => `translate(${(d.x - newXYR[0]) * k},${(d.y - newXYR[1]) * k})`);
      node.attr('r', d => d.r * k);
    }

    // Transition visibility of labels
    function zoomToNode(newFocus) {
      // console.log("zoom -> d", d);
      const transition = svg.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween('zoom', d => {
        const i = d3.interpolateZoom(view, [newFocus.x, newFocus.y, newFocus.r * 2]);
        return t => zoomViewArea(i(t));
      });

      // Grab all nodes that were previously displayed, or who's parent is the new target newFocus
      // Transition their labels to visible or not
      label.filter(function (d) { console.log('label filtering. d=', d); return d.parent === newFocus || this.style.display === 'inline'; })
      .transition(transition)
      .style('fill-opacity', d => (d.parent === newFocus ? 1 : 0))
      .on('start', function (d) { if (d.parent === newFocus) this.style.display = 'inline'; })
      .on('end', function (d) { if (d.parent !== newFocus) this.style.display = 'none'; });

      curFocus = newFocus;
    }
  }, [colorScale, packFunc, width, height, indexToDisplay, snapshots]);

  return <svg className="perfContainer" ref={svgRef} />;
};

export default PerfView;


    // d3.quantize(d3.interpolateHcl('#60c96e', '#4d4193'), 10);
        // const colorScale = d3.scaleOrdinal(colorScheme);
