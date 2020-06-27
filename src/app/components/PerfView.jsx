import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerfView = props => {
  
  const thisRef = useRef(null);
  // const thisRef = React.createRef();
  
  useEffect(() => {
    // const { node } = this;

    const dataMax = d3.max(props.data);

    const yScale = d3.scaleLinear()
      .domain([0, dataMax])
      .range([0, props.size[1]]);

    d3.select(thisRef.current)
      .selectAll('rect')
      .data(props.data)
      .enter()
      .append('rect');

    d3.select(thisRef.current)
      .selectAll('rect')
      .data(props.data)
      .exit()
      .remove();
 
    d3.select(thisRef.current)
      .selectAll('rect')
      .data(props.data)
      .style('fill', '#fe9922')
      .attr('x', (d, i) => i * 25)
      .attr('y', d => props.size[1] - yScale(d))
      .attr('height', d => yScale(d))
      .attr('width', 25);
  });

  return (<svg ref={thisRef} width={500} height={500} />);
};

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
