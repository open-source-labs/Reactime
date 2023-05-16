/* eslint:disable */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebMetrics from '../components/WebMetrics';
import { expect } from 'chai';

//the WebMetrics container should render 4 <div/> elements, each with id="card"
//the WebMetrics container is itself  <div class="web-metrics-container" />
configure({ adapter: new (Adapter as any)() });

let wrapper = shallow(<WebMetrics />);

describe('WebMetrics graph testing', () => {
  it('should have 1 div with class name "metric" ', () => {
    expect(wrapper.find('.metric')).to.have.lengthOf(1);
  });

  it('should have 1 div with id "chart" ', () => {
    expect(wrapper.find('#chart')).to.have.lengthOf(1);
  });
});
