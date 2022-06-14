import React, { useState } from 'react';

function Increment() {
  const [count, setCount] = useState(0);

  return (
    <button className="increment" onClick={() => setCount(count + 1)}>
      You clicked me {count} times.
    </button>
  );
}

export default Increment;
