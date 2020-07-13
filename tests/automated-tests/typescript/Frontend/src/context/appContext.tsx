import { createContext } from 'react';

interface ContextInterface {
  count: Number;
  setCount: Function;
}

const AppContext = createContext({} as ContextInterface);

export default AppContext;
