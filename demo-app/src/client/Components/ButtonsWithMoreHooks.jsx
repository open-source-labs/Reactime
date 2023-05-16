import React, {useState, createContext} from 'react';
import IncrementWithMoreHooks from './IncrementWithMoreHooks';

/**
 * This component as well as IncrementWithMoreHooks were made to show where data for different 
 * hooks show up in the react fiber tree.
 */

/** 
 * This file is a JSX file, not a TSX file, on purpose. The code won't be converted to common JS
 * before being bundled by webpack. There were some errors that weren't showing up for the other 
 * Increment.tsx file based on how webpack uglifies ES6 files. Maintaining this as a JSX file
 * will help check for these types of issues.
 */

/**
 * How Reactime extracts useState data and what would have to be done 
 * to extract useContext and useReducer data:
 * 
 * When extracting a functional component's useState data from the fiber tree in the backend of 
 * Reactime, said data is stored on said component's fiber tree node at its memoizedState property, 
 * which is a linked list with each node holding data for each useState invocation (some but 
 * not all other hooks also store nodes with data here). Each useState memoizedState node includes
 * the variable (e.g. user) and its corresponding dispatch function (e.g. setUser). This dispatch
 * function is required to use Reactime's timeJump feature.
 * 
 * useContext data is stored on the property "dependencies", and only the data passed into the
 * value attritibute of the 'context'.Provider element will be there. For tripContext.Provider,
 * we pass down "trip" without "setTrip", so we won't have access to the 'trip' dispatch function 
 * in the "IncrementWithMoreHooks" component, meaning Reactime's timeJump won't work without 
 * finding the 'trip' dispatch function by coming into this component where useState was invoked and
 * storing it in the appropriate place. This is easy enough for useState variables, but useContext 
 * is commonly used with useReducer which is an entirely different beast. 
 * 
 * I advise solving the puzzle of making useReducer work with the timeJump functionality before 
 * integrating other hooks. Look at time jumping in the Redux dev tools chrome extension for 
 * inspiration, because you essentially need to recreate that within Reactime. 
 */

// userInCreateContext is different from 'user' to see where this variable name showed up in the AST
export const userContext = createContext({ userInCreateContext: 'null', setUser: undefined });
export const tripContext = createContext({ trip: 'null', setTrip: undefined });

const ButtonsWithMoreHooks = () => {
  const [user, setUser] = useState('null');
  const userValue = { user, setUser };
  const [trip, setTrip ] = useState('Hawaii');
  const tripValue = { trip };

  return (
    <div className='buttons' key='increment container'>
      <userContext.Provider value={userValue} key="userContext Provider">
        <tripContext.Provider value={tripValue} key="tripContext Provider">
          <IncrementWithMoreHooks key={'IncrementWithMoreHooks'} />
        </tripContext.Provider>
      </userContext.Provider>
    </div>
  );
}

export default ButtonsWithMoreHooks;
