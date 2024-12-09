import React from 'react';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { changeView, changeSlider } from '../../slices/mainSlice';
import { ActionProps, OptionsCursorTrueWithMargin } from '../../FrontendTypes';
import { useDispatch } from 'react-redux';

const Action = (props: ActionProps): JSX.Element => {
  const dispatch = useDispatch();

  const {
    selected,
    last,
    index,
    sliderIndex,
    displayName,
    componentData,
    viewIndex,
    isCurrIndex,
    handleOnkeyDown,
  } = props;

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
    const arrayMilliseconds: [string, number] = milliseconds.split('.');

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
        // @ts-ignore
        onKeyDown={(e): void => handleOnkeyDown(e, viewIndex)}
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
                  className='actionname'
                  key={`ActionInput${displayName}`}
                  type='text'
                  placeholder={`Snapshot: ${displayName}`}
                />
              </div>
              {isCurrIndex ? (
                <button className='time-button' type='button'>
                  Current
                </button>
              ) : (
                <button className='time-button' type='button'>
                  {displayTime}
                </button>
              )}
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
