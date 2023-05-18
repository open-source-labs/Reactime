import React from 'react';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';
import { useStoreContext } from '../store';
import { DiffProps, StatelessCleanning } from '../FrontendTypes';

/**
 * Displays tree showing specific two versions of tree
 * one with specific state changes, the other the whole tree
 * @param props props from maincontainer
 * @returns a diff tree or a string stating no state changes have happened
 */
function Diff(props: DiffProps): JSX.Element {
  const { snapshot, show } = props;
  const [mainState] = useStoreContext();
  const { currentTab, tabs } = mainState; // k/v pairs of mainstate store object being created
  const { snapshots, viewIndex, sliderIndex } = tabs[currentTab];
  let previous: unknown;

  // previous follows viewIndex or sliderIndex
  if (viewIndex !== -1) {
    // if tab isnt selected, view index is set to -1
    previous = snapshots[viewIndex - 1];
  } else {
    previous = snapshots[sliderIndex - 1];
  }

  // cleaning preview from stateless data
  const statelessCleanning = (obj: StatelessCleanning) => {
    const newObj = { ...obj };
    if (newObj.name === 'nameless') {
      delete newObj.name;
    }
    if (newObj.componentData) {
      delete newObj.componentData;
    }
    if (newObj.state === 'stateless') {
      delete newObj.state;
    }
    if (newObj.stateSnaphot) {
      newObj.stateSnaphot = statelessCleanning(obj.stateSnaphot);
    }
    if (newObj.children) {
      newObj.children = [];
      if (obj.children.length > 0) {
        obj.children.forEach(
          (element: { state?: Record<string, unknown> | string; children?: [] }) => {
            if (element.state !== 'stateless' || element.children.length > 0) {
              const clean = statelessCleanning(element);
              newObj.children.push(clean);
            }
          },
        );
      }
    }
    return newObj;
  };

  // displays stateful data
  const previousDisplay: StatelessCleanning = statelessCleanning(previous);
  // diff function returns a comparison of two objects, one has an updated change
  // just displays stateful data
  const delta: StatelessCleanning = diff(previousDisplay, snapshot);
  // returns html in string
  // just displays stateful data
  const html: StatelessCleanning = formatters.html.format(delta, previousDisplay);
  if (show) formatters.html.showUnchanged();
  else formatters.html.hideUnchanged();
  if (previous === undefined || delta === undefined) {
    return (
      <div className='no-data-message'>
        {' '}
        Make state changes and click on a Snapshot to see the difference between that snapshot and the previous one.{' '}
      </div>
    );
  }
  return <div>{ReactHtmlParser(html)}</div>;
}

export default Diff;
