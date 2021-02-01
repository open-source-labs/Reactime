// @ts-nocheck
import React from 'react';
import Action from '../components/Action';
import SwitchAppDropdown from '../components/SwitchApp';
import { emptySnapshots, changeView, changeSlider } from '../actions/actions';
import { useStoreContext } from '../store';
import { useEffect } from 'react';

const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  if (slider) {
    slider.setAttribute('style', 'left: 0');
  }
};

function ActionContainer(props) {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];
  const { toggleActionContainer, actionView, setActionView } = props;
  let actionsArr = [];
  const hierarchyArr: any[] = [];

  // function to traverse state from hiararchy and also getting information on display name and component name
  const displayArray = (obj: {
    stateSnapshot: { children: any[] };
    name: number;
    branch: number;
    index: number;
    children?: [];
  }) => {
    if (
      obj.stateSnapshot.children.length > 0 &&
      obj.stateSnapshot.children[0] &&
      obj.stateSnapshot.children[0].state &&
      obj.stateSnapshot.children[0].name
    ) {
      const newObj: Record<string, unknown> = {
        index: obj.index,
        displayName: `${obj.name}.${obj.branch}`,
        state: obj.stateSnapshot.children[0].state,
        componentName: obj.stateSnapshot.children[0].name,
        componentData:
          JSON.stringify(obj.stateSnapshot.children[0].componentData) === '{}'
            ? ''
            : obj.stateSnapshot.children[0].componentData,
      };
      hierarchyArr.push(newObj);
    }
    if (obj.children) {
      obj.children.forEach((element) => {
        displayArray(element);
      });
    }
  };
  // the hierarchy gets set on the first click in the page
  // when page in refreshed we may not have a hierarchy so we need to check if hierarchy was initialized
  // if true involk displayArray to display the hierarchy
  if (hierarchy) displayArray(hierarchy);

  // handles keyboard presses, function passes an event and index of each action-component
  function handleOnKeyDown(e: KeyboardEvent, i: number) {
    let currIndex = i;
    // up array key pressed
    if (e.keyCode === 38) {
      currIndex -= 1;
      if (currIndex < 0) return;
      dispatch(changeView(currIndex));
    }
    // down arrow key pressed
    else if (e.keyCode === 40) {
      currIndex += 1;
      if (currIndex > hierarchyArr.length - 1) return;
      dispatch(changeView(currIndex));
    }
    // enter key pressed
    else if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault(); // needed or will trigger onClick right after
      dispatch(changeSlider(currIndex));
    }
  }

  actionsArr = hierarchyArr.map(
    (
      snapshot: {
        state?: Record<string, unknown>;
        key: string;
        displayName: string;
        componentName: string;
        componentData: { actualDuration: number } | undefined;
      },
      index
    ) => {
      const selected = index === viewIndex;
      const last = viewIndex === -1 && index === hierarchyArr.length - 1;
      return (
        <Action
          key={`action${index}`}
          index={index}
          state={snapshot.state}
          displayName={snapshot.displayName}
          componentName={snapshot.componentName}
          componentData={snapshot.componentData}
          selected={selected}
          last={last}
          dispatch={dispatch}
          sliderIndex={sliderIndex}
          handleOnkeyDown={handleOnKeyDown}
          viewIndex={viewIndex}
        />
      );
    }
  );
  useEffect(() => {
    setActionView(true);
  }, []);

  // this is not logging; the prop is not being udpdated or the component is not being re-rendered.
  return (
    <div id='action-id' className='action-container'>
      <div id='arrow'>
        <aside className='aside'>
          <a onClick={toggleActionContainer} className='toggle'>
            <i></i>
          </a>
        </aside>
      </div>
      {actionView ? (
        <div>
          <SwitchAppDropdown />
          <div className='action-component exclude'>
            <button
              className='empty-button'
              onClick={() => {
                dispatch(emptySnapshots());
                // set slider back to zero
                resetSlider();
              }}
              type='button'
            >
              Empty
            </button>
          </div>
          <div>{actionsArr}</div>
        </div>
      ) : null}
    </div>
  );
}

export default ActionContainer;
