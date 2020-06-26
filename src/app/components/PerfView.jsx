import React, { Component } from 'react';
import * as d3 from 'd3';

const root = {};
class PerfView extends Component {
  constructor(props) {
    super(props);
    // this.chartRef = React.createRef();
    this.makeChart = this.makeChart.bind(this);
    // this.removeChart = this.removeChart.bind(this);
  }

  componentDidMount() {
    // const { snapshot } = this.props;
    // console.log('this is snapshot on didMount chart', snapshot)
    // root = JSON.parse(JSON.stringify(snapshot));
    this.makeChart();
  }

  componentDidUpdate() {
    // const { snapshot } = this.props;
    // console.log('this is snapshot on didUpdate chart', snapshot)
    // root = JSON.parse(JSON.stringify(snapshot));
    this.makeChart();
  }

  // removeChart() {
  //   const { current } = this.chartRef;
  //   while (current.hasChildNodes()) {
  //     current.removeChild(current.lastChild);
  //   }
  // }

  createBarChart() {
    const { node } = this;
    const dataMax = d3.max(this.props.data);
    const yScale = d3.scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]]);

    d3.select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect');

    d3.select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove();

    d3.select(node)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('x', (d, i) => i * 25)
      .attr('height', d => yScale(d))
      .attr('width', 25);
  }

  render() {
    return (
      <svg
        ref={node => this.node = node}
        width={500}
        height={500}
      />
    );
  }
}


export default PerfView;

// .attr('y', d => this.props.size[1] — yScale(d))

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
