/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import History from '../components/History';


// Unit test cases for d3 functionality
configure({ adapter: new (Adapter as any)() });

// Test the life cycle methods in History
describe('Life cycle methods in History', () => {
  let wrapper;
  const props = {
    hierarchy: {
      branch: 0,
      children : [
        {
          index:1,
          name:2,
          branch:0,
          stateSnapshot:{},
          children: []
        }
      ],
      index : 0,
      name : 1,
      stateSnapshot : {
        children:[
          {
          children: [],
          componentData: {
            actualDuration : 1.0,
            actualStartTime : 1.0,
            selfBaseDuration : 1.0,
            treeBaseDuration : 1.0,
        },
        name: 'root',
        state: 'stateless'
      }
    ],
        componentData: {},
        name: "root",
        state: "root"
      }
    },
  };
  // Set up wrapper
  beforeEach(() => {
    console.log(props)
    wrapper = mount(<History {...props} />);
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
    wrapper = mount(<History {...props} />);
  });

  // eslint-disable-next-line jest/no-disabled-tests
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
    wrapper = mount(<History {...props} />);
  });
  // Test the invocation of removed3Tree within maked3Tree
  it('should call removed3Tree once', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'removed3Tree');
    instance.maked3Tree();
    expect(instance.removed3Tree).toHaveBeenCalledTimes(1);
  });
});
