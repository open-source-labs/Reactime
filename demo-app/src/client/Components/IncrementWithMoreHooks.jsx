import React, { useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback } from 'react';
import { userContext, tripContext } from './ButtonsWithMoreHooks';
import { useImmer } from 'use-immer';

/** 
 * This component as well as ButtonsWithMoreHooks were made to show where data for different 
 * hooks show up in the react fiber tree. There are duplicates of most hooks so you can see 
 * how the react fiber tree iterates over hook data.
*/

/** 
 * This file is a JSX file, not a TSX file, on purpose. The code won't be converted to common JS
 * before being bundled by webpack. There were some errors that weren't showing up for the other 
 * Increment.tsx file based on how webpack uglifies ES6 files. Maintaining this as a JSX file
 * will help check for these types of issues.
 */
 
/**
 * ES5 function definitions are intentionally used for most functions as ES6 function definitions were one
 * of the reasons Reactime 18 was breaking. Handleclick within the component definitions is ES6 to cover
 * this case, but having only 1 ES6 function definition in the file makes it easy to switch for testing 
 * purposes. Functional component definitions made with ES6
 */ 


//---------useReducer reducer and initialState functions------------------------------------------------------------------

function reducer1(state, action) {
  if (action.type === 'INCREMENT_UR1COUNT') {
    return {
      UR1Count: state.UR1Count + 1
    };
  }
  // This throws an error if you send a dispatch action to this reducer without having
  // the matching action.type string, rather than returning the initial state. This'll
  // help display unexpected activity.
  throw Error('Unknown action 1.');
}

function reducer2(state, action) {
  if (action.type === 'ADD_TO_ARRAY') {
    return {
      UR2Array: state.UR2Array.concat(action.payload)
    };
  }
  // This throws an error if you send a dispatch action to this reducer without having
  // the matching action.type string, rather than returning the initial state. This'll
  // help display unexpected activity.
  throw Error('Unknown action 2.');
}

function createInitialState(num) {
  return { UR1Count: num }
}


//---------Custom Hook Definition-----------------------------------------------------------------------------------------

function useCustomHook() {
  const [customCount, setCustomCount] = useState(0);

  useEffect(() => {
    setCustomCount((customCount) => customCount + 1);
  },[])

  return {customCount}
}


//-------IncrementWithMoreHooks Component Definition--------------------------------------------------------------------------

const IncrementWithMoreHooks = () => {


  //--------useState Invocations----------------------------------------------------------------------------------------------
  
  // useState stores stateful data in the component it's defined in
  const [count, setCount] = useState(0);
  const [buttonState, setButtonState] = useState(false)


  //--------useContext Invocations--------------------------------------------------------------------------------------------

  // useContext accesses stateful data defined in a 'super-parent' (grandparent, great-grandparent, etc.) component
  //  that the current component is nested in, regardless of how many component parents are between the
  //  current component and that 'super' parent component, allowing the user to avoid prop drilling through
  //  multiple parent-child component relationships.
  const { user, setUser } = useContext(userContext);
  const { trip } = useContext(tripContext);


  //--------useReduce Invocations----------------------------------------------------------------------------------------------

  // useReducer stores stateful data in the component it's defined in. 
  //  It also takes custom 'reducer' functions which dictate how the stateful
  //  data is updated when particular arguments are provided to invoked 'dispatch' functions
  const [UR1State, dispatch1] = useReducer(reducer1, 0, createInitialState);
  const [UR2State, dispatch2] = useReducer(reducer2, { UR2Array: [] });


  //--------useRef Invocations-------------------------------------------------------------------------------------------------

  // useRef stores stateful data that’s not needed for rendering.
  // This is generally used to hold DOM elements that the user wants to manipulate.
  const ref1 = useRef(null);
  const ref2 = useRef(1);


  //--------useMemo Invocations------------------------------------------------------------------------------------------------

  // useMemo takes a callback and dependency arrays holding values used in the callback.
  //  It'll cache results of calling the callback for different values of the dependency and
  //  if it sees the same value again it'll grab the result from the cache rather than calling
  //  the callback again. This'll save resources if calling the callback is expensive.
  const memoValue1 = useMemo(() => count * ref2.current * 2, [count, ref2.current]);
  const memoValue2 = useMemo(() => count * 2, [count]);
  

  //--------useCallback Invocations-------------------------------------------------------------------------------------------

  // useCallback is similar to useMemo, however it caches a function definition that changes
  //  based on the dependencies. This'll save resources when defining said function is expensive. 
  const callback1 = useCallback(() => {
    return count * memoValue1;
  }, [count, memoValue1]);
  const callback2 = useCallback(() => {
    return count * memoValue2;
  }, [count, memoValue2]);


  //--------useEffect Invocations---------------------------------------------------------------------------------------------

  // useEffect is a lifecycle hook that invokes its first argument 'setup' callback based on whether or not
  //  the contents of the second argument's 'dependencies' array have changed from the previous render.
  //
  //  Not including a second argument will invoke 'setup' every time the component renders.
  //  An empty dependency array will invoke 'setup' only for the first component render.
  //  Providing variables to the dependency array will invoke 'setup' on the first component
  //   and every subsequent render where the variable has changed.
  //  Returning a callback will execute the callback when the current component unmounts
  useEffect(() => {
    setUser('Mark');
    return () => {
      console.log('I get executed when IncrementWithMoreHooks unmounts')
    }
  }, []);


  useEffect(() => {
    setCount((count) => count + 1);
  }, [buttonState]);


  //--------useImmer Invocation------------------------------------------------------------------------------------------------
  
  // use-immer is an npm library used for writing simple immutable changes with mutable syntax
  const [person, updatePerson] = useImmer({
    name: 'Jeff',
    age: 34
  });

  // function to increment useImmer age value
  function incrementPersonAge() {
    updatePerson(draft => {
      draft.age++;
    });
  }


  //--------Custom Hook Invocation---------------------------------------------------------------------------------------------

  // Custom hook implementation
  const { customCount } = useCustomHook();
  
  
  //--------Other function definitions---------------------------------------------------------------------------------------------

  //Click function to alter state of buttonState
  const handleClick = () => {
    if (buttonState) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }
  }


  // Converts values like functions, objects, and 'false 'booleans that wouldn't otherwise print in a JSX element to strings if possible
  function printString(val) {
    let result;

    if (typeof val === 'function') {
      return val.toString();
    }

    try {
      result = JSON.stringify(val);
    } catch {
      result = 'Failed to convert into JSON string'
    }
    return result;
  }


  //--------Return Statement------------------------------------------------------------------------------------------------------

  return (
    <div className='increment-div' key='One-child-node-beyond-IncrementWithMoreHooks'>
      
      <h2 id='Heading for increment with more hooks' key='data displayer'>
        Increment With More Hooks
      </h2>

      
      <section id='useState-data' className='hook-data-section'>
        <h4> useState data: </h4>
        <p>count: {printString(count)}
          <br />
          count will increment via useEffect on buttonState state change
        </p>
        <p>buttonState: {printString(buttonState)}</p>
        <button
          key='button for handleClick'
          onClick={handleClick}>
          Click to change state of buttonState
        </button>
      </section>

      
      <section id='useContext-data' className='hook-data-section'>
        <h4> useContext data: </h4>
        <p>user: {printString(user)}</p>
        <p>trip: {printString(trip)}</p>
      </section>

      
      <section id='useReducer-data' className='hook-data-section'>
        <h4> useReducer data: </h4>
        <p>UR1State: {printString(UR1State)}</p>
        <button
          onClick={() => {
            dispatch1({ type: 'INCREMENT_UR1COUNT' })
          }}>
        Click to increment UR1Count
      </button>
        <p>UR2State: {printString(UR2State)}</p>
        <button
          onClick={() => {
            dispatch2({ type: 'ADD_TO_ARRAY', payload: [UR1State.UR1Count] })
          }}>
        Click to push UR1Count count to UR2Array
      </button>
      </section>

      
      <section ref={ref1} id='useRef-data' className='hook-data-section'>
        <h4> useRef data: </h4>
        <p>
          ref1: {ref1.current
            ? 'holds ref to element with id \'useRef-data\''
            : 'null'}
        </p>
        <p>
          ref2: {printString(ref2)}
          <br />
          Notice that this change doesn't cause the page to re-render
        </p>
        <button
          onClick={() => (ref2.current = ref2.current + 1)}>
          Click to increment ref2.current
        </button>
      </section>

      
      <section id='useMemo-data' className='hook-data-section'>
        <h4> useMemo data: </h4>
        <p>
          memoValue1: {printString(memoValue1)}
          <br />
          memoValue1 depends on useState "count" and useRef "ref2"
        </p>
        <p>
          memoValue2: {printString(memoValue2)}
          <br />
          memoValue2 depends on useState "count"
        </p>
      </section>

      
      <section id='useCallback-data' className='hook-data-section'>
        <h4> useCallback data: </h4>
        <p> callback1: {printString(callback1)} </p>
        <p> callback2: {printString(callback2)} </p>
      </section>

      
      <section id='useEffect-data' className='hook-data-section'>
        <h4>useEffect data:</h4>
        <p>One useEffect sets useContext's user to {printString(user)} after the component's first render</p>
        <p>One useEffect increments useState's count every time buttonState's state changes</p>
        <p>
          count: {printString(count)}
          <br />
          buttonState: {printString(buttonState)}
        </p>
        <button
          key='button for handleClick'
          onClick={handleClick}>
          Click to change state of buttonState
        </button>
      </section>


      <section id='useImmer-data' className='hook-data-section'>
        <h4>useImmer data:</h4>
        <p>person: {printString(person)}</p>
        <button
          onClick={incrementPersonAge}>
          Click to increment person's age
        </button>
      </section>

      
      <section id='useCustomHook-data' className='hook-data-section'>
        <h4>useCustomHook data:</h4>
        <p> customCount: {printString(customCount)} </p>
        <p>
          The custom hook utilizes useEffect to increments a useState
          var customCount only on the first render. Remove the empty
          dependency array from the second parameter of the useEffect
          call to see a show!
        </p>
      </section>
    </div>
  );
}

export default IncrementWithMoreHooks; 