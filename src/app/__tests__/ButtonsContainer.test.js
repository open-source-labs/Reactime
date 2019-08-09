import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ButtonsContainer from '../containers/ButtonsContainer';


configure({ adapter: new Adapter() });

const props = {
  toggleMode: jest.fn(),
  importSnapshots: jest.fn(),
  exportSnapshots: jest.fn(),
  mode: {
    paused: false,
    locked: false,
    persist: false,
  },
};

describe('testing the bottom buttons', () => {
  test('if pause button is invoked', () => {
    const wrapper = shallow(<ButtonsContainer {...props} />);

    wrapper.find('.pause-button').simulate('click');

    expect(props.toggleMode).toHaveBeenCalled();
  });

  test('if lock button is invoked', () => {
    const wrapper = shallow(<ButtonsContainer {...props} />);

    wrapper.find('.lock-button').simulate('click');

    expect(props.toggleMode).toHaveBeenCalled();
  });

  test('if persist button is invoked', () => {
    const wrapper = shallow(<ButtonsContainer {...props} />);

    wrapper.find('.persist-button').simulate('click');

    expect(props.toggleMode).toHaveBeenCalled();
  });

  test('if import button is invoked', () => {
    const wrapper = shallow(<ButtonsContainer {...props} />);

    wrapper.find('.import-button').simulate('click');

    expect(props.importSnapshots).toHaveBeenCalled();
  });

  test('if export button is invoked', () => {
    const wrapper = shallow(<ButtonsContainer {...props} />);

    wrapper.find('.export-button').simulate('click');

    expect(props.exportSnapshots).toHaveBeenCalled();
  });
});
