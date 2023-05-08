/// in progress
import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import  '@testing-library/jest-dom/extend-expect' // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import TravelContainer from '../containers/TravelContainer' 
import MainSlider from '../components/MainSlider';
// import {mockMainSlider} from '../components/__mocks__/MainSlider'
import { useStoreContext } from '../store';
import { TravelContainerProps } from '../components/FrontendTypes';
import MainContainer from '../containers/MainContainer'
import Dropdown from '../components/Dropdown'



const state = {
  tabs: {
    87: {
      snapshots: [0, 1, 2, 3], // because snapshot index starts at 0
      sliderIndex: 3,
      playing: false,
    },
  },
  currentTab: 87,
};


const dispatch = jest.fn(); 
useStoreContext.mockImplementation(() => [state, dispatch]);



// jest.mock mocks a module - all exports of this module are basically set to jest.fn() 
jest.mock('../store'); 

// mocking the Mainslider component to return div with MockSlider in it  
const mockSlider = jest.fn();
jest.mock("../components/MainSlider", () => (props) => {
  mockSlider(props);
  return (
  <div>
    MockSlider
   </div> 
    );
});
const mockDropDown = jest.fn();

// mocking the dropdown component to return div with mockDropDown in it  
jest.mock("../components/Dropdown", () => (props) => {
  mockDropDown(props);
  return (
  <div>
    mockDropDown
   </div> 
    );
});



describe('testing the TravelContainer module',()=>{
  // nested blocks.
  // high level block, test that the play button exists, slider gets renders, dropdown gets rendered.
    // nested: play button. when paused vs not. starts at a condition, then pressed is changed into another condition. 

  // before each, clear usestorcontext and dispatch
  beforeEach(() => {
    useStoreContext.mockClear();  // need to think about if mockClear is the correct item here
    dispatch.mockClear();
    render(<TravelContainer snapshotsLength={0}/>);


  })

  screen.debug()

  test('first button contains text Play',()=>{
    let buttons = screen.getAllByRole('button')
     expect(buttons[0]).toHaveTextContent('Play')
  })

  test('MainSlider exists in document',()=>{
   
    expect(screen.getByText('MockSlider')).toBeInTheDocument();


  })
  test('Dropdown exists in document',()=>{

    expect(screen.getByText('mockDropDown')).toBeInTheDocument();

})

  // describe('When paused and user click pause/play button',()=>{
  //   //
  // })

  // describe('When playing and user clicks',()=>{
  //   //
  // })


  
})




