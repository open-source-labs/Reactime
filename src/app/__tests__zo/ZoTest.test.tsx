// purpose of this file is to start testing front end/components using RTL
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import userEvent from '@testing-library/user-event';
import Header from './ZoTest';
import MainContainer from '../containers/MainContainer';
import App from '../components/App';
import SwitchAppDropdown from '../components/SwitchApp';
import { useStoreContext } from '../store';
import Dropdown from '../components/Dropdown';

interface DropdownProps {
  selectedSpeed: { value: number; label: string };
  speeds: { value: number; label: string }[];
  setSpeed: () => void;
}

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
    screen.debug();
  });

  //   test 2: test to see if functions are called properly on changes.
  test('setSpeed mock function is called correctly when speed is changed', () => {
    const currSpeed = speeds[0];
    const { container } = render(
      <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={currSpeed} />,
    );
    // grab the dropdown
    const dropdown = container.querySelector('.react-select__input');
    // console.log(dropdown);
    // select new speed from speeds arr
    fireEvent.mouseDown(dropdown);
    // const newSpeed = speeds[1];
    const newSpeed = container.querySelector('[data-value="2"]');
    // console.log('new speed', newSpeed);
    fireEvent.click(newSpeed);
    // check to see that setspeeds has been called with the new speed.
    expect(setSpeed).toHaveBeenCalled();
    expect(setSpeed).toHaveBeenCalledWith(speeds[1]);

    // check to see if new speed is rendered on the dom or something
  });
});

// const Dropdown = (props: DropdownProps): JSX.Element => {
// 	const { speeds, setSpeed, selectedSpeed } = props;
// 	return (
// 	  <Select
// 		className='react-select-container'
// 		classNamePrefix='react-select'
// 		value={selectedSpeed}
// 		onChange={setSpeed}
// 		options={speeds}
// 		menuPlacement='top'
// 	  />
// 	);
//   };

// notes: beforeAll? can render in here before then testing
// after render, can check if the element that has been rendered has props of testing data.
// issues with inrtinsic values, possibly typescript issue
// basically it seems like switchappdropdown is expecting a specific type
// but the component itself doesnt seem like it's in ts?

// Instrinsic Attributes type is a built in TS type that represents defualt attributes like id, className, style
// so maybe switchappdropdown needs be assigned a type instead of auto assigned intrinsic?
// jest.mock('../store');

// describe('Test for switchapp file', () => {
//   const state = {
//     currentTab: 100,
//     tabs: {
//       100: {
//         snapshots: [1, 2, 3, 4],
//         viewIndex: 1,
//         sliderIndex: 1,
//         title: 'hello testing',
//       },
//     },
//   };
//   const dropdownCurrTabLabel = {
//     value: 100,
//     label: 'component',
//   };
//   // create a mock function, passed as param to mocked "useSToreContext" implementation
//   const dispatch = jest.fn();

//   useStoreContext.mockImplementation(() => [state, dispatch]);

//   // beforeEach(() => {
//   //   render(<SwitchAppDropdown />);
//   //   // mock clear to clear data in between each assertion
//   //   dispatch.mockClear;
//   // });

//   // describe('switchapp component render test', () => {
//   //   fireEvent.change(screen.getByTestId('tab-select-container'), {});
//   // });

//   it('SwitchApp component renders', () => {
//     render(<SwitchAppDropdown />);
//     screen.debug();
//     // expect(screen.getByTestId('tab-select-container')).toHaveClass('tab-select-container');
//     // expect(screen.getByTestId('tab-select-container')).toHaveValue(dropdownCurrTabLabel);
//   });
// });
