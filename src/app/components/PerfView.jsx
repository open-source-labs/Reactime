/* eslint-disable class-methods-use-this */
// eslint-disable-next-line object-curly-newline
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const chartData = {
  name: 'App',
  children: [
   { name: 'DisplayPanel', value: 17010 },
   { name: 'AltDisplay', value: 5842 },
   {
    name: 'Button Panel',
    children: [
     { name: 'Button', value: 10000 },
     { name: 'Button', value: 2047 },
     { name: 'Button', value: 1375 },
     { name: 'Button', value: 8746 },
     { name: 'Button', value: 2202 },
     { name: 'Button', value: 1382 },
     { name: 'Button', value: 1629 },
     { name: 'Button', value: 1675 },
     { name: 'Button', value: 2042 },
    ],
   },
   { name: 'MarketSContainer', value: 1041 },
   { name: 'MainSlider', value: 5176 },
   { name: 'Tree', value: 449 },
   { name: 'AnotherTree', value: 5593 },
   { name: 'TreeOfTrees', value: 5534 },
   { name: 'KanyeWest', value: 9201 },
   { name: 'ElectricMeatloaf', value: 19975 },
   { name: 'GuidoTheKillerPimp', value: 1116 },
   { name: 'Gravy', value: 6006 },
  ],
 };

const PerfView = ({ width=200, height=200 }) => {
  const svgRef = useRef(null);
  // returns color scale function
  const color = d3.scaleLinear()
    .domain([0, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // returns a function that formats numbers
  const numFormat = d3.format(',d');

  const margin = { top: 0, right: 60, bottom: 200, left: 120, };

  // create a new circle packing layout function
  const packFunc = data => d3.pack()
    .size([width, height])
    .padding(3)(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

  useEffect(() => {
    // const hierarchy = d3.hierarchy(chartData);
    const packedRoot = packFunc(chartData);
    console.log('** PerfView -> packedRoot', packedRoot);
    let focus = packedRoot;
    let view;

    const svg = d3.select(svgRef.current)
      .attr('class', 'd3Container')
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .style('display', 'block')
      .style('margin', '0 -14px')
      .style('background', color(0))
      .style('cursor', 'pointer')
      .on('click', () => zoom(packedRoot));

    console.log('packedRoot.descendents().slice(1)', packedRoot.descendants().slice(1));

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
      .style('font', '10px sans-serif')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(packedRoot.descendants())
      // .join('text')
      .enter()
      .append('text')
      .style('fill-opacity', d => (d.parent === packedRoot ? 1 : 0))
      .style('display', d => (d.parent === packedRoot ? 'inline' : 'none'))
      .text(d => d.data.name);

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

  return <svg ref={svgRef} />;
};

// class PerfView extends React.Component {
//   constructor(props) {
//     super(props);
//     this.svgRef = React.createRef(null);
//     // returns color scale function
//     this.color = d3.scaleLinear()
//       .domain([0, 5])
//       .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
//       .interpolate(d3.interpolateHcl);
  
//     // returns a function that formats numbers
//     this.numFormat = d3.format(',d');
  
//     this.margin = { top: 0, right: 60, bottom: 200, left: 120, };
  
//     // create a new circle packing layout function
//     this.packFunc = data => d3.pack()
//       .size([this.props.width, this.props.height])
//       .padding(3)(d3.hierarchy(data)
//       .sum(d => d.value)
//       .sort((a, b) => b.value - a.value));
      
//       this.drawChart = this.drawChart.bind(this);
//   }

//   componentDidMount() {
//     this.drawChart();
//   }
  
//   componentDidUpdate() {
//     this.drawChart();
//   }

//   drawChart() {
//     console.log("PerfView -> drawChart -> chartData", chartData)
//     console.log("PerfView -> drawChart -> this.props.width", this.props.width)
//     const packedRoot = this.packFunc(chartData);
//     // console.log('** PerfView -> packedRoot', packedRoot);
//     let focus = packedRoot;
//     let view;
//     console.log('packedRoot.descendents().slice(1)', packedRoot.descendants().slice(1));

//     const svg = d3.select(this.svgRef.current)
//       .attr('class', 'd3Container')
//       .attr('viewBox', `-${this.props.width / 2} -${this.props.height / 2} ${this.props.width} ${this.props.height}`)
//       .style('display', 'block')
//       .style('margin', '0 -14px')
//       .style('background', this.color(0))
//       .style('cursor', 'pointer')
//       .on('click', () => zoom(packedRoot));


//     const node = svg.append('g')
//       .selectAll('circle')
//       .data(packedRoot.descendants().slice(1))
//       // .join('circle')
//       .enter()
//       .append('circle')
//       .attr('fill', d => (d.children ? this.color(d.depth) : 'white'))
//       .attr('pointer-events', d => (!d.children ? 'none' : null))
//       .on('mouseover', function () { d3.select(this).attr('stroke', '#000'); })
//       .on('mouseout', function () { d3.select(this).attr('stroke', null); })
//       .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()));

//     const label = svg.append('g')
//       .style('font', '10px sans-serif')
//       .attr('pointer-events', 'none')
//       .attr('text-anchor', 'middle')
//       .selectAll('text')
//       .data(packedRoot.descendants())
//       // .join('text')
//       .enter()
//       .append('text')
//       .style('fill-opacity', d => (d.parent === packedRoot ? 1 : 0))
//       .style('display', d => (d.parent === packedRoot ? 'inline' : 'none'))
//       .text(d => d.data.name);

//     console.log('PerfView -> node', node);
    
//     zoomTo([packedRoot.x, packedRoot.y, packedRoot.r * 2], this.props.width);

//     function zoomTo(v, width) {
//       const k = width / v[2];
//       view = v;

//       label.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
//       node.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
//       node.attr('r', d => d.r * k);
//     }

//     function zoom(d) {
//       const focus0 = focus;

//       focus = d;

//       const transition = svg.transition()
//           .duration(d3.event.altKey ? 7500 : 750)
//           .tween('zoom', d => {
//             const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
//             return t => zoomTo(i(t));
//           });

//       label
//         .filter(function (d) { return d.parent === focus || this.style.display === 'inline'; })
//         .transition(transition)
//           .style('fill-opacity', d => (d.parent === focus ? 1 : 0))
//           .on('start', function (d) { if (d.parent === focus) this.style.display = 'inline'; })
//           .on('end', function (d) { if (d.parent !== focus) this.style.display = 'none'; });
//     }
//   }

//   render() {
//     return <svg ref={this.svgRef} />;
//   }
// }

export default PerfView;