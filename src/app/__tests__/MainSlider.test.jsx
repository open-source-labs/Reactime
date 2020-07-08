/* eslint-disable react/jsx-props-no-spreading */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import MainSlider from '../components/MainSlider';

import { useStoreContext } from '../store';

configure({ adapter: new Adapter() });

const dispatch = jest.fn();
jest.mock('../store');
const props = {
  snapshotsLength: 1,
}
const state = {
  tabs: {
    87: {}
  },
  currentTab: 87,
};

useStoreContext.mockImplementation(() => [state, dispatch]);
let wrapper;

describe('Unit testing for MainSlider.jsx', () => {
  beforeEach(() => {
    wrapper = shallow(<MainSlider {...props} />);
  });
  it('Component should retrun', () => {
    expect(wrapper.type()).toEqual(Slider);
  });
});
