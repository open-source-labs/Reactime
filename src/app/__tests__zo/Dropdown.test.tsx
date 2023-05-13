// purpose of this file is to start testing front end/components using RTL
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)

import Dropdown from '../components/Dropdown';

describe('Dropdown test', () => {
  const speeds = [
    { value: 1, label: 'test1' },
    { value: 2, label: 'test2' },
    { value: 3, label: 'test3' },
  ];
  //   make a hook call into a jest mock
  const setSpeed = jest.fn();

  //   test 1: test to see if it renders the label correctly
  test('renders Dropdown with correct info', () => {
    // find a specific speed from array. could be testing each? one for now.
    const currSpeed = speeds[0];
    // you pass in what is expected from TS, passed into Dropdown NOT the return statement.
    // in this case, the dropdownprops interface.
    // assign it to a container which is the document i guess?
    const { container } = render(
      <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={currSpeed} />,
    );
    // then we can query the container like a normal dom, with query selector
    expect(container.querySelector('.react-select__single-value')).toHaveTextContent('test1');
    // want to test for speeds but not showing up?
    // screen.debug is only what is rendered, so no functions
    // test to see if setSpeed is called
    //
    // screen.debug();
  });

  //   test 2: test to see if functions are called properly on changes.
  //   test('setSpeed mock function is called correctly when speed is changed', () => {
  //     const currSpeed = speeds[0];
  //     const { container } = render(
  //       <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={currSpeed} />,
  //     );
  //     // grab the dropdown
  //     const dropdown = container.querySelector('.react-select__input');
  //     // console.log(dropdown);
  //     // select new speed from speeds arr
  //     fireEvent.mouseDown(dropdown);
  //     // const newSpeed = speeds[1];
  //     const newSpeed = container.querySelector('[data-value="2"]');
  //     // console.log('new speed', newSpeed);
  //     fireEvent.click(newSpeed);
  //     // check to see that setspeeds has been called with the new speed.
  //     expect(setSpeed).toHaveBeenCalled();
  //     expect(setSpeed).toHaveBeenCalledWith(speeds[1]);

  //     // check to see if new speed is rendered on the dom or something
  //   });
});
