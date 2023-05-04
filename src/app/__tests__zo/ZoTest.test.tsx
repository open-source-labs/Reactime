// purpose of this file is to start testing front end/components using RTL
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Header from './ZoTest';
import MainContainer from '../containers/MainContainer';
import App from '../components/App';
import SwitchAppDropdown from '../components/SwitchApp';

// notes: beforeAll? can render in here before then testing
// after render, can check if the element that has been rendered has props of testing data.
// issues with inrtinsic values, possibly typescript issue
// basically it seems like switchappdropdown is expecting a specific type
// but the component itself doesnt seem like it's in ts?

// Instrinsic Attributes type is a built in TS type that represents defualt attributes like id, className, style
// so maybe switchappdropdown needs be assigned a type instead of auto assigned intrinsic? 

describe('Tests for components', () => {
  describe('Testing Switchapp', () => {
    let dropdown;
    const props = {
      currTab: {
        label: 'Testing',
        value: 12353,
      },
      styles: {},
      options: [],
    };
    test('Testing', () => {
      render(<SwitchAppDropdown value= />);
    });
  });
});

// return (
//   <Select
//     className='tab-select-container'
//     classNamePrefix='tab-select'
//     value={currTab}
//     styles={customStyles}
//     onChange={(e) => {
//       dispatch(setTab(parseInt(e.value, 10)));
//     }}
//     options={tabsArray}
//   />
// );
// describe('LabeledText', () => {
//   let text;
//   const props = {
//     label: 'Mega',
//     text: 'Markets',
//   };

//   beforeAll(() => {
//     text = render(<LabeledText {...props} />)

//   });

//   test('Renders the passed-in text with the label in bold', () => {
//     expect(text.getByText("Mega:").nextSibling).toHaveTextContent('Markets');
//     expect(text.getByText('Mega:')).toHaveStyle('font-weight: bold')
//   });
// console.log('currTab', currTab);
// console.log('customStyles', customStyles);
// console.log('tabsArray', tabsArray);
