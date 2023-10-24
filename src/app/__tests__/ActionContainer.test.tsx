import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';
import TravelContainer from '../containers/TravelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice'
import { useDispatch } from 'react-redux';
//Note for testing:
//typically, jest.mock is commonly used in unit testing to isolate the code under test. 
//In contrast, when performing integration testing of components with a real Redux store, 
//you typically don't need to use jest.mock because you're interested in testing how the real components interact with the actual store. 
//The decision to use jest.mock depends on the type of testing (unit or integration) and your specific testing goals.

    const customTabs = {
        87: {
          snapshots: [1, 2, 3, 4],
          hierarchy: {
            index: 0,
            name: 1,
            branch: 0,
            stateSnapshot: {
              state: {},
              children: [
                {
                  state: { test: 'test' },
                  name: 'App',
                  componentData: { actualDuration: 3.5 },
                },
              ],
              route: {
                id: 1,
                url: 'http://localhost:8080/',
              },
            },
            children: [
              {
                index: 1,
                name: 2,
                branch: 0,
                stateSnapshot: {
                  state: {},
                  children: [
                    {
                      state: { test: 'test' },
                      name: 'App',
                      componentData: { actualDuration: 3.5 },
                    },
                  ],
                  route: {
                    id: 2,
                    url: 'http://localhost:8080/',
                  },
                },
                children: [
                  {
                    index: 2,
                    name: 3,
                    branch: 0,
                    stateSnapshot: {
                      state: {},
                      children: [
                        {
                          state: { test: 'test' },
                          name: 'App',
                          componentData: { actualDuration: 3.5 },
                        },
                      ],
                      route: {
                        id: 3,
                        url: 'http://localhost:8080/',
                      },
                    },
                    children: [
                      {
                        index: 3,
                        name: 4,
                        branch: 0,
                        stateSnapshot: {
                          state: {},
                          children: [
                            {
                              state: { test: 'test' },
                              name: 'App',
                              componentData: { actualDuration: 3.5 },
                            },
                          ],
                          route: {
                            id: 4,
                            url: 'http://localhost:8080/test/',
                          },
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          currLocation: {
            index: 0,
            name: 1,
            branch: 0,
          },
          sliderIndex: 0,
          viewIndex: -1,
        },
      }

    const customInitialState = {
        main: {
          port: null,
          currentTab: 87, // Update with your desired value
          currentTitle: 'test string',
          tabs: customTabs, // Replace with the actual (testing) tab data
          currentTabInApp: 'test string',
          connectionStatus: false,
          connectRequested: true,
        },
      };

const customStore = configureStore({
  reducer: {
    main: mainSlice.reducer,
  },
  preloadedState: customInitialState, // Provide custom initial state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const render = component => rtlRender(
    <Provider store={customStore}>
      {component}
    </Provider>
);

const MockRouteDescription = jest.fn();
jest.mock('../components/RouteDescription', () => () => {
  MockRouteDescription();
  return <div>MockRouteDescription</div>;
});

const MockSwitchApp = jest.fn();
jest.mock('../components/SwitchApp', () => () => {
  MockSwitchApp();
  return <div>MockSwitchApp</div>;
});
//need to add this mockFunction for setActionView
//because in actual actioncontainer componenent, it is prop drilled down from maincontainer
//here we set it as a jest.fn() 
//then we pass it into our actionContainer on render
const setActionViewMock = jest.fn();
const toggleActionContainer = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
  useDispatch: jest.fn(), // set up a mock function for useDispatch
}));

// const dispatch = jest.fn();

describe('unit testing for ActionContainer', ()=>{
  const useDispatchMock = useDispatch as jest.Mock; //getting a reference to the mock function you setup during jest.mock configuration on line 18
  const dummyDispatch = jest.fn(); //separate mock function created because we need to explicitly define on line 30 what 
  useDispatchMock.mockReturnValue(dummyDispatch);//exactly useDispatchMock returns (which is a jest.fn())
  beforeEach(()=>{
    render(<ActionContainer actionView={true} setActionView={setActionViewMock}  toggleActionContainer ={toggleActionContainer}/>)
  });

  test('expect top arrow to be rendered', ()=>{
    // render(<ActionContainer actionView = {true} setActionView={setActionViewMock}/>)
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  test('Expect RouteDescription to be rendered', () => {
    // render(<ActionContainer actionView = {true} setActionView={setActionViewMock}/>)
    expect(screen.getAllByText('MockRouteDescription')).toHaveLength(2);
  });

  test('Expect SwitchApp to be rendered', () => {
    // render(<ActionContainer actionView = {true} setActionView={setActionViewMock}/>)
    expect(screen.getByText('MockSwitchApp')).toBeInTheDocument();
  });

  test('Click works on clear button', () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });
})

describe('Integration testing for ActionContainer.tsx', () => {
    test('renders the ActionContainer component', () => {
        //tests that the clearButton is rendered by testing if we can get "Clear"
        //need to set actionView to true to correctly render clearbutton
        render(<ActionContainer setActionView={setActionViewMock} actionView={true} toggleActionContainer={toggleActionContainer}/>);
        const clearButton = screen.getByText('Clear'); // Use an existing element
        expect(setActionViewMock).toHaveBeenCalledWith(true);
        expect(clearButton).toBeInTheDocument();
      });

      test('Slider resets on clear button', ()=>{
        render(<ActionContainer actionView = {true} setActionView={setActionViewMock} toggleActionContainer={toggleActionContainer}/>)
        render( <TravelContainer snapshotsLength={0} />)
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByRole('slider')).toHaveStyle('left: 0');
      });
});



