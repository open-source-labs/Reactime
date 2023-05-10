import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import  '@testing-library/jest-dom/extend-expect' // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import ErrorContainer from '../containers/ErrorContainer'
import { useStoreContext } from '../store';



const state = {
    "currentTab": null,
    "currentTitle": "No Target",
    "tabs": {},
}

const MockErrorMsg = jest.fn();
jest.mock('../components/ErrorMsg', () => () => {
  MockErrorMsg();
  return (<div>MockErrorMsg</div> );
});

jest.mock('../store'); 
const dispatch = jest.fn();
useStoreContext.mockImplementation(() => [state, dispatch]);

describe('unit testing for ErrorContainer.tsx', () => {
  test("logo image renders as expected", ()=>{
    render(<ErrorContainer/>);
    expect(screen.getByAltText('Reactime Logo')).toBeInTheDocument()
  })

  test("ErrorMsg component renders as expected", ()=>{
    render(<ErrorContainer/>);
    expect(screen.getByText('MockErrorMsg')).toBeInTheDocument()
  })

  test("Reactime website shows as expected", ()=>{
    render(<ErrorContainer/>);
    expect(screen.getByText('Please visit the Reactime webiste for more info.')).toBeInTheDocument()
  })

  describe('Loading Checks show up as expected', () => {
    test("Content script launching check shows", () => {
      render(<ErrorContainer/>);
      expect(screen.getByText(`Checking if content script has been launched on current tab`)).toBeInTheDocument()
    });
    test("React Dev Tool Install check shows", () => {
      render(<ErrorContainer/>);
      expect(screen.getByText(`Checking if React Dev Tools has been installed`)).toBeInTheDocument()
    });
    test("Compatible app check shows", () => {
      render(<ErrorContainer/>);
      expect(screen.getByText(`Checking if target is a compatible React app`)).toBeInTheDocument()
    });
  });
 
  describe('Launching header shows correct tab info', () => {
    test("When currentTitle has no target", () => {
      render(<ErrorContainer/>);
      expect(screen.getByText(`Launching Reactime on tab: No Target`)).toBeInTheDocument()
      expect(screen.queryByText(`Launching Reactime on tab: Test Page`)).not.toBeInTheDocument()
    });

    test("When currentTitle has a target title", () => {
      state.currentTitle = 'Test Page'
      render(<ErrorContainer/>);
      screen.debug()
      expect(screen.getByText(`Launching Reactime on tab: Test Page`)).toBeInTheDocument()
      expect(screen.queryByText(`Launching Reactime on tab: No Target`)).not.toBeInTheDocument()

    });
  });
});
