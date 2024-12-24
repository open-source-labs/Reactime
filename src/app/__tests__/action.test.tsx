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

import { ThemeProvider } from '../ThemeProvider';

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

// Helper function for redux wrapped renders
const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

// Action Component Tests
describe('Action Component', () => {
  // @ts-ignore
  const useDispatchMock = useDispatch as jest.Mock;
  const dummyDispatch = jest.fn();
  useDispatchMock.mockReturnValue(dummyDispatch);

  const props = {
    key: 'actions2',
    selected: true,
    last: false,
    index: 2,
    sliderIndex: 2,
    isCurrIndex: false,
    routePath: '',
    displayName: '3.0',
    componentName: 'App',
    logChangedState: jest.fn(),
    componentData: {
      actualDuration: 3.5,
    },
    state: { test: 'test' },
    viewIndex: 2,
    handleOnkeyDown: jest.fn(),
  };

  beforeEach(() => {
    props.isCurrIndex = false;
    props.componentData = { actualDuration: 3.5 };
  });

  test('Action snapshot should be shown as Snapshot: 3.0', () => {
    render(<Action {...props} />);
    expect(screen.getByPlaceholderText('Snapshot: 3.0')).toBeInTheDocument();
  });

  test('Two buttons with Time and Jump when not at current snapshot', () => {
    props.isCurrIndex = false;
    render(<Action {...props} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getAllByRole('button')[0]).toHaveTextContent('+00:03.50');
    expect(screen.getAllByRole('button')[1]).toHaveTextContent('Jump');
  });

  test('Two buttons with Time and Current when at current snapshot', () => {
    props.isCurrIndex = true;
    render(<Action {...props} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getAllByRole('button')[0]).toHaveTextContent('Current');
  });

  test('When there is no duration data', () => {
    // @ts-ignore
    props.componentData = undefined;
    render(<Action {...props} />);
    expect(screen.getAllByRole('button')[0]).toHaveTextContent('NO TIME');
  });

  test('When actualDuration exceeds 60, time should be formatted correctly', () => {
    props.componentData.actualDuration = 75;
    render(<Action {...props} />);
    expect(screen.getAllByRole('button')[0]).toHaveTextContent('+01:15.00');
  });

  test('Clicking the snapshot should trigger onClick', () => {
    render(<Action {...props} />);
    fireEvent.click(screen.getByRole('presentation'));
    expect(dummyDispatch).toHaveBeenCalledWith(changeView(props.index));
  });

  test('Clicking Jump button should trigger changeSlider and changeView', () => {
    render(<Action {...props} />);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(dummyDispatch).toHaveBeenCalledWith(changeSlider(props.index));
    expect(dummyDispatch).toHaveBeenCalledWith(changeView(props.index));
  });
});

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

// ThemeToggle Component Tests
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

  beforeAll(() => {
    // Mock window.matchMedia to control initial preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false, // Pretend system preference is 'light' by default
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('ThemeToggle switches between light and dark themes correctly', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByRole('button');

    // Initial state: 'isDark' is false, so no `dark` class on documentElement
    expect(document.documentElement).not.toHaveClass('dark');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Click to toggle to dark mode
    fireEvent.click(toggleButton);

    // Now 'isDark' is true, so `dark` class should be on documentElement
    expect(document.documentElement).toHaveClass('dark');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to light mode');

    // Click again to toggle back to light mode
    fireEvent.click(toggleButton);

    // Now 'isDark' is back to false
    expect(document.documentElement).not.toHaveClass('dark');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode');
  });
});
