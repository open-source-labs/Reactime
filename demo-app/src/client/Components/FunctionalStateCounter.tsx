import React, { useState } from 'react';

type CounterProps = {
  initialCount?: number;
  step?: number;
  title?: string;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
};

function FunctionalStateCounter({
  initialCount = 0,
  step = 1,
  title = 'Function-based State Counter',
  theme = {
    backgroundColor: '#ffffff',
    textColor: '#330002',
  },
}: CounterProps): JSX.Element {
  const [count, setCount] = useState(initialCount);
  const [history, setHistory] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState('none');

  const handleAction = (type: string, payload?: number) => {
    let newCount = count;
    switch (type) {
      case 'INCREMENT':
        newCount = count + step;
        setCount(newCount);
        setHistory([...history, newCount]);
        setLastAction('INCREMENT');
        break;
      case 'DECREMENT':
        newCount = count - step;
        setCount(newCount);
        setHistory([...history, newCount]);
        setLastAction('DECREMENT');
        break;
      case 'DOUBLE':
        newCount = count * 2;
        setCount(newCount);
        setHistory([...history, newCount]);
        setLastAction('DOUBLE');
        break;
      case 'ADD':
        newCount = count + (payload || 0);
        setCount(newCount);
        setHistory([...history, newCount]);
        setLastAction(`ADD ${payload}`);
        break;
      case 'RESET':
        setCount(0);
        setHistory([]);
        setLastAction('RESET');
        break;
    }
  };

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
        <h3>Current Count: {count}</h3>
      </div>

      <div className='counter-buttons'>
        <button onClick={() => handleAction('INCREMENT')}>Increment (+{step})</button>
        <button onClick={() => handleAction('DECREMENT')}>Decrement (-{step})</button>
        <button onClick={() => handleAction('DOUBLE')}>Double Value</button>
        <button onClick={() => handleAction('ADD', 5)}>Add 5</button>
        <button onClick={() => handleAction('RESET')}>Reset</button>
      </div>

      <div className='counter-info'>
        <h4>Last Action: {lastAction}</h4>
        <h4>History:</h4>
        <div className='history-list'>
          {history.map((value, index) => (
            <span key={index}>
              {value}
              {index < history.length - 1 ? ' → ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FunctionalStateCounter;
