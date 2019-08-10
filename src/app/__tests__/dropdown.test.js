/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dropdown from '../components/Dropdown';

configure({ adapter: new Adapter() });

describe('unit testing for Dropdown.jsx', () => {
  let wrapper;
  const props = {
    options: [
      { value: 2000, label: '0.5x' },
      { value: 1000, label: '1.0x' },
      { value: 500, label: '2.0x' },
    ],
    handleChangeSpeed: jest.fn(),
    selectedOption: { value: 1000, label: '1.0x' },
  };
  beforeEach(() => {
    wrapper = shallow(<Dropdown {...props} />);
  });

  describe('Component', () => {
    test('array of objects that have value and label should be options props', () => {
      expect(wrapper.props().options).toEqual(props.options);
    });
    test('selectedOption should be value property', () => {
      expect(wrapper.props().value).toEqual(props.selectedOption);
    });
  });

  describe('handlechangeSpeed', () => {
    test('should invoke handleChangeSpeed onChange', () => {
      wrapper.simulate('change', { value: 2000, label: '0.5x' });
      expect(props.handleChangeSpeed).toHaveBeenCalled();
    });
  });
});
