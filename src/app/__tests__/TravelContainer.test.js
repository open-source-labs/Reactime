import { shallow, configure } from 'enzyme';

import React from 'react';

import TravelContainer from '../containers/TravelContainer';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() })

const props = {
  moveBackward: jest.fn(),
  moveForward: jest.fn(),
  snapshotsLength: 5,
  handleChangeSnapshot: jest.fn(),
  handleJumpSnapshot: jest.fn(),
  snapshotIndex: 6,
  play: jest.fn(),
  playing: false,
  pause: jest.fn()
}

describe('testing the backward and forward buttons', () => {
  test('if the backward button rewinds the playback', () => {
    const wrapper = shallow(<TravelContainer {...props} />);

    wrapper.find('.backward-button').simulate('click');

    expect(props.moveBackward).toHaveBeenCalled();
  }),

  test('if the forward button forwards the playback', () => {
    const wrapper = shallow(<TravelContainer {...props} />);

    wrapper.find('.forward-button').simulate('click');

    expect(props.moveForward).toHaveBeenCalled();
  })
})

describe('testing the play button', () => {
  test('if the play button starts the playback', () => {
    const wrapper = shallow(<TravelContainer {...props} />);

    wrapper.find('.play-button').simulate('click');

    expect(props.play).toHaveBeenCalled();
  }),

  test("if playback is not running, the button should state 'Play'", () => {
    const wrapper = shallow(<TravelContainer {...props} />);

    wrapper.find('.play-button');

    expect(wrapper.find('.play-button').text()).toBe('Play');
  }),

  test("if playback is running, the button should state 'Pause'", () => {
    props.playing = true;
    
    const wrapper = shallow(<TravelContainer {...props} />);

    wrapper.find('.play-button');


    expect(wrapper.find('.play-button').text()).toBe('Pause');
  })
})