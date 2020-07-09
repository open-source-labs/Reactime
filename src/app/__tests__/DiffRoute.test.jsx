import React from 'react';
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
// import { StaticRouter } from 'react-router';

import DiffRoute from '../components/DiffRoute.jsx';

const props = {
  snapshot: [{}],
};


configure({ adapter: new Adapter() });
let wrapper;

xdescribe('DiffRoute props', () => {
  it('should have a property called snapshot', () => {

  });
  it('props snapshot value should be an array', () => {

  });
});

describe('DiffRoute component', () => {
  beforeEach(() => {
    wrapper = shallow(<DiffRoute {...props} />);
  });
  it('should contain a router component', () => {
    console.log('wrapper find route --> ', wrapper.find(Router).type());
    expect(wrapper.find(Router).type()).toEqual(Router);
  });
  it('div tag in Router should have a classname "navbar', () => {
    expect(wrapper.find('.navbar').type()).toBe('div');
  });
  it('router should have a switch component', () => {
    expect(wrapper.find(Switch).type()).toEqual(Switch);
  });
});


// check if router component has a dive with a navlik component
//check if navlinks go to appropriate routes
// check if routes in switch have appropriate props
