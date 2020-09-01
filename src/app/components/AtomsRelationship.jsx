import React, { Component, useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import {sankey} from 'sankey';
import { Chart } from 'react-google-charts';

/**
 * @method maked3Tree :Creates a new D3 Tree
 */

function AtomsRelationship(props) {

  const {atomsRel} = props

  return (
    <div className="history-d3-container" id="atomsContainer">
     {atomsRel && (
       <Chart
        width={'100%'}
        height={'100%'}
        chartType="Sankey"
        options={{
          sankey: {
            link: { color: { fill: '#gray', fillOpacity: 0.1 } },
            node: {
              colors: [
                '#4a91c7',
                '#5b9bce',
                '#6ba6d5',
                '#7bb0dc',
                '#8abbe3',
                '#99c6ea',
                '#a8d0f1',
                '#b7dbf8',
                '#c6e6ff',
                '#46edf2',
                '#76f5f3',
                '#95B6B7',
                '#76dcde',
                '#5fdaed',
              ],

              label: { color: '#fff', fontSize: '13', fontName: 'Monaco', },
              nodePadding: 50,
              width: 15,
            },
          },
          tooltip: { textStyle: { color: 'white', fontSize: 0.1, }},
        }}
        loader={<div>Loading Chart</div>}
        data={[['Atom', 'Selector', ''], ...atomsRel]}
        rootProps={{ 'data-testid': '1' }}
      />)}
    </div>
  );
}

export default AtomsRelationship;
