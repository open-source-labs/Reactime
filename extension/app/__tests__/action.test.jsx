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
    handleSendSnapshot: jest.fn(),
    index: 1,
  };
  beforeEach(() => {
    wrapper = shallow(<Action {...props} />);
  });

  describe('<Action> component', () => {
    it("<Action> should have a className 'action-component selected' if props.selected is true", () => {
      wrapper.setProps({ selected: true });
      expect(wrapper.hasClass('action-component selected')).toEqual(true);
    });

    it("<Action> shouldn't have a className 'action-component selected' if props.selected is false", () => {
      wrapper.setProps({ selected: false });
      expect(wrapper.hasClass('action-component selected')).toEqual(false);
    });

    it('<Action> should have a text that is equal to props.index', () => {
      expect(wrapper.find('.action-component-text').text()).toEqual(props.index.toString());
    });
  });

  describe('jump button', () => {
    it('Should render a jump button', () => {
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.find('button')).toHaveLength(1);
    });

    it('Should invoke the sendSnapshot method when the jump button is clicked', () => {
      wrapper
        .find('button')
        .at(0)
        .simulate('click');
      expect(props.handleSendSnapshot).toHaveBeenCalled();
    });
  });
});
