import React, { useState } from 'react';
import Box from './Box';
import { BoardText } from '../../types';
import { Function } from 'lodash';
function Increment() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button className='increment' onClick={() => setCount(count + 1)}>
        You clicked me {count} times.
      </button>
    </div>
  );
}

export default Increment;
