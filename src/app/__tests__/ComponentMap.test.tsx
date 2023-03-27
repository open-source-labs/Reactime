/* eslint:disable */

import * as d3 from 'd3';

describe('D3Canvas Testing', () => {
  const getCanvas = () => {
    return d3.select('#canvas');
  };

  it('should exist', () => {
    expect(getCanvas()).not.toBeNull();
  });
});

describe('D3 Node Testing', () => {
  const getNodes = () => {
    return d3.select('g');
  };

  it('should exist', () => {
    expect(getNodes()).not.toBeNull();
  });
});
