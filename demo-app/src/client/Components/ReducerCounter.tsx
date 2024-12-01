import React, { Component } from 'react';

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

// Static reducer function to handle state updates
class ReducerCounter extends Component<{}, CounterState> {
  // Initial state definition
  static initialState: CounterState = {
    count: 0,
    history: [],
    lastAction: 'none',
  };

  // Static reducer method to handle state updates
  static reducer(state: CounterState, action: CounterAction): CounterState {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          count: state.count + 1,
          history: [...state.history, state.count + 1],
          lastAction: 'INCREMENT',
        };
      case 'DECREMENT':
        return {
          ...state,
          count: state.count - 1,
          history: [...state.history, state.count - 1],
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
          ...ReducerCounter.initialState,
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

  constructor(props: {}) {
    super(props);
    this.state = ReducerCounter.initialState;

    // Bind dispatch method
    this.dispatch = this.dispatch.bind(this);
  }

  // Method to handle state updates using the reducer
  dispatch(action: CounterAction): void {
    this.setState((currentState) => ReducerCounter.reducer(currentState, action));
  }

  render(): JSX.Element {
    return (
      <div className='reducer-counter'>
        <h2>Class-based Reducer Counter</h2>
        <div className='counter-value'>
          <h3>Current Count: {this.state.count}</h3>
        </div>

        <div className='counter-buttons'>
          <button onClick={() => this.dispatch({ type: 'INCREMENT' })}>Increment (+1)</button>
          <button onClick={() => this.dispatch({ type: 'DECREMENT' })}>Decrement (-1)</button>
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
