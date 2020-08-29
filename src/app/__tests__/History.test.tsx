/* eslint:disable */

import * as d3 from 'd3'

describe('D3 Canvas Testing', ()=> {
  const getCanvas = () => {
    return d3.select('#canvas')
  }

  it ('should render', ()=>{
    expect(getCanvas()).not.toBeNull();
  })

})

describe('D3 Node Testing', ()=> {
  const getNodes = () => {
    return d3.select('g')
  }

  it ('should render', () => {
    expect(getNodes()).not.toBeNull();
  })


})