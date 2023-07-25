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
    selected,
    last,
    index,
    sliderIndex,
    dispatch,
    displayName,
    componentData,
    viewIndex,
    isCurrIndex,
    handleOnkeyDown,
  } = props;

  /**
   * @function cleanTime: Displays render times for state changes
   * @returns render display time in seconds in milliseconds
   */


  const cleanTime = (): string => {
    // if there is no 'componentData' or 'componentData.actualDuration' return "NO TIME"
    if (!componentData || !componentData.actualDuration) {
      return 'NO TIME';
    }

    // seconds is undefined but can take a number or a string
    let seconds: number | string;
    // milliseconds is of any type and taken from the 'componentData.actualDuration'
    let milliseconds: any = componentData.actualDuration;

    // if the milliseconds is greater than 60
    if (Math.floor(componentData.actualDuration) > 60) {
      // we divide our milliseconds by 60 to determine our seconds
      seconds = Math.floor(componentData.actualDuration / 60);
      // and we convert our seconds into a string
      seconds = JSON.stringify(seconds);
      // if the seconds string is only a single digit
      if (seconds.length < 2) {
        // we can add a 0 in front of it so that if 'seconds = "1"' it will come out as 'seconds = "01"'
        seconds = '0'.concat(seconds);
      }
      // Our true milliseconds then becomes the remainder of dividing our initial milliseconds by 60
      milliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      // if we haven't even reached one second yet, our seconds are 00
      seconds = '00';
    }

    // we convert our milliseconds string into a floating point number that has up to two decimal places.
    milliseconds = Number.parseFloat(milliseconds as string).toFixed(2);

    // we split our milliseconds using the decimal and come out with an array of two numbers
    const arrayMilliseconds: string | number = milliseconds.split('.');

    // if our millisecond string only has one digit
    if (arrayMilliseconds[0].length < 2) {
      // we add a 0 in front of it so that in the a sample number of '1' becomes '01'
      arrayMilliseconds[0] = '0'.concat(arrayMilliseconds[0]);
    }
    // if this is the initial snapshot
    if (index === 0) {
      // we give it a timestamp
      return `${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
    }
    // if these are succeeding snapshots, we add a '+' to the timestamp
    return `+${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
  };

  // we run cleanTime on the creation of this component so that we can get the timestamp
  const displayTime: string = cleanTime();

  // creates an options object that 'ReactHover' component will use to modify it's behaviour
  const optionsCursorTrueWithMargin: OptionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  return (
    <div className='individual-action'>
      <div
        // Invoking keyboard functionality; functionality is in ActionContainer;
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
