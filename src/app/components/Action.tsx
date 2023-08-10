/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { changeView, changeSlider } from '../actions/actions';
import { ActionProps, OptionsCursorTrueWithMargin } from '../FrontendTypes';

/*
  This render's the individual snapshot components on the left side column
*/

/**
 * @function Action
 * @param selected : The selected action in the array of state changes
 * @param displayName : Label showing sequence number of state change, reflects changes in Chart.tsx
 * @param componentName : Displays the name of compenent's state being changed
 * @param last : The last index in the array
 * @param sliderIndex: Index of the slider in the array of state changes
 * (clicking the block changes the slider, related to MainSlider.tsx slider)
 * @param componentData: Displays react fiber data
 * @param viewIndex:  Index of the tab in the array when timejump is made
 * @method dispatch Executes actions that changes state in reactime
 * @method handleOnkeyDown Executes key commands
 *
 */

const Action = (props: ActionProps): JSX.Element => {
  // We destructure the 'props' that were passed into this component
  const {
    selected, // boolean on whether the current index is the same as the viewIndex in 'ActionContainer'
    last, // boolean on (whether the view index is less than 0) AND if (the index is the same as the last snapshot's index value in hierarchyArr) in 'ActionContainer'
    index, // from snapshot.index in "ActionContainer's" 'hierarchyArr'
    sliderIndex, // from tabs[currentTab] object in 'ActionContainer'
    dispatch,
    displayName, // from snapshot.displayName in "ActionContainer's" 'hierarchyArr'
    componentData, // from snapshot.componentData in "ActionContainer's" 'hierarchyArr'
    viewIndex, // from tabs[currentTab] object in 'ActionContainer'
    isCurrIndex,
    handleOnkeyDown, // function that allows arrows keys to jump between snapshots defined in 'ActionContainer.tsx'
  } = props;

  /**
   * @function cleanTime: Displays render times for state changes
   * @returns render display time in seconds in milliseconds
   */


  const cleanTime = (): string => {
    if (!componentData || !componentData.actualDuration) { // if there is no 'componentData' or 'componentData.actualDuration'
      return 'NO TIME';
    }

    let seconds: number | string; // seconds is undefined but can take a number or a string
    let milliseconds: any = componentData.actualDuration; // milliseconds is of any type and taken from the 'componentData.actualDuration'

    if (Math.floor(componentData.actualDuration) > 60) { // if the milliseconds is greater than 60
      seconds = Math.floor(componentData.actualDuration / 60); // we divide our milliseconds by 60 to determine our seconds
      seconds = JSON.stringify(seconds); // and we convert our seconds into a string
      
      if (seconds.length < 2) { // if the seconds string is only a single digit
        seconds = '0'.concat(seconds); // we can add a 0 in front of it so that if 'seconds = "1"' it will come out as 'seconds = "01"'
      }   
      milliseconds = Math.floor(componentData.actualDuration % 60); // Our true milliseconds then becomes the remainder of dividing our initial milliseconds by 60

    } else {
      seconds = '00'; // if we haven't even reached one second yet, our seconds are 00
    }

    milliseconds = Number.parseFloat(milliseconds as string).toFixed(2); // we convert our milliseconds string into a floating point number that has up to two decimal places.
    const arrayMilliseconds: string | number = milliseconds.split('.'); // we split our milliseconds using the decimal and come out with an array of two numbers

    
    if (arrayMilliseconds[0].length < 2) { // if our millisecond string only has one digit
      arrayMilliseconds[0] = '0'.concat(arrayMilliseconds[0]); // we add a 0 in front of it so that in the a sample number of '1' becomes '01'
    }
    
    if (index === 0) { // if this is the initial snapshot
      return `${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`; // we give it a timestamp
    }
    return `+${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`; // if these are succeeding snapshots, we add a '+' to the timestamp
  };

  const displayTime: string = cleanTime(); // we run cleanTime on the creation of this component so that we can get the timestamp


  // creates an options object that 'ReactHover' component will use to modify it's behaviour
  const optionsCursorTrueWithMargin: OptionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  return (
    <div className='individual-action'>
      <div
        onKeyDown={(e):void => handleOnkeyDown(e, viewIndex)}
        className={selected || last ? 'action-component selected' : 'action-component'}
        onClick={() => {
          dispatch(changeView(index));
        }}
        role='presentation'
        style={index > sliderIndex ? { color: '#5f6369' } : {}}
        tabIndex={index}
      >
        <ReactHover options={optionsCursorTrueWithMargin}>
          <Trigger type='trigger'>
            <div
              className='action-component-trigger'
              style={index > sliderIndex ? { color: '#5f6369' } : {}}
            >
              <div className='action-component-text'>
                <input
                  key={`ActionInput${displayName}`}
                  type='text'
                  className='actionname'
                  placeholder={`Snapshot: ${displayName}`}
                />
              </div>
              <button className='time-button' type='button'>
                {displayTime}
              </button>
              {isCurrIndex ? (
                <button className='current-location' type='button'>
                  Current
                </button>
              ) : (
                <button
                  className='jump-button'
                  onClick={(e): void => {
                    e.stopPropagation();
                    dispatch(changeSlider(index));
                    dispatch(changeView(index));
                  }}
                  tabIndex={index}
                  type='button'
                >
                  Jump
                </button>
              )}
            </div>
          </Trigger>
          <Hover type='hover' />
        </ReactHover>
      </div>
    </div>
  );
};

export default Action;
