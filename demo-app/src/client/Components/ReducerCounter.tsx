import React, { Component } from 'react';

type CounterProps = {
  initialCount?: number;
  step?: number;
  title?: string;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
};

type CounterState = {
  count: number;
  history: number[];
  lastAction: string;
};

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'DOUBLE' }
  | { type: 'RESET' }
  | { type: 'ADD'; payload: number };

class ReducerCounter extends Component<CounterProps, CounterState> {
  static defaultProps = {
    initialCount: 0,
    step: 1,
    title: 'Class-based Reducer Counter',
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#330002',
    },
  };

  static initialState(initialCount: number): CounterState {
    return {
      count: initialCount,
      history: [],
      lastAction: 'none',
    };
  }

  static reducer(state: CounterState, action: CounterAction, step: number): CounterState {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          count: state.count + step,
          history: [...state.history, state.count + step],
          lastAction: 'INCREMENT',
        };
      case 'DECREMENT':
        return {
          ...state,
          count: state.count - step,
          history: [...state.history, state.count - step],
          lastAction: 'DECREMENT',
        };
      case 'DOUBLE':
        return {
          ...state,
          count: state.count * 2,
          history: [...state.history, state.count * 2],
          lastAction: 'DOUBLE',
        };
      case 'RESET':
        return {
          ...ReducerCounter.initialState(0),
          lastAction: 'RESET',
        };
      case 'ADD':
        return {
          ...state,
          count: state.count + action.payload,
          history: [...state.history, state.count + action.payload],
          lastAction: `ADD ${action.payload}`,
        };
      default:
        return state;
    }
  }

  constructor(props: CounterProps) {
    super(props);
    this.state = ReducerCounter.initialState(props.initialCount || 0);
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(action: CounterAction): void {
    this.setState((currentState) =>
      ReducerCounter.reducer(currentState, action, this.props.step || 1),
    );
  }

  render(): JSX.Element {
    const { title, theme } = this.props;

    return (
      <div
        className='reducer-counter'
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.textColor,
        }}
      >
        <h2>{title}</h2>
        <div className='counter-value'>
          <h3>Current Count: {this.state.count}</h3>
        </div>

        <div className='counter-buttons'>
          <button onClick={() => this.dispatch({ type: 'INCREMENT' })}>
            Increment (+{this.props.step})
          </button>
          <button onClick={() => this.dispatch({ type: 'DECREMENT' })}>
            Decrement (-{this.props.step})
          </button>
          <button onClick={() => this.dispatch({ type: 'DOUBLE' })}>Double Value</button>
          <button onClick={() => this.dispatch({ type: 'ADD', payload: 5 })}>Add 5</button>
          <button onClick={() => this.dispatch({ type: 'RESET' })}>Reset</button>
        </div>

        <div className='counter-info'>
          <h4>Last Action: {this.state.lastAction}</h4>
          <h4>History:</h4>
          <div className='history-list'>
            {this.state.history.map((value, index) => (
              <span key={index}>
                {value}
                {index < this.state.history.length - 1 ? ' → ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ReducerCounter;
