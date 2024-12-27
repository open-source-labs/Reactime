import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useDispatch } from 'react-redux';
import { changeView, changeSlider } from '../slices/mainSlice';
import { useTheme } from '../ThemeProvider';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice';

import Action from '../components/Actions/Action';
import RouteDescription from '../components/Actions/RouteDescription';
import DropDown from '../components/Actions/DropDown';
import RecordButton from '../components/Actions/RecordButton';
import ThemeToggle from '../components/Actions/ThemeToggle';
import VerticalSlider from '../components/TimeTravel/VerticalSlider';
import ProvConContainer from '../containers/ProvConContainer';
import ActionContainer from '../containers/ActionContainer';

// Mock react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Helper function for redux wrapped renders
const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

// RouteDescription Component Tests
describe('RouteDescription Component', () => {
  // Create a mock store with initial state that matches your mainSlice structure
  const mockStore = configureStore({
    reducer: {
      main: mainSlice.reducer,
    },
    preloadedState: {
      main: {
        port: null,
        currentTab: 0,
        currentTitle: 'No Target',
        tabs: {
          0: {
            currLocation: {
              index: 0,
              stateSnapshot: {},
            },
            hierarchy: {},
            sliderIndex: 0,
            viewIndex: 0,
            snapshots: [],
            playing: false,
            intervalId: null,
            mode: { paused: false },
            status: {
              reactDevToolsInstalled: true,
              targetPageisaReactApp: true,
            },
          },
        },
        currentTabInApp: null,
        connectionStatus: true,
        connectRequested: true,
      },
    },
  });

  const mockActions = [
    {
      props: {
        routePath: 'http://example.com/test-route',
        key: 'action0',
        index: 0,
        state: {},
        displayName: '1.0',
        componentName: 'TestComponent',
        componentData: { actualDuration: 0 },
        selected: false,
        last: false,
        sliderIndex: 0,
        viewIndex: 0,
        isCurrIndex: false,
      },
    },
  ];

  // Mock the vertical slider component
  jest.mock('../components/TimeTravel/VerticalSlider.tsx', () => {
    return function MockVerticalSlider({ snapshots }) {
      return <div data-testid='mock-slider'>{snapshots.length} snapshots</div>;
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders route path correctly', () => {
    render(
      <Provider store={mockStore}>
        <RouteDescription actions={mockActions as unknown as JSX.Element[]} />
      </Provider>,
    );
    expect(screen.getByText('Route: /test-route')).toBeInTheDocument();
  });

  test('renders actions container with correct height', () => {
    render(
      <Provider store={mockStore}>
        <RouteDescription actions={mockActions as unknown as JSX.Element[]} />
      </Provider>,
    );
    // @ts-ignore
    const container = screen.getByClassName('route-content');
    expect(container).toHaveStyle({ height: `${mockActions.length * 40.5}px` });
  });
});

// Action Component Tests
// describe('Action Component', () => {
//   // @ts-ignore
//   const useDispatchMock = useDispatch as jest.Mock;
//   const dummyDispatch = jest.fn();
//   useDispatchMock.mockReturnValue(dummyDispatch);

//   const props = {
//     key: 'actions2',
//     selected: true,
//     last: false,
//     index: 2,
//     sliderIndex: 2,
//     isCurrIndex: false,
//     routePath: '',
//     displayName: '3.0',
//     componentName: 'App',
//     logChangedState: jest.fn(),
//     componentData: {
//       actualDuration: 3.5,
//     },
//     state: { test: 'test' },
//     viewIndex: 2,
//     handleOnkeyDown: jest.fn(),
//   };

//   beforeEach(() => {
//     props.isCurrIndex = false;
//     props.componentData = { actualDuration: 3.5 };
//   });

//   test('Action snapshot should be shown as Snapshot: 3.0', () => {
//     render(<Action {...props} />);
//     expect(screen.getByPlaceholderText('Snapshot: 3.0')).toBeInTheDocument();
//   });

//   test('Two buttons with Time and Jump when not at current snapshot', () => {
//     props.isCurrIndex = false;
//     render(<Action {...props} />);
//     expect(screen.getAllByRole('button')).toHaveLength(2);
//     expect(screen.getAllByRole('button')[0]).toHaveTextContent('+00:03.50');
//     expect(screen.getAllByRole('button')[1]).toHaveTextContent('Jump');
//   });

//   test('Two buttons with Time and Current when at current snapshot', () => {
//     props.isCurrIndex = true;
//     render(<Action {...props} />);
//     expect(screen.getAllByRole('button')).toHaveLength(1);
//     expect(screen.getAllByRole('button')[0]).toHaveTextContent('Current');
//   });

//   test('When there is no duration data', () => {
//     // @ts-ignore
//     props.componentData = undefined;
//     render(<Action {...props} />);
//     expect(screen.getAllByRole('button')[0]).toHaveTextContent('NO TIME');
//   });

//   test('When actualDuration exceeds 60, time should be formatted correctly', () => {
//     props.componentData.actualDuration = 75;
//     render(<Action {...props} />);
//     expect(screen.getAllByRole('button')[0]).toHaveTextContent('+01:15.00');
//   });

//   test('Clicking the snapshot should trigger onClick', () => {
//     render(<Action {...props} />);
//     fireEvent.click(screen.getByRole('presentation'));
//     expect(dummyDispatch).toHaveBeenCalledWith(changeView(props.index));
//   });

//   test('Clicking Jump button should trigger changeSlider and changeView', () => {
//     render(<Action {...props} />);
//     fireEvent.click(screen.getAllByRole('button')[1]);
//     expect(dummyDispatch).toHaveBeenCalledWith(changeSlider(props.index));
//     expect(dummyDispatch).toHaveBeenCalledWith(changeView(props.index));
//   });
// });

// // VerticalSlider Component Tests
// describe('VerticalSlider Component', () => {
//   const useDispatchMock = jest.fn();
//   const dummyDispatch = jest.fn();

//   // Define the mock state
//   const mockState = {
//     main: {
//       tabs: {
//         0: {
//           currLocation: { index: 1 },
//         },
//       },
//       currentTab: 0,
//     },
//   };

//   const mockStore = configureStore({
//     reducer: {
//       // @ts-ignore
//       main: mainSlice.reducer,
//     },
//     preloadedState: mockState,
//   });

//   // Helper function to create store with custom state
//   const createMockStore = (state: any) =>
//     configureStore({
//       reducer: {
//         // @ts-ignore
//         main: mainSlice.reducer,
//       },
//       preloadedState: state,
//     });

//   const mockSnapshots = [{ props: { index: 0 } }, { props: { index: 1 } }, { props: { index: 2 } }];

//   beforeEach(() => {
//     useDispatchMock.mockClear();
//     useDispatchMock.mockReturnValue(dummyDispatch);
//   });

//   test('renders slider with correct min and max values', () => {
//     render(
//       <Provider store={mockStore}>
//         <VerticalSlider snapshots={mockSnapshots} />
//       </Provider>,
//     );

//     const slider = screen.getByRole('slider');
//     expect(slider).toHaveAttribute('aria-valuemin', '0');
//     expect(slider).toHaveAttribute('aria-valuemax', '2');
//   });

//   test('updates slider index when currLocation changes', () => {
//     const { rerender } = render(
//       <Provider store={mockStore}>
//         <VerticalSlider snapshots={mockSnapshots} />
//       </Provider>,
//     );

//     const updatedState = {
//       ...mockState,
//       main: {
//         ...mockState.main,
//         tabs: {
//           0: {
//             currLocation: { index: 2 },
//           },
//         },
//       },
//     };

//     rerender(
//       <Provider store={createMockStore(updatedState)}>
//         <VerticalSlider snapshots={mockSnapshots} />
//       </Provider>,
//     );

//     const slider = screen.getByRole('slider');
//     expect(slider).toHaveAttribute('aria-valuenow', '2');
//   });

//   test('handles empty snapshots array', () => {
//     render(
//       <Provider store={mockStore}>
//         <VerticalSlider snapshots={[]} />
//       </Provider>,
//     );

//     const slider = screen.getByRole('slider');
//     expect(slider).toHaveAttribute('aria-valuemin', '0');
//     expect(slider).toHaveAttribute('aria-valuemax', '-1');
//     expect(slider).not.toHaveAttribute('aria-valuenow');
//   });

//   test('maintains slider position within bounds', () => {
//     const outOfBoundsState = {
//       ...mockState,
//       main: {
//         ...mockState.main,
//         tabs: {
//           0: {
//             currLocation: { index: 999 }, // intentionally out of bounds
//           },
//         },
//       },
//     };

//     render(
//       <Provider store={createMockStore(outOfBoundsState)}>
//         <VerticalSlider snapshots={mockSnapshots} />
//       </Provider>,
//     );

//     const slider = screen.getByRole('slider');
//     // It seems the component defaults to 0 for out-of-bounds values
//     expect(slider).toHaveAttribute('aria-valuenow', '0');
//   });
// });
