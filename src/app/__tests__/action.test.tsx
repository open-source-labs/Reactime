/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Action from '../components/Action';
import { changeView, changeSlider } from '../actions/actions';

configure({ adapter: new Adapter() });

describe('unit testing for Action.jsx', () => {
  let wrapper;
  const props = {
    key:'actions2',
    selected: true,
    last: false,
    index: 2,
    sliderIndex: 2,
    dispatch: jest.fn(),
    displayName: '3.0',
    componentName: 'App',
    componentData: {
      actualDuration: 3.5,
    },
    state: { test: 'test' },
    viewIndex: 2,
    handleOnkeyDown: jest.fn(),
  };
  beforeEach(() => {
    wrapper = shallow(<Action {...props} />);
    props.dispatch.mockClear();
  });

  describe('Component', () => {
    test("should have a className 'action-component selected' if props.selected is true", () => {
      wrapper.setProps({ selected: true });
      expect(wrapper.hasClass('action-component selected')).toEqual(true);
    });

    test("shouldn't have a className 'action-component selected' if props.selected is false", () => {
      wrapper.setProps({ selected: false });
      expect(wrapper.hasClass('action-component selected')).toEqual(false);
    });

    test('should have a text that is equal to props.index', () => {
      expect(wrapper.find('.action-component-text').text()).toEqual(`${props.displayName}:  ${props.componentName} `);
    });

    test('should invoke dispatch method when clicked', () => {
      wrapper.find('.action-component').simulate('click');
      expect(props.dispatch).toHaveBeenCalled();
    });

    test('dispatch should send a changeView action', () => {
      wrapper.find('.action-component').simulate('click');
      expect(props.dispatch.mock.calls[0][0]).toEqual(changeView(props.index));
    });
  });

  describe('Jump Button', () => {
    test("should render a div with a className 'jump-button' inside action-component", () => {
      expect(
        wrapper
          .find('.action-component')
          .children()
          .find('.jump-button'),
      ).toHaveLength(1);
    });

    test('should invoke dispatch method when clicked', () => {
      wrapper.find('.jump-button').simulate('click', { stopPropagation() {} });
      expect(props.dispatch).toHaveBeenCalled();
    });

    test('dispatch should send a changeSlider action', () => {
      wrapper.find('.jump-button').simulate('click', { stopPropagation() {} });
      expect(props.dispatch.mock.calls[0][0]).toEqual(changeSlider(props.index));
    });
  });
});
