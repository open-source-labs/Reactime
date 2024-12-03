import React, { useState, useReducer } from 'react';

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

function counterReducer(state: CounterState, action: CounterAction, step: number): CounterState {
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
        count: 0,
        history: [],
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

function FunctionalReducerCounter({
  initialCount = 0,
  step = 1,
  title = 'Function-based Reducer Counter',
  theme = {
    backgroundColor: '#ffffff',
    textColor: '#330002',
  },
}: CounterProps): JSX.Element {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<Date | null>(null);
  const [averageTimeBetweenClicks, setAverageTimeBetweenClicks] = useState<number>(0);
  const [state, dispatch] = useReducer(
    (state: CounterState, action: CounterAction) => counterReducer(state, action, step),
    {
      count: initialCount,
      history: [],
      lastAction: 'none',
    },
  );

  return (
    <div
      className='reducer-counter'
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <h2>{title}</h2>
      <div className='counter-value'>
        <h3>Current Count: {state.count}</h3>
      </div>

      <div className='counter-buttons'>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment (+{step})</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement (-{step})</button>
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
