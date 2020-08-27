import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ComponentMap from '../components/ComponentMap'
import * as d3 from 'd3'

describe('canvas', ()=> {
  const getCanvas = () => {
    console.log(d3.select('#canvas'))
    return d3.select('#canvas')
  }

  it ('should exist', ()=>{
    expect(getCanvas()).not.toBeNull();
  })
})