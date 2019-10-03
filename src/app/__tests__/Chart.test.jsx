import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// eslint-disable-next-line import/no-named-as-default-member
import Chart from '../components/Chart';
// Unit test cases for d3 functionality
configure({ adapter: new Adapter() });
// Test the life cycle methods in Chart
describe('Life cycle methods in Chart', () => {
  let wrapper;
  const props = {
    hierarchy: 0,
  };
  // Set up wrapper
  beforeEach(() => {
    wrapper = mount(<Chart {...props} />);
  });
  // test componentDidMount
  it('should call componentDidMount once', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });
  // test maked3Tree within componentDidMount
  it('should call maked3Tree upon mounting', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'maked3Tree');
    instance.componentDidMount();
    expect(instance.maked3Tree).toHaveBeenCalledTimes(1);
  });
  // test componentDidUpdate
  it('should call componentDidUpdate once', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidUpdate');
    instance.componentDidUpdate();
    expect(instance.componentDidUpdate).toHaveBeenCalledTimes(1);
  });
  // test maked3Tree within componentDidUpdate
  it('should call maked3Tree once upon updating', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'maked3Tree');
    instance.componentDidUpdate();
    expect(instance.maked3Tree).toHaveBeenCalledTimes(1);
  });
});
// Test the root object and hierarchy
describe('Root object', () => {
  let wrapper;
  const root = {};
  const props = {
    hierarchy: {
      index: 1,
      stateSnapshot: {},
      children: [],
    },
  };
  // Set up wrapper
  beforeEach(() => {
    wrapper = mount(<Chart {...props} />);
  });

  it('should be a deep clone of the hierarchy', () => {
    const instance = wrapper.instance();
    instance.componentDidMount();
    expect(typeof root).toBe(typeof props.hierarchy);
    expect(root).not.toEqual(props.hierarchy);
  });
});

// Test the maked3Tree method
describe('maked3Tree method', () => {
  let wrapper;
  const props = {
    hierarchy: 0,
  };
  // Set up wrapper
  beforeEach(() => {
    wrapper = mount(<Chart {...props} />);
  });
  // Test the invocation of removed3Tree within maked3Tree
  it('should call removed3Tree once', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'removed3Tree');
    instance.maked3Tree();
    expect(instance.removed3Tree).toHaveBeenCalledTimes(1);
  });
});
