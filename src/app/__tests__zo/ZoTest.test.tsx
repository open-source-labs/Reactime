// purpose of this file is to start testing front end/components using RTL
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Header from './ZoTest';
import MainContainer from '../containers/MainContainer';
import App from '../components/App';
import SwitchAppDropdown from '../components/SwitchApp';
import { useStoreContext } from '../store';
import Dropdown from '../components/Dropdown';

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
