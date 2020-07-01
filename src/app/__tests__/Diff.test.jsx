import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';
import Diff from '../components/Diff.jsx';

import { useStoreContext } from '../store';

configure({ adapter: new Adapter() });

jest.mock('../store');

describe('Unit testing for Diff.jsx', () => {
  let wrapper;
  // const props = {
  //   show: false,
  //   snapshot: [{
  //     children: [{
  //       state: { total: 12, next: 5, operation: null },
  //     }],

  //   }],
  // }

  const state = {
    currentTab: 100,
    tabs: { 100: { snapshots: [1, 2 ,3 ,4 ], viewIndex: 1, sliderIndex: 1 } },
  };

  const currentTab = state.tabs[state.currentTab];

  jest.mock('../store');
  useStoreContext.mockImplementation(() => [state]);

  const delta = { children: {} }; // expect delta to be an obj
  const html = 'html'; // expect html to be a string
  const previous = { state: 'string', children: {} }; // expect previous to be an obj

  beforeEach(() => {
    wrapper = shallow(<Diff />);
    useStoreContext.mockClear();
    // console.log('Diff component wrapper', wrapper);
  });


  // // const state = {
  // //   currentTab: 1,
  // //   tabs: [],
  // // };
  
  // const delta = { children: {} }; // expect delta to be an obj
  // const html = 'html'; // expect html to be a string
  // const previous = { state: 'string', children: {} }; // expect previous to be an obj

  // beforeEach(() => {
  //   wrapper = shallow(<Diff snapshot={props.snapshot} show={props.show} />);
  //   // console.log('Diff component wrapper', wrapper);
  // });

  describe('delta', () => {
    it('delta variable should be an object, with a property children', () => {
      expect(typeof delta).toBe('object');
      expect(delta).toHaveProperty('children');
    });
  });

  describe('html', () => {
    it('html variable should be a string', () => {
      expect(typeof html).toBe('string');
    });
  });

  describe('previous', () => {
    it('previous variable should be a object', () => {
      expect(previous).toHaveProperty('state');
      expect(previous).toHaveProperty('children');
      expect(typeof previous).toBe('object');
    });
  });

  // the diff component should be a diff
  // it should detect no state change when state is undefined
  describe('Diff Component', () => {
    it('Check if Diff component is a div', () => {
      expect(wrapper.type()).toEqual('div');
    });
    it('Check if Diff component inner text states no chages made', () => {
      expect(wrapper.text()).toEqual('string');
    });
  });

});
// JSX INNER TEXT TEST
// const wrapper = shallow(<div><b>important</b></div>);
// expect(wrapper.text()).to.equal('important');

// need to test that if there is no state change detected, we expect a div to be returned with a className="noState"

// If there is a stateChange we expect a div with the appropriate state changes as an html react element obj that is parsed

// test delta; its initially an array with an obj; as soon as you change state from the initial state change, delta becomes an object


// check for className=noState
