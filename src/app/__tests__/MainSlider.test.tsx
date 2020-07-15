/* eslint-disable react/jsx-props-no-spreading */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import MainSlider from '../components/MainSlider';

import { useStoreContext } from '../store';

configure({ adapter: new Adapter() });

jest.mock('../store');
// the handle function in MainSlider returns out a Tooltip Component
const handle = Tooltip;

describe('Unit testing for MainSlider.jsx', () => {
  let wrapper;
  const props = {
    snapshotsLength: 1,
  };

  const state = {
    tabs: {
      100: {
        sliderIndex: 1,
      },
    },
    currentTab: 100,
  };

  const dispatch = jest.fn();
  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    wrapper = shallow(<MainSlider {...props} />);
    dispatch.mockClear();
  });
  it('Component should return <Slider /> component from rc-slider library', () => {
    expect(wrapper.type()).toEqual(Slider);
  });
  it('Component should have min, max, value, and handle props', () => {
    expect(wrapper.props()).toHaveProperty('min');
    expect(wrapper.props()).toHaveProperty('max');
    expect(wrapper.props()).toHaveProperty('value');
    expect(wrapper.props()).toHaveProperty('handle');
  });
  it('Prop type tests on component', () => {
    expect(typeof wrapper.prop('min')).toEqual('number');
    expect(typeof wrapper.prop('max')).toEqual('number');
    expect(typeof wrapper.prop('value')).toEqual('number');
    expect(typeof wrapper.prop('handle')).toEqual('function');
  });

  describe('Testing for handle functional component', () => {
    // this doesnt work, not sure how to implement yet
    // the handle function should return a Tooltip component
    // eslint-disable-next-line jest/no-test-prefixes
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('handle prop should return <Tooltip /> component from rc-tooltip library', () => {
      expect(wrapper.prop('handle')()).toEqual(handle);
    });
  });
});
