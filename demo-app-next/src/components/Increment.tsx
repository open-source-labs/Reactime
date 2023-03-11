import React, { useState } from "react";

export default function Increment() {
  const [count, setCount] = useState(0);

  return (
    <button className="increment" onClick={() => setCount(count + 1)}>
      You clicked me {count} times.
    </button>
  );
}
