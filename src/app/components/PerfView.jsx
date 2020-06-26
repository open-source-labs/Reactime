import React, { Component } from 'react';
import * as d3 from 'd3';

let root = {};
class PerfView extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.makeChart = this.makeChart.bind(this);
    this.removeChart = this.removeChart.bind(this);
  }

  componentDidMount() {
    const { snapshot } = this.props;
    // console.log('this is snapshot on didMount chart', snapshot)
    root = JSON.parse(JSON.stringify(snapshot));
    this.makeChart();
  }

  componentDidUpdate() {
    const { snapshot } = this.props;
    // console.log('this is snapshot on didUpdate chart', snapshot)
    root = JSON.parse(JSON.stringify(snapshot));
    this.makeChart();
  }

  removeChart() {
    const { current } = this.chartRef;
    while (current.hasChildNodes()) {
      current.removeChild(current.lastChild);
    }
  }


  // const hierarchy = d3.hierarchy(root);
  // const tree = d3.tree()
  // const d3root = tree(hierarchy);
  // const node = g.selectAll('.node').data(d3root.descendants())


  makeChart() {
    this.removeChart();
    // console.log('PerfView->props.snapshot: ', props.snapshot);

    const margin = { top: 0, right: 60, bottom: 200, left: 120 };
    const width = 600 - margin.right - margin.left;
    const height = 700 - margin.top - margin.bottom;

    const hierarchy = d3.hierarchy(root);
    const partition = d3.partition()
    const d3root = partition(hierarchy);
    let focus = root;

    // const svg = d3.create('svg')
    //   .attr('viewBox', [0, 0, width, height])
    //   .style('font', '10px sans-serif');
    const svg = d3.select(this.chartRef.current)
      .append('svg') // chartContainer is now pointing to svg
      .attr('width', width)
      .attr('height', height);

    const cell = svg
      .selectAll('g')
      .data(d3root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y0},${d.x0})`);

    const rect = cell.append('rect')
      .attr('width', d => d.y1 - d.y0 - 1)
      .attr('height', d => rectHeight(d))
      .attr('fill-opacity', 0.6)
      .attr('fill', d => {
        if (!d.depth) return '#ccc';
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style('cursor', 'pointer')
      .on('click', clicked);

    const text = cell.append('text')
      .style('user-select', 'none')
      .attr('pointer-events', 'none')
      .attr('x', 4)
      .attr('y', 13)
      .attr('fill-opacity', d => +labelVisible(d));

    text.append('tspan')
      .text(d => d.data.name);

    const tspan = text.append('tspan')
      .attr('fill-opacity', d => labelVisible(d) * 0.7)
      .text(d => ` ${format(d.value)}`);

    cell.append('title')
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join('/')}\n${format(d.value)}`);

    function clicked(p) {
      focus = focus === p ? p = p.parent : p;

      d3root.each(d => d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0,
      });

      const t = cell.transition().duration(750)
        .attr('transform', d => `translate(${d.target.y0},${d.target.x0})`);

      rect.transition(t).attr('height', d => rectHeight(d.target));
      text.transition(t).attr('fill-opacity', d => +labelVisible(d.target));
      tspan.transition(t).attr('fill-opacity', d => labelVisible(d.target) * 0.7);
    }

    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }

    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }
  }    

  render() {
    return <div ref={this.chartRef} className="perfContainer" />;
  }
}

export default PerfView;


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
