import React from 'react';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';
import { CurrentTab, DiffProps, MainState, RootState, StatelessCleaning } from '../FrontendTypes';
import { useSelector } from 'react-redux';

/**
 * Displays tree showing two specific versions of tree:
 * one with specific state changes, the other the whole tree
 * @param props props from maincontainer
 * @returns a diff tree or a string stating no state changes have happened
 */

function Diff(props: DiffProps): JSX.Element {
  const {
    snapshot, // snapshot from 'tabs[currentTab]' object in 'MainContainer'
    show, // boolean that is dependent on the 'Route' path; true if 'Route' path === '/diffRaw'
  } = props;
  const { currentTab, tabs }: MainState = useSelector((state: RootState) => state.main);
  const { snapshots, viewIndex, sliderIndex }: Partial<CurrentTab> = tabs[currentTab];

  let previous: unknown; // = (viewIndex !== -1) ? snapshots[viewIndex - 1] : previous = snapshots[sliderIndex - 1]

  if (viewIndex !== -1 && snapshots && viewIndex) {
    // snapshots should not have any property < 0. A viewIndex of '-1' means that we had a snapshot index that occurred before the initial snapshot of the application state... which is impossible. '-1' therefore means reset to the last/most recent snapshot.
    previous = snapshots[viewIndex - 1]; // set previous to the snapshot that is before the one we are currently viewing
  } else if (snapshots && sliderIndex) {
    previous = snapshots[sliderIndex - 1]; // if viewIndex was an impossible index, we will get our snapshots index using 'sliderIndex.' sliderIndex should have already been reset to the latest snapshot index. Previous is then set to the snapshot that occurred immediately before our most recent snapshot.
  }

  /*
    State snapshot objects have the following structure: 
    {
      children: array of objects
      componentData: object
      isExpanded: Boolean
      name: string
      route: object
      state: string
    }

     // cleaning preview from stateless data
  */
  const statelessCleaning = (obj: StatelessCleaning) => {
    const newObj = { ...obj }; // duplicate our input object into a new object

    if (newObj.name === 'nameless') {
      // if our new object's name is nameless
      delete newObj.name; // delete the name property
    }
    if (newObj.componentData) {
      // if our new object has a componentData property
      delete newObj.componentData; // delete the componentData property
    }
    if (newObj.state === 'stateless') {
      // if if our new object's state is stateless
      delete newObj.state; // delete the state property
    }

    if (newObj.stateSnaphot) {
      // if our new object has a stateSnaphot property
      newObj.stateSnaphot = statelessCleaning(obj.stateSnaphot); // run statelessCleaning on the stateSnapshot
    }

    if (newObj.children) {
      // if our new object has a children property
      newObj.children = [];
      if (obj.children.length > 0) {
        // and if our input object's children property is non-empty, go through each children object from our input object and determine, if the object being iterated on either has a stateless state or has a children array with a non-zero amount of objects. Objects that fulfill the above that need to be cleaned through statelessCleaning. Those that are cleaned through this process are then pushed to the new object's children array.
        obj.children.forEach(
          (element: { state?: Record<string, unknown> | string; children?: [] }) => {
            if (element.state !== 'stateless' || element.children.length > 0) {
              const clean = statelessCleaning(element);
              newObj.children.push(clean);
            }
          },
        );
      }
    }
    return newObj; // return the cleaned state snapshot(s)
  };

  console.log('previousDisplay before stateless cleaning: ', previous);
  const previousDisplay: StatelessCleaning = statelessCleaning(previous); // displays stateful data from the first snapshot that was taken before our current snapshot.
  console.log('previousDisplay after stateless cleaning: ', previousDisplay);
  const delta: StatelessCleaning = diff(previousDisplay, snapshot); // diff function from 'jsondiffpatch' returns the difference in state between 'previousDisplay' and 'snapshot'
  console.log('delta: ', delta);
  const html: StatelessCleaning = formatters.html.format(delta, previousDisplay); // formatters function from 'jsondiffpatch' returns an html string that shows the difference between delta and the previousDisplay
  console.log('html: ', html);

  console.log(show);
  console.log(formatters.html.showUnchanged());
  if (show)
    formatters.html.showUnchanged(); // shows unchanged values if we're on the '/diffRaw' path
  else formatters.html.hideUnchanged(); // hides unchanged values

  if (previous === undefined || delta === undefined) {
    // if there has been no state changes on the target/hooked application, previous and delta would be undefined.
    return (
      <div className='no-data-message'>
        {' '}
        Make state changes and click on a Snapshot to see the difference between that snapshot and
        the previous one.{' '}
      </div>
    );
  }
  return <div>{ReactHtmlParser(html)}</div>; // ReactHTMLParser from 'react-html-parser' package converts the HTML string into a react component.
}

export default Diff;
