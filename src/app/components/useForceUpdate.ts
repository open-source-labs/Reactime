import { useState } from 'react';

// This function will force a change in state and cause a re-render of the component.
// The state information is irrelevant but an update is needed to force a re-render
export default function useForceUpdate(): () => number {
  const [, setValue] = useState(0);
  return ():number => setValue((value:number): number => value + 1);
}
