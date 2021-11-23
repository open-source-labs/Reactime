/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';

export const StoreContext = React.createContext();

export const useStoreContext:any = () => useContext(StoreContext);