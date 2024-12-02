import React, { useReducer } from 'react';

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

const initialState: CounterState = {
  count: 0,
  history: [],
  lastAction: 'none',
};

function counterReducer(state: CounterState, action: CounterAction): CounterState {
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
        ...initialState,
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

function FunctionalReducerCounter(): JSX.Element {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div className='reducer-counter'>
      <h2>Function-based Reducer Counter</h2>
      <div className='counter-value'>
        <h3>Current Count: {state.count}</h3>
      </div>

      <div className='counter-buttons'>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment (+1)</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement (-1)</button>
        <button onClick={() => dispatch({ type: 'DOUBLE' })}>Double Value</button>
        <button onClick={() => dispatch({ type: 'ADD', payload: 5 })}>Add 5</button>
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>

      <div className='counter-info'>
        <h4>Last Action: {state.lastAction}</h4>
        <h4>History:</h4>
        <div className='history-list'>
          {state.history.map((value, index) => (
            <span key={index}>
              {value}
              {index < state.history.length - 1 ? ' → ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FunctionalReducerCounter;
