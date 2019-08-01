import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Action from '../components/Action';

configure({ adapter: new Adapter() });

describe('unit testing for Action.jsx', () => {
  let wrapper;
  const props = {
    selected: true,
    handleChangeSnapshot: jest.fn(),
    handleJumpSnapshot: jest.fn(),
    index: 1,
  };
  beforeEach(() => {
    wrapper = shallow(<Action {...props} />);
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
      expect(wrapper.find('.action-component-text').text()).toEqual(props.index.toString());
    });

    test('should invoke changeSnapshot method when clicked', () => {
      wrapper.find('.action-component').simulate('click');
      expect(props.handleChangeSnapshot).toHaveBeenCalled();
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

    test('should invoke jumpSnapshot method when clicked', () => {
      wrapper
        .find('.action-component')
        .children()
        .find('.jump-button')
        .simulate('click');
      expect(props.handleJumpSnapshot).toHaveBeenCalled();
    });
  });
});
