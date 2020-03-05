/* eslint-disable import/named */
import React, { useState } from 'react';
import AppContext from './appContext';

function AppContextProvider(props) {
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
