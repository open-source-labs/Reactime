import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useDispatch } from 'react-redux';
import { mainSlice, changeSlider, emptySnapshots } from '../slices/mainSlice';

import { useTheme } from '../ThemeProvider';
import { configureStore } from '@reduxjs/toolkit';

import DropDown from '../components/Actions/DropDown';
import RecordButton from '../components/Actions/RecordButton';
import ThemeToggle from '../components/Actions/ThemeToggle';
import ProvConContainer from '../containers/ProvConContainer';
import ActionContainer from '../containers/ActionContainer';

// @ts-ignore
const useDispatchMock = useDispatch as jest.Mock;
const dummyDispatch = jest.fn();

// Mock ThemeToggle for RecordButton tests
jest.mock('../components/Actions/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <div data-testid='mock-theme-toggle'>Theme Toggle</div>;
  };
});

// Mock useTheme hook
jest.mock('../ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

// Mock react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Setup mock before tests
beforeAll(() => {
  useDispatchMock.mockReturnValue(dummyDispatch);
});

// Clear mocks after each test
afterEach(() => {
  dummyDispatch.mockClear();
});

// Helper function for redux wrapped renders
const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

// DropDown Component Tests
describe('DropDown Component', () => {
  const mockSetDropdownSelection = jest.fn();

  beforeEach(() => {
    mockSetDropdownSelection.mockClear();
  });

  test('renders with placeholder text', () => {
    render(<DropDown dropdownSelection='' setDropdownSelection={mockSetDropdownSelection} />);
    expect(screen.getByText('Select Hook')).toBeInTheDocument();
  });

  test('shows correct options when clicked', () => {
    render(<DropDown dropdownSelection='' setDropdownSelection={mockSetDropdownSelection} />);
    const dropdown = screen.getByText('Select Hook');
    fireEvent.mouseDown(dropdown);
    expect(screen.getByText('Time Jump')).toBeInTheDocument();
    expect(screen.getByText('Providers / Consumers')).toBeInTheDocument();
  });

  test('displays selected value', () => {
    render(
      <DropDown dropdownSelection='Time Jump' setDropdownSelection={mockSetDropdownSelection} />,
    );
    expect(screen.getByText('Time Jump')).toBeInTheDocument();
  });
});

// RecordButton Component Tests
describe('RecordButton Component', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  test('renders record button with initial state', () => {
    render(<RecordButton isRecording={false} onToggle={mockOnToggle} />);
    expect(screen.getByText('Record')).toBeInTheDocument();
  });

  test('calls onToggle when switch is clicked', () => {
    render(<RecordButton isRecording={false} onToggle={mockOnToggle} />);
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    expect(mockOnToggle).toHaveBeenCalled();
  });

  test('renders ThemeToggle component', () => {
    render(<RecordButton isRecording={false} onToggle={mockOnToggle} />);
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument();
  });
});

// // ThemeToggle Component Tests
describe('ThemeToggle Component', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    mockToggleTheme.mockClear();
    (useTheme as jest.Mock).mockImplementation(() => ({
      isDark: false,
      toggleTheme: mockToggleTheme,
    }));
  });

  test('renders theme toggle', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument();
  });

  test('renders with correct text', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('mock-theme-toggle')).toHaveTextContent('Theme Toggle');
  });

  test('toggles between light and dark mode classes', () => {
    // First render in light mode
    (useTheme as jest.Mock).mockImplementation(() => ({
      isDark: false,
      toggleTheme: mockToggleTheme,
    }));
    const { rerender } = render(<ThemeToggle />);
    const toggle = screen.getByTestId('mock-theme-toggle');
    expect(toggle).toHaveClass('theme-toggle');
    expect(toggle).not.toHaveClass('dark');

    // Rerender in dark mode
    (useTheme as jest.Mock).mockImplementation(() => ({
      isDark: true,
      toggleTheme: mockToggleTheme,
    }));
    rerender(<ThemeToggle />);
    expect(toggle).toHaveClass('theme-toggle');
    expect(toggle).toHaveClass('dark');
  });
});

// // ProvConContainer Component Tests
// describe('ProvConContainer Component', () => {
//   const mockSnapshot = {
//     componentData: {
//       context: {
//         theme: { dark: true },
//         user: { id: 1, name: 'Test' },
//       },
//       hooksState: {
//         useState: [{ value: 'test' }],
//       },
//     },
//     children: [
//       {
//         name: 'ThemeProvider',
//         componentData: {
//           context: { theme: 'dark' },
//         },
//         children: [],
//       },
//     ],
//   };

//   test('renders empty state message when no providers/consumers found', () => {
//     render(<ProvConContainer currentSnapshot={{}} />);
//     expect(screen.getByText(/No providers or consumers found/)).toBeInTheDocument();
//   });

//   test('renders context data correctly', () => {
//     render(<ProvConContainer currentSnapshot={mockSnapshot} />);

//     // Use getAllByText to get all theme spans and verify at least one exists
//     const themeElements = screen.getAllByText((content, element) => {
//       return element?.tagName.toLowerCase() === 'span' && element?.textContent === 'theme:';
//     });
//     expect(themeElements.length).toBeGreaterThan(0);

//     // Do the same for user spans
//     const userElements = screen.getAllByText((content, element) => {
//       return element?.tagName.toLowerCase() === 'span' && element?.textContent === 'user:';
//     });
//     expect(userElements.length).toBeGreaterThan(0);
//   });

//   test('renders provider components correctly', () => {
//     render(<ProvConContainer currentSnapshot={mockSnapshot} />);

//     // Get all theme elements and use the first one to find its parent
//     const themeElements = screen.getAllByText((content, element) => {
//       return element?.tagName.toLowerCase() === 'span' && element?.textContent === 'theme:';
//     });
//     const parentElement = themeElements[0].closest('div');

//     expect(parentElement).toBeInTheDocument();
//   });

//   test('correctly parses stringified JSON values', () => {
//     const snapshotWithStringifiedJSON = {
//       componentData: {
//         context: {
//           data: JSON.stringify({ key: 'value' }),
//         },
//       },
//     };
//     render(<ProvConContainer currentSnapshot={snapshotWithStringifiedJSON} />);

//     // Look for the key-value pair in the rendered structure
//     expect(
//       screen.getByText((content, element) => {
//         return element?.tagName.toLowerCase() === 'span' && element?.textContent === 'key:';
//       }),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText((content, element) => {
//         return element?.tagName.toLowerCase() === 'span' && element?.textContent === '"value"';
//       }),
//     ).toBeInTheDocument();
//   });
// });

// // Clear Button Tests
// describe('Clear Button', () => {
//   // Create mock store
//   const mockStore = configureStore({
//     reducer: {
//       main: mainSlice.reducer,
//     },
//     preloadedState: {
//       main: {
//         port: null,
//         currentTab: 0,
//         currentTitle: 'No Target',
//         tabs: {
//           0: {
//             currLocation: {
//               index: 0,
//               stateSnapshot: {
//                 children: [],
//                 route: {
//                   url: '/test',
//                 },
//               },
//             },
//             hierarchy: {
//               index: 0,
//               stateSnapshot: {
//                 children: [],
//                 route: {
//                   url: '/test',
//                 },
//               },
//               children: [],
//             },
//             sliderIndex: 0,
//             viewIndex: 0,
//             snapshots: [],
//             playing: false,
//             intervalId: null,
//             mode: { paused: false },
//             status: {
//               reactDevToolsInstalled: true,
//               targetPageisaReactApp: true,
//             },
//           },
//         },
//         currentTabInApp: null,
//         connectionStatus: true,
//         connectRequested: true,
//       },
//     },
//   });

//   // @ts-ignore
//   const useDispatchMock = useDispatch as jest.Mock;
//   const dummyDispatch = jest.fn();

//   beforeEach(() => {
//     useDispatchMock.mockReturnValue(dummyDispatch);
//     dummyDispatch.mockClear();
//   });

//   test('renders clear button with correct text', () => {
//     render(
//       <Provider store={mockStore}>
//         <ActionContainer snapshots={[]} />
//       </Provider>,
//     );
//     expect(screen.getByText('Clear')).toBeInTheDocument();
//   });

//   test('dispatches both emptySnapshots and changeSlider actions when clicked', () => {
//     render(
//       <Provider store={mockStore}>
//         <ActionContainer snapshots={[]} />
//       </Provider>,
//     );
//     fireEvent.click(screen.getByText('Clear'));
//     expect(dummyDispatch).toHaveBeenCalledWith(emptySnapshots());
//     expect(dummyDispatch).toHaveBeenCalledWith(changeSlider(0));
//   });
// });
