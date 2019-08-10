/* eslint-disable react/jsx-filename-extension */

import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ActionContainer from '../containers/ActionContainer';


configure({ adapter: new Adapter() });

const props = {
  snapshots: [],
  snapshotIndex: 1,
  handleChangeSnapshot: jest.fn(),
  handleJumpSnapshot: jest.fn(),
  emptySnapshot: jest.fn(),
};


describe('testing the emptySnapshot button', () => {
  test('emptySnapshot button should be called', () => {
    const wrapper = shallow((<ActionContainer {...props} />));

    wrapper.find('.empty-button').simulate('click');

    expect(props.emptySnapshot).toHaveBeenCalled();
  });
});
