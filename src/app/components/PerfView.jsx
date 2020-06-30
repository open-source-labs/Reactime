/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line object-curly-newline
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { addNewSnapshots } from '../actions/actions';

const chartData = {
  name: 'App',
  actualDuration: 35000,
  value: 17010,
  children: [
   { name: 'DisplayPanel', actualDuration: 35000, value: 17010 },
   { name: 'AltDisplay', actualDuration: 35000, value: 5842 },
   { name: 'MarketSContainer', actualDuration: 35000, value: 1041 },
   { name: 'MainSlider', actualDuration: 35000, value: 5176 },
  ],
 };

const PerfView = ({
  width = 200,
  height = 200,
  // snapshots
}) => {
  // const chartData = snapshots;
  // const chartData = snapshots[snapshots.length - 1].children[0];
  // console.log("snapshots", snapshots);
  console.log("chartData", chartData);

  const svgRef = useRef(null);

  // returns color scale function
  const color = d3.scaleLinear()
    .domain([0, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // create a new circle packing layout function
  const packFunc = data => d3.pack()
    .size([width, height])
    .padding(3)(d3.hierarchy(data)
      .sum(d => d.actualDuration)
      .sort((a, b) => b.actualDuration - a.actualDuration));

  useEffect(() => {
    const packedRoot = packFunc(chartData);
    console.log('** PerfView -> packedRoot', packedRoot);
    let focus = packedRoot;
    let view;

    const svg = d3.select(svgRef.current)
      .on('click', () => zoom(packedRoot));

    const node = svg.append('g')
      .selectAll('circle')
      .data(packedRoot.descendants().slice(1))  
      // .join('circle')
      .enter()
      .append('circle')
      .attr('fill', d => (d.children ? color(d.depth) : 'white'))
      .attr('pointer-events', d => (!d.children ? 'none' : null))
      .on('mouseover', function () { d3.select(this).attr('stroke', '#000'); })
      .on('mouseout', function () { d3.select(this).attr('stroke', null); })
      .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()));

    const label = svg.append('g')
      .style('font', '11px sans-serif')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(packedRoot.descendants())
      // .join('text')
      .enter()
      .append('text')
      .style('fill-opacity', d => (d.parent === packedRoot ? 1 : 0))
      .style('display', d => (d.parent === packedRoot ? 'inline' : 'none'))
      .text(d => `${d.name}: ${Number.parseFloat(d.actualDuration).toFixed(2)}ms`);

    console.log('PerfView -> node', node);
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
  }, [chartData]);

  return <svg viewBox="-250 -250 500 500" className="perfContainer" ref={svgRef} />;
};


export default PerfView;
