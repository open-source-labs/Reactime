import React from 'react';
import { changeView, changeSlider } from '../actions/actions.ts';

interface ActionProps {
  selected: boolean;
  last: boolean; 
  index: number;
  sliderIndex: number;
  dispatch: () => void;
  displayName: string;
  componentName: string;
  componentData: {actualDuration: number};
  state: object;
  viewIndex: number;
  handleOnkeyDown: (e: KeyboardEvent, i: number) => void;
}

/* // gabi and nate :: index and delta props were removed from Action.jsx  */
// viewIndex and handleonkeyDown added to props
const Action = (props: ActionProps) => {
  const {
    selected, last, index, sliderIndex, dispatch, displayName, componentName, componentData, state, viewIndex, handleOnkeyDown,
  } = props;

  // display render time for state change in seconds and miliseconds
  const cleanTime = () => {
    if (!componentData.actualDuration) {
      return 'NO TIME';
    }
    let seconds:any ;
    let miliseconds:any = componentData.actualDuration;
    if (Math.floor(componentData.actualDuration) > 60) {
      seconds = Math.floor(componentData.actualDuration / 60);
      seconds = JSON.stringify(seconds);
      if (seconds.length < 2) {
        seconds = '0'.concat(seconds);
      }
      miliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      seconds = '00';
    }
    miliseconds = Number.parseFloat(miliseconds).toFixed(2);
    const arrayMiliseconds = miliseconds.split('.');
    if (arrayMiliseconds[0].length < 2) {
      arrayMiliseconds[0] = '0'.concat(arrayMiliseconds[0]);
    }
    if (index == 0) {
      return `${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
    }
    return `+${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
  };
  const displayTime = cleanTime();

  return (
    <div
      // Edwin: invoking keyboard functionality; functionality is in ActionContainer;
      onKeyDown={(e: KeyboardEvent) => handleOnkeyDown(e, viewIndex)}
      className={selected || last ? 'action-component selected' : 'action-component'}
      onClick={(e: MouseEvent) => {
        dispatch(changeView(index));
      }}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
      tabIndex={index}
    >
      <div className="action-component-text">
        {`${displayName}:  ${componentName} `}
      </div>
      <button
        className="time-button"
        type="button"
      >
        {displayTime}
      </button>
      <button
        className="jump-button"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          dispatch(changeSlider(index));
          dispatch(changeView(index));
        }}
        tabIndex={index}
        type="button"
      >
        Jump
      </button>
    </div>
  );
};

export default Action;
