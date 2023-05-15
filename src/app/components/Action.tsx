/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { changeView, changeSlider } from '../actions/actions';
import { ActionProps, OptionsCursorTrueWithMargin } from '../components/FrontendTypes';

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
// index and delta props were removed from Action.jsx  */
// viewIndex and handleonkeyDown added to props
const Action = (props: ActionProps): JSX.Element => {
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
    if (!componentData || !componentData.actualDuration) {
      return 'NO TIME';
    }
    let seconds: number | string;
    let milliseconds: any = componentData.actualDuration;
    if (Math.floor(componentData.actualDuration) > 60) {
      seconds = Math.floor(componentData.actualDuration / 60);
      seconds = JSON.stringify(seconds);
      if (seconds.length < 2) {
        seconds = '0'.concat(seconds);
      }
      milliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      seconds = '00';
    }
    milliseconds = Number.parseFloat(milliseconds as string).toFixed(2);
    const arrayMilliseconds: string | number = milliseconds.split('.');
    if (arrayMilliseconds[0].length < 2) {
      arrayMilliseconds[0] = '0'.concat(arrayMilliseconds[0]);
    }
    if (index === 0) {
      return `${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
    }
    return `+${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
  };
  const displayTime: string = cleanTime();

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
