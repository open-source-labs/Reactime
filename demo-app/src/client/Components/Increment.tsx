import React, { useState } from 'react';
function Increment(): JSX.Element {
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
