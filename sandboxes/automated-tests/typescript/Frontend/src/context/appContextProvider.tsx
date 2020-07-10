/* eslint-disable import/named */
import React, { useState } from 'react';
import AppContext from './appContext';

interface ContextProps {
  children: any;
}

function AppContextProvider(props: ContextProps) {
  const { children } = props;
  const [count, setCount] = useState(0);

  return (
    <AppContext.Provider
      value={{
        count,
        setCount() {
          setCount(lastValue => lastValue + 1);
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
