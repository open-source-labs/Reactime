import React, { Component, useEffect, useState } from 'react';
import * as d3 from 'd3';

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

const filterHooks = (data: any[]) => {
  if (data[0].children && data[0].state === 'stateless') {
    return filterHooks(data[0].children);
  }
  return JSON.stringify(data[0].state);
};

interface HistoryProps {
  hierarchy: Record<string, unknown>;
}


/**
 * @method maked3Tree :Creates a new D3 Tree
 */

function AtomsRelationship(props) {
  let { hierarchy } = props;
  let root = JSON.parse(JSON.stringify(hierarchy));
  let isRecoil = false;
  let HistoryRef = React.createRef(root); //React.createRef(root);

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
    removed3Tree();
  };

  return (
    <div className="history-d3-container">
      <div ref={HistoryRef} className="history-d3-div" />
    </div>
  );
}

export default AtomsRelationship;
