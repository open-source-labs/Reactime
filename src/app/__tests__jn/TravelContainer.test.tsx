import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import  '@testing-library/jest-dom/extend-expect' // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import TravelContainer from '../containers/TravelContainer' 
import { useStoreContext } from '../store';
import { TravelContainerProps } from '../components/FrontendTypes';


// const state = {
//   tabs: {
//     87: {
//       snapshots: [0, 1, 2, 3], // because snapshot index starts at 0
//       sliderIndex: 3,
//       playing: false,
//     },
//   },
//   currentTab: 87,
// };


//  jest.fn() mocks a function - Create a new mock that can be used in place of `dispatch`.
const dispatch = jest.fn(); 
const play = jest.fn(); 



// jest.mock mocks a module - all exports of this module are basically set to jest.fn() 
jest.mock('../store'); 

// useStoreContext is a mocked function that accepts a function that should be used as the implmentaton of the mock
// useStoreContext is being mocked and should use to function in arg -> return the state item and dispatch (mocked function)

describe('when user loads a page with only one snapshot included and user has not played',()=>{

  const state = {
  tabs: {
    87: {
      snapshots: [0,1,2], // because snapshot index starts at 0
      sliderIndex: 1,
      playing: false,
    },
  },
  currentTab: 87,
};

useStoreContext.mockImplementation(() => [state, dispatch]);

    beforeEach(() => {
    useStoreContext.mockClear();  // need to think about if mockClear is the correct item here
    dispatch.mockClear();

  })
      render(<TravelContainer snapshotsLength={0}/>);
      // @ts-ignore
    let slider1 = screen.getByRole<HTMLInputElement>('slider',{ value: {now:1, min:0, max:0}})

     // @ts-ignore
    let slider0 = screen.getByRole<HTMLInputElement>('slider',{ value: {now:0, min:0, max:0}})
    let slider = screen.getByRole('slider')

    screen.debug(screen.getAllByRole('slider'))

  test('first button contains text Play',()=>{
    let buttons = screen.getAllByRole('button')
     expect(buttons[0]).toHaveTextContent('Play')
  })

   test('slider icon is at the very left',()=>{
    render(<TravelContainer snapshotsLength={0}/>);
    // @ts-ignore
    // let slider = screen.getByRole<HTMLInputElement>('slider',{ value: {now:1, min:0, max:0}})
 
     expect(slider1).not.toBeInTheDocument()
     expect(slider0).not.toBeInTheDocument()
  })

})
