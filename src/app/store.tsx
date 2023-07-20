/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';

// we create a context object and assign it to StoreContext
export const StoreContext = React.createContext();

// the useStoreContext function allows us to use use the above declared StoreContext.
export const useStoreContext = () => useContext(StoreContext);