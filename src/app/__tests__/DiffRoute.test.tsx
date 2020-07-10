import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';

import DiffRoute from '../components/DiffRoute.jsx';

const props = {
  snapshot: [{}],
};


configure({ adapter: new Adapter() });
let wrapper;

describe('DiffRoute props', () => {
  it('should have a property called snapshot', () => {
    expect(props).toHaveProperty('snapshot');
  });
  it('props snapshot value should be an array', () => {
    expect(Array.isArray(props.snapshot)).toBe(true);
  });
});

describe('DiffRoute component', () => {
  beforeEach(() => {
    wrapper = shallow(<DiffRoute />);
  });
  it('should contain a router component', () => {
    expect(wrapper.find(Router).type()).toEqual(Router);
  });
  it('div tag in Router should have a classname "navbar', () => {
    expect(wrapper.find('.navbar').type()).toBe('div');
  });
  it('router should have a switch component', () => {
    expect(wrapper.find(Switch).type()).toEqual(Switch);
  });
});

// remaining tests:
// check if router component has a div with a navlik component
// check if navlinks go to appropriate routes, and text shows Tree and Raw
// check if routes in switch have appropriate props
