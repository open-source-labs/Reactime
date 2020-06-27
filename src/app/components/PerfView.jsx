/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// let root = {};
const chartData = {
  name: 'flare',
  children: [
    {
      name: 'analytics',
      children: [
        {
          name: 'cluster',
          children: [
            { name: 'AgglomerativeCluster', size: 3938 },
            { name: 'CommunityStructure', size: 3812 },
            { name: 'MergeEdge', size: 743 },
          ],
        },
        {
          name: 'graph',
          children: [
            { name: 'BetweennessCentrality', size: 3534 },
            { name: 'LinkDistance', size: 5731 },
          ],
        },
      ],
    },
  ],
};

const PerfView = ({ width, height }) => {
  console.log('Rendering Performance - chartData: ', chartData);

  const d3gRef = useRef(null);
  // returns color scale function
  const color = d3.scaleLinear()
    .domain([0, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // returns a function that formats numbers
  const numFormat = d3.format(',d');

  const margin = {
    top: 0, right: 60, bottom: 200, left: 120,
  };

  // create a new circle packing layout function
  const pack = data => d3.pack()
    .size([width, height])
    .padding(3)(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

  useEffect(() => {
    const hierarchy = d3.hierarchy(chartData);
    console.log('PerfView -> hierarchy', hierarchy);

    const dataRoot = pack(hierarchy);
    console.log('PerfView -> dataRoot', dataRoot);

    const gElem = d3.select(d3gRef);

    gElem.selectAll('circle')
      .data(dataRoot.descendants().slice(1))
      .enter().append('circle')
      .attr('fill', d => (d.children ? color(d.depth) : 'white'));
  }, [chartData]);

  return (
    <svg width={width} height={height} className="d3Container">
      <g ref={d3gRef} transform={`translate(${50} ${50})`} />
      <rect width="100" height="100" x="50" y="20" />
    </svg>
  );
};

export default PerfView;

/* eslint-disable indent */


// const data = {
//   type,
//   elementType,
//   children,
//   pendingProps,
//   memoizedProps,
//   stateNode,
//   memoizedState,
//   actualDuration,
//   actualStartTime,
//   selfBaseDuration,
//   treeBaseDuration
// }


// const dataMax = d3.max(props.data);

// const yScale = d3.scaleLinear()
//   .domain([0, dataMax])
//   .range([0, props.size[1]]);

// d3.select(thisRef.current)
//   .selectAll('rect')
//   .data(props.data)
//   .enter()
//   .append('rect');

// d3.select(thisRef.current)
//   .selectAll('rect')
//   .data(props.data)
//   .exit()
//   .remove();

// d3.select(thisRef.current)
//   .selectAll('rect')
//   .data(props.data)
//   .style('fill', '#fe9922')
//   .attr('x', (d, i) => i * 25)
//   .attr('y', d => props.size[1] - yScale(d))
//   .attr('height', d => yScale(d))
//   .attr('width', 25);


// const PerfView = ({ width, height }) => {
//   const chartData = {
//     name: 'flare',
//     children: [
//       {
//         name: 'analytics',
//         children: [
//           {
//             name: 'cluster',
//             children: [
//               { name: 'AgglomerativeCluster', size: 3938 },
//               { name: 'CommunityStructure', size: 3812 },
//               { name: 'MergeEdge', size: 743 },
//             ],
//           },
//           {
//             name: 'graph',
//             children: [
//               { name: 'BetweennessCentrality', size: 3534 },
//               { name: 'LinkDistance', size: 5731 },
//             ],
//           },
//         ],
//       },
//     ],
//   };
//   console.log('Rendering Performance - chartData: ', chartData);

//   const d3gRef = useRef(null);
//   // returns color scale function
//   const color = d3.scaleLinear()
//     .domain([0, 5])
//     .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
//     .interpolate(d3.interpolateHcl);

//   // returns a function that formats numbers
//   const numFormat = d3.format(',d');

//   const margin = {
//     top: 0, right: 60, bottom: 200, left: 120,
//   };

//   // create a new circle packing layout function
//   const pack = data => d3.pack()
//     .size([width, height])
//     .padding(3)(d3.hierarchy(data)
//       .sum(d => d.value)
//       .sort((a, b) => b.value - a.value));

//   useEffect(() => {
//     const hierarchy = d3.hierarchy(chartData);
//     console.log('PerfView -> hierarchy', hierarchy);
//     // const dataRoot = pack(chartData);
//     const dataRoot = pack(hierarchy);
//     console.log('PerfView -> dataRoot', dataRoot);
//     // const focus = dataRoot;
//     // let view;

//     // const svg = d3.create('svg')
//     //   .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
//     //   .style('display', 'block')
//     //   .style('margin', '0 -14px')
//     //   .style('background', color(0))
//     //   .style('cursor', 'pointer');
//     //   .on('click', () => zoom(dataRoot));

//     const gElem = d3.select(d3gRef);
//     // const node = g.append('g')
//     const node = gElem.selectAll('circle')
//       .data(dataRoot.descendants().slice(1));
//       // .join('circle')
//     node.enter().append('circle')
//       .attr('fill', d => (d.children ? color(d.depth) : 'white'));
//     // .attr('pointer-events', d => (!d.children ? 'none' : null))
//     // .on('mouseover', function () { d3.select(this).attr('stroke', '#000'); })
//     // .on('mouseout', function () { d3.select(this).attr('stroke', null); })
//     // .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()));

//     // const label = g.append('g')
//     //   .style('font', '10px sans-serif')
//     //   .attr('pointer-events', 'none')
//     //   .attr('text-anchor', 'middle')
//     //   .selectAll('text')
//     //   .data(dataRoot.descendants())
//     //   // .join('text')
//     //   .enter()
//     //   .append('text')
//     //   .style('fill-opacity', d => (d.parent === dataRoot ? 1 : 0))
//     //   .style('display', d => (d.parent === dataRoot ? 'inline' : 'none'))
//     //   .text(d => d.data.name);
//   }, [chartData]);

//   // return (<svg ref={d3svgRef} width={width} height={height} />);
//   return (
//     <svg width={width} height={height} className="d3Container">
//       <g ref={d3gRef} transform={`translate(${50} ${50})`} />
//       <rect width="100" height="100" x="50" y="20" />
//     </svg>
//   );
// };
