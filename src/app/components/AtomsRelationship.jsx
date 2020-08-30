import React, { Component, useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import {sankey} from 'sankey';
import { Chart } from "react-google-charts";
/**
 * @var colors: Colors array for the diffrerent node branches, each color is for a different branch
 */
const colors = [
  '#95B6B7',
  '#475485',
  '#519331',
  '#AA5039',
  '#8B2F5F',
  '#C5B738',
  '#858DFF',
  '#FF8D02',
  '#FFCD51',
  '#ACDAE6',
  '#FC997E',
  '#CF93AD',
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2C4870',
];

// interface HistoryProps {
//   hierarchy: Record<string, unknown>;
// }

const data = {
  nodes: [ 
    {
      name: 'atom 1',
      category: 1
    },
    {
      name: 'atom 2',
      category: 1
    },
    {
      name: 'atom 3',
      category: 1
    },
    {
      name: 'selector 1',
      category: 2
    },
    {
      name: 'selector 2',
      category: 2
    },
    {
      name: 'component 1',
      category: 3
    },
    {
      name: 'component 2',
      category: 3
    },
    {
      name: 'component 3',
      category: 3
    },
  ],
  links: [
    {
      source: "atom 1",
      target: "select 1",
      value: 100
    },
    {
      source: "atom 1",
      target: "component 1",
      value: 100
    },
    {
      source: "atom 2",
      target: "component 2",
      value: 100
    },
    {
      source: "atom 2",
      target: "select 2",
      value: 100
    },
    {
      source: "atom 3",
      target: "component 3",
      value: 100
    },
    {
      source: "selector 2",
      target: "component 1",
      value: 100
    },
    {
      source: "selector 1",
      target: "component 1",
      value: 100
    },
  ]

}



/**
 * @method maked3Tree :Creates a new D3 Tree
 */

function AtomsRelationship(props) {
  // let { hierarchy } = props;
  // let root = JSON.parse(JSON.stringify(hierarchy));
  // let HistoryRef = React.createRef(root); //React.createRef(root);
  console.log('Props', props.atomsRel);
  useEffect(() => {
    maked3Tree();
  }, [root]);

  let removed3Tree = function () {
    const { current } = HistoryRef;
    while (current.hasChildNodes()) {
      current.removeChild(current.lastChild);
    }
  };

  /**
   * @method maked3Tree Creates a new Tree History
   * @var
   */
  let maked3Tree = function () {
    // removed3Tree();
    // const dimension = {width: 800, height: 500};
    // const margin = {left: 10, right: 10, top:10, bottom:10};

    // const svg = d3.select(HistoryRef.current)
    //               .append('svg')
    //               .attr('width', dimension.width)
    //               .attr('height', dimension.height);
    
    // const graph = svg.append('g')
    //         .attr('width', dimension.width - margin.left - margin.right)
    //         .attr('width', dimension.height - margin.top - margin.bottom);
    
    // // const sankey = d3.sankey()
    // //                   .nodeWidth(36)
    // //                   .nodePadding(290)
    // //                   .size([dimension.width, dimension.height])
    // console.log(data);
    // let a = sankey.nodes(data.nodes).links(data.links).layout(1);
    // console.log(a);
    // console.log(d3);
    return 2
  };

  return (
    <div className="history-d3-container">
      {/* <div ref={HistoryRef} className="history-d3-div" /> */}
<Chart
  width={600}
  height={'300px'}
  chartType="Sankey"
  loader={<div>Loading Chart</div>}
  data={[
    ['From', 'To', 'Weight'],
        ...props.atomsRel
    // ['Brazil', 'Portugal', 5],
    // ['Brazil', 'France', 1],
    // ['Brazil', 'Spain', 1],
    // ['Brazil', 'England', 1],
    // ['Canada', 'Portugal', 1],
    // ['Canada', 'France', 5],
    // ['Canada', 'England', 1],
    // ['Mexico', 'Portugal', 1],
    // ['Mexico', 'France', 1],
    // ['Mexico', 'Spain', 5],
    // ['Mexico', 'England', 1],
    // ['USA', 'Portugal', 1],
    // ['USA', 'France', 1],
    // ['USA', 'Spain', 1],
    // ['USA', 'England', 5],
    // ['Portugal', 'Angola', 2],
    // ['Portugal', 'Senegal', 1],
    // ['Portugal', 'Morocco', 1],
    // ['Portugal', 'South Africa', 3],
    // ['France', 'Angola', 1],
    // ['France', 'Senegal', 3],
    // ['France', 'Mali', 3],
    // ['France', 'Morocco', 3],
    // ['France', 'South Africa', 1],
    // ['Spain', 'Senegal', 1],
    // ['Spain', 'Morocco', 3],
    // ['Spain', 'South Africa', 1],
    // ['England', 'Angola', 1],
    // ['England', 'Senegal', 1],
    // ['England', 'Morocco', 2],
    // ['England', 'South Africa', 7],
    // ['South Africa', 'China', 5],
    // ['South Africa', 'India', 1],
    // ['South Africa', 'Japan', 3],
    // ['Angola', 'China', 5],
    // ['Angola', 'India', 1],
    // ['Angola', 'Japan', 3],
    // ['Senegal', 'China', 5],
    // ['Senegal', 'India', 1],
    // ['Senegal', 'Japan', 3],
    // ['Mali', 'China', 5],
    // ['Mali', 'India', 1],
    // ['Mali', 'Japan', 3],
    // ['Morocco', 'China', 5],
    // ['Morocco', 'India', 1],
    // ['Morocco', 'Japan', 3],
  ]}
  rootProps={{ 'data-testid': '2' }}
/>
    </div>
  );
}

export default AtomsRelationship;
