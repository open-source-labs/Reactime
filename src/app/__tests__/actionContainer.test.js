import { shallow, configure } from 'enzyme';

import React from 'react';

import ActionContainer from '../containers/ActionContainer';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() })

const props = {
    snapshots: [],
    snapshotIndex: 1,
    handleChangeSnapshot: jest.fn(),
    handleJumpSnapshot: jest.fn(),
    emptySnapshot: jest.fn()
}


describe('testing the emptySnapshot button', () => {
  test('emptySnapshot button should be called', () => { 
    
    const wrapper = shallow((<ActionContainer { ...props }/>));

    wrapper.find('.empty-button').simulate('click');
    
    expect(props.emptySnapshot).toHaveBeenCalled();
  });
})