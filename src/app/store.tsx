import React, { useContext } from 'react';

export const StoreContext = React.createContext();

export const useStoreContext:any = () => useContext(StoreContext);