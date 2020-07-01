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

import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
// import { addNewSnapshots } from '../actions/actions';

// const windowRef = useRef(null);
// const winWidth = null;
// const winHeight = null;

// useEffect(() => {
//   if (windowRef.current) {
//     winWidth = windowRef.current.offsetHeight;
//     winHeight = windowRef.current.offsetWidth;
//     console.log('** SETTING WINDOW SIZES: ', winWidth, winHeight);
//   }
// }, [windowRef]);

const PerfView = ({ snapshots, viewIndex }) => {
  const [chartData, updateChartData] = useState(snapshots[snapshots.length - 1]);
  const svgRef = useRef(null);

  // Todo: implement update functions...
  const [curZoom, setZoom] = useState(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);

  // set up color scaling function
  const color = d3.scaleLinear()
    .domain([0, 7])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // set up circle-packing layout function
  const packFunc = data => d3.pack()
    .size([width, height])
    .padding(3)(d3.hierarchy(data)
      .sum(d => {
        // console.log('in pack func. d=', d);
        return d.componentData.actualDuration;
      })
      .sort((a, b) => {
        // console.log('in sort func. a&b=', a, b);
        return b.value - a.value;
      }));

  console.log('packFunc', packFunc);

  useEffect(() => {
    console.log('PerfView -> snapshots', snapshots);
    console.log('Current viewIndex: ', viewIndex);
    for (let i = 0; i < snapshots.length; i++) {
      console.log(`SNAPSHOT[${i}] App actualDuration:`, snapshots[i].children[0].componentData.actualDuration);
    }

    // empty old tree
    while (svgRef.current.hasChildNodes()) {
      svgRef.current.removeChild(svgRef.current.lastChild);
    }

    if (viewIndex < 0) {
      updateChartData(snapshots[snapshots.length - 1]);
      console.log(`Using snapshots[${snapshots.length - 1}]`);
    } else {
      updateChartData(snapshots[viewIndex]);
      console.log(`Using snapshots[${viewIndex}]`);
    }

    console.log('PerfView -> chartData', chartData);

    // generate tree with our data
    const packedRoot = packFunc(chartData);
    // console.log('PerfView -> packedRoot', packedRoot);

    // initial focus points at root of tree
    let focus = packedRoot;
    let view;

    // set up viewBox dimensions and onClick for parent svg
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .on('click', () => zoom(packedRoot));

    // connect circles below root to data
    const node = svg.append('g')
      .selectAll('circle')
      .data(packedRoot.descendants().slice(1))
      .enter().append('circle')
      .attr('fill', d => (d.children ? color(d.depth) : 'white'))
      .attr('pointer-events', d => (!d.children ? 'none' : null))
      .on('mouseover', () => d3.select(this).attr('stroke', '#000'))
      .on('mouseout', () => d3.select(this).attr('stroke', null))
      .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()));

    // console.log('PerfView -> node', node);
    // console.log('packedRoot.descendants()', packedRoot.descendants());

    // generate text labels
    const label = svg.append('g')
      .attr('class', 'perf-chart-labels')
      .selectAll('text')
      .data(packedRoot.descendants())
      .enter().append('text')
      .style('fill-opacity', d => (d.parent === packedRoot ? 1 : 0))
      .style('display', d => (d.parent === packedRoot ? 'inline' : 'none'))
      .text(d => {
        console.log('generating text label for d: ', d);
        return `${d.data.name}: ${Number.parseFloat(d.data.componentData.actualDuration).toFixed(2)}ms`;
      });

    label.exit().remove();
    node.exit().remove();

    // console.log('PerfView -> label', label);

    // jump to default zoom state
    zoomTo([packedRoot.x, packedRoot.y, packedRoot.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];
      view = v;
      label.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('r', d => d.r * k);
    }

    function zoom(d) {
      const focus0 = focus;
      focus = d;

      const transition = svg.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween('zoom', d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });

      label
      .filter(function (d) { return d.parent === focus || this.style.display === 'inline'; })
      .transition(transition)
        .style('fill-opacity', d => (d.parent === focus ? 1 : 0))
        .on('start', function (d) { if (d.parent === focus) this.style.display = 'inline'; })
        .on('end', function (d) { if (d.parent !== focus) this.style.display = 'none'; });
    }
  }, [snapshots.length, height, width, viewIndex]);

  return <svg className="perfContainer" ref={svgRef} />;
};

export default PerfView;
