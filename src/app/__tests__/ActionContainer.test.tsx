/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';

import TravelContainer from '../containers/TravelContainer';
import { useDispatch, useSelector } from 'react-redux';
import {store} from '../RTKstore';
import { Provider } from 'react-redux';
import { mainSlice } from '../RTKslices';
const state = {
  tabs: {
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
  },
  currentTab: 87,
};
const dispatch = useDispatch();
// const dispatch = jest.fn();
// jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
// jest.mock('../store');

// const mockeduseStoreContext = jest.mocked(useStoreContext);
// mockeduseStoreContext.mockImplementation(() => [state, dispatch]);

// const getStateMock = jest.spyOn(store, 'getState').mockReturnValue(state.main); // Replace 'state' with your desired initial state


// const dispatchMock = jest.spyOn(store, 'dispatch'); // Create a spy for the dispatch function

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

describe('unit testing for ActionContainer', () => {
  beforeEach(() => {
    // mockeduseStoreContext.mockClear();
    // dispatch.mockClear();
    render(
    <Provider store={store}>
      <ActionContainer actionView={true} />
      </Provider>
    );
  });

  test('Expect top arrow to be rendered', () => {
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  test('Expect RouteDescription to be rendered', () => {
    expect(screen.getAllByText('MockRouteDescription')).toHaveLength(2);
  });

  test('Expect SwitchApp to be rendered', () => {
    expect(screen.getByText('MockSwitchApp')).toBeInTheDocument();
  });

  test('Click works on clear button', () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});

describe('integration testing for ActionContainer', () => {
  beforeEach(() => {
    // mockeduseStoreContext.mockClear();
    // dispatch.mockClear();
    render(
      <Provider store={store}>
    <ActionContainer actionView={true} />
    </Provider>
    );
    render(
      <Provider store={store}>
    <TravelContainer snapshotsLength={0} />
    </Provider>
    );
  });

  test('Slider resets on clear button', () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByRole('slider')).toHaveStyle('left: 0');
  });
});


// To convert your existing test file to use Redux Toolkit, you need to update your test setup to work with Redux Toolkit's `configureStore` and create a Redux store. Assuming you already have a Redux store and slice set up, here's how you can modify your test file:

// 1. Import `configureStore` from Redux Toolkit and the Redux store you want to use in your tests.

// ```javascript
// import { render, screen, fireEvent } from '@testing-library/react';
// import { Provider } from 'react-redux'; // Import Provider from react-redux
// import { configureStore } from '@reduxjs/toolkit'; // Import configureStore from Redux Toolkit
// import ActionContainer from '../containers/ActionContainer';
// import TravelContainer from '../containers/TravelContainer';

// // Import your Redux store and slice here if not already done
// import { rootReducer } from '../store'; // Replace with your actual reducer and store
// ```

// 2. Create a Redux store with `configureStore` and pass it as a prop to your components.

// ```javascript
// const store = configureStore({
//   reducer: rootReducer, // Replace with your actual reducer
// });

// describe('unit testing for ActionContainer', () => {
//   beforeEach(() => {
//     render(
//       <Provider store={store}>
//         <ActionContainer actionView={true} />
//       </Provider>
//     );
//   });

//   // Your tests here
// });

// describe('integration testing for ActionContainer', () => {
//   beforeEach(() => {
//     render(
//       <Provider store={store}>
//         <ActionContainer actionView={true} />
//         <TravelContainer snapshotsLength={0} />
//       </Provider>
//     );
//   });

//   // Your tests here
// });
// ```

// 3. Ensure that you import and use `useDispatch` from `react-redux` for your component testing as follows:

// ```javascript
// import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector from react-redux
// ```

// And in your component code where you use `dispatch`, use `useDispatch`:

// ```javascript
// const dispatch = useDispatch();
// ```

// 4. Update your tests accordingly to work with Redux Toolkit's `configureStore`. For example, if you have a test that checks if `dispatch` is called, you can do something like this:

// ```javascript
// test('Click works on clear button', () => {
//   const { getByRole } = render(
//     <Provider store={store}>
//       <ActionContainer actionView={true} />
//     </Provider>
//   );

//   fireEvent.click(getByRole('button'));
//   expect(dispatch).toHaveBeenCalledTimes(1);
// });
// ```

// With these modifications, your test file should work with Redux Toolkit and your existing Redux store and slice. Make sure to replace `rootReducer` with your actual reducer and adjust the imports as needed for your project's structure.
