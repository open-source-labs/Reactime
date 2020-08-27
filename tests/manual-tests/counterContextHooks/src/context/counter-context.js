import React, { useState, createContext } from "react";

// Create Context Object
export const CounterContext = createContext();


// Create a provider for components to consume and subscribe to changes
export const CounterContextProvider = (props) => {
  const [count, setCount] = useState(0);

  return (
    <CounterContext.Provider value={[count, setCount]}>
      {props.children}
    </CounterContext.Provider>
  )
}
