import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import user from '@testing-library/user-event'
import  '@testing-library/jest-dom/extend-expect' // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Action from '../components/Action'


// @ts-ignore
Action.cleanTime = jest.fn().mockReturnValue();

describe('unit testing for Action.tsx', () => {
  const props = {
    key: 'actions2',
    selected: true,
    last: false,
    index: 2,
    sliderIndex: 2,
    isCurrIndex: false,
    routePath:"",
    dispatch: jest.fn(),
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
    props.isCurrIndex = false
    props.componentData = {actualDuration: 3.5}
    props.dispatch.mockClear();
  });


  describe('When a component is shown on the page', () => {
    test("Action snapshot should be shown as Snapshot: 3.0", () => {
        render(<Action {...props} />);
        expect(screen.getByPlaceholderText('Snapshot: 3.0')).toBeInTheDocument()
    });

    test("two buttons time and Jump when at current snapshot", () => {
      render(<Action {...props} />);
      expect(screen.getAllByRole('button')).toHaveLength(2)
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('+00:03.50')
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('Jump')
    });

    test("two buttons with time and Current when not at current snapshot", () => {
      props.isCurrIndex = true
      render(<Action {...props} />);
      expect(screen.getAllByRole('button')).toHaveLength(2)
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('+00:03.50')
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('Current')
    });   

    test("when there's no have no duration data", () => {
        props.componentData = undefined
        render(<Action {...props} />);
        expect(screen.getAllByRole('button')[0]).toHaveTextContent('NO TIME')
    });

  });

});
