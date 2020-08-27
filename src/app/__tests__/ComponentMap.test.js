
import * as d3 from 'd3'

describe('canvas', ()=> {
  const getCanvas = () => {
    console.log(d3.select('#canvas'))
    return d3.select('#canvas')
  }

  it ('should exist', ()=>{
    expect(getCanvas()).not.toBeNull();
  })

  it ('should have width of 900', ()=>{
    expect(getCanvas().width).toBe(900)
  })

})