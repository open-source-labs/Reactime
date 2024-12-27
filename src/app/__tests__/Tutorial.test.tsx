import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as React from 'react';

import Tutorial from '../components/Buttons/Tutorial';
import { setCurrentTabInApp, tutorialSaveSeriesToggle } from '../slices/mainSlice';

// Create a mock for updateStepElement
const mockUpdateStepElement = jest.fn();

// Keep track of the latest Steps instance
let currentStepsInstance: any = null;

// Mock the intro.js-react package
jest.mock('intro.js-react', () => {
  return {
    Steps: class MockSteps extends React.Component<any> {
      constructor(props: any) {
        super(props);
        // @ts-ignore
        this.updateStepElement = mockUpdateStepElement;
        // Store the instance so we can access it in tests
        currentStepsInstance = this;
        // Call the ref with this instance if provided
        if (props.ref) {
          props.ref(this);
        }
      }

      render() {
        const { enabled, steps, onExit, onBeforeChange } = this.props;
        return enabled ? (
          <div data-testid='mock-steps'>
            {steps.map((step: any, index: number) => (
              <div key={index} data-testid={`step-${index}`}>
                <h3>{step.title}</h3>
                <div>{step.intro}</div>
              </div>
            ))}
            <button onClick={() => onExit()}>Exit</button>
            <button onClick={() => onBeforeChange && onBeforeChange(1)}>Next</button>
          </div>
        ) : null;
      }
    },
  };
});

// Mock the dispatch function
const mockDispatch = jest.fn();

describe('Tutorial Component', () => {
  const defaultProps = {
    currentTabInApp: 'map',
    dispatch: mockDispatch,
  };

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
    currentStepsInstance = null;
  });

  it('renders without crashing', () => {
    render(<Tutorial {...defaultProps} />);
    expect(screen.getByRole('button', { name: /tutorial/i })).toBeInTheDocument();
  });

  it('starts tutorial when Tutorial button is clicked', () => {
    render(<Tutorial {...defaultProps} />);
    const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

    fireEvent.click(tutorialButton);

    expect(screen.getByTestId('mock-steps')).toBeInTheDocument();
  });

  it('navigates to performance tab before starting tutorial when in performance views', () => {
    const performanceProps = {
      ...defaultProps,
      currentTabInApp: 'performance-comparison',
    };

    render(<Tutorial {...performanceProps} />);
    const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

    fireEvent.click(tutorialButton);

    expect(mockDispatch).toHaveBeenCalledWith(setCurrentTabInApp('performance'));
  });

  describe('Step Navigation', () => {
    it('handles performance tab tutorial steps correctly', () => {
      const performanceProps = {
        ...defaultProps,
        currentTabInApp: 'performance',
      };

      render(<Tutorial {...performanceProps} />);
      const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

      // Start the tutorial
      fireEvent.click(tutorialButton);

      // Simulate step change by clicking the Next button
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Verify the dispatch was called
      expect(mockDispatch).toHaveBeenCalledWith(tutorialSaveSeriesToggle('inputBoxOpen'));

      // Verify updateStepElement was called
      expect(mockUpdateStepElement).toHaveBeenCalledWith(1);
    });
  });

  describe('Tutorial Steps Content', () => {
    it('loads correct steps for map tab', () => {
      render(<Tutorial {...defaultProps} />);
      const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

      fireEvent.click(tutorialButton);

      const firstStep = screen.getByTestId('step-0');
      expect(firstStep).toHaveTextContent('Reactime Tutorial');
    });

    it('loads correct steps for performance tab', () => {
      const performanceProps = {
        ...defaultProps,
        currentTabInApp: 'performance',
      };

      render(<Tutorial {...performanceProps} />);
      const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

      fireEvent.click(tutorialButton);

      const firstStep = screen.getByTestId('step-0');
      expect(firstStep).toHaveTextContent('Performance Tab');
    });

    it('shows default message for undefined tabs', () => {
      const undefinedTabProps = {
        ...defaultProps,
        currentTabInApp: 'undefined-tab',
      };

      render(<Tutorial {...undefinedTabProps} />);
      const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

      fireEvent.click(tutorialButton);

      const firstStep = screen.getByTestId('step-0');
      expect(firstStep).toHaveTextContent('No Tutorial For This Tab');
    });
  });

  describe('Tutorial Exit', () => {
    it('handles tutorial exit correctly', () => {
      render(<Tutorial {...defaultProps} />);
      const tutorialButton = screen.getByRole('button', { name: /tutorial/i });

      // Start tutorial
      fireEvent.click(tutorialButton);

      // Find and click the exit button
      const exitButton = screen.getByText('Exit');
      fireEvent.click(exitButton);

      // Check that the steps are no longer visible
      expect(screen.queryByTestId('mock-steps')).not.toBeInTheDocument();
    });
  });
});
