import React from 'react';
import PropTypes from 'prop-types';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';

import { useStoreContext } from '../store';

function Diff({ snapshot, show }) {
  const [mainState] = useStoreContext();
  const { currentTab, tabs } = mainState; // Nate:: k/v pairs of mainstate store object being created
  const { snapshots, viewIndex, sliderIndex } = tabs[currentTab];
  let previous;

  // previous follows viewIndex or sliderIndex
  if (viewIndex !== -1) { // if tab isnt selected, view index is set to -1
    previous = snapshots[viewIndex - 1];
  } else {
    previous = snapshots[sliderIndex - 1];
  }

  // gabi :: cleanning preview from stateless data
  const statelessCleanning = obj => {
    const newObj = { ...obj };
    if (newObj.name === 'nameless') {
      delete newObj.name;
    }
    if (newObj.componentData) {
      delete newObj.componentData;
    }
    if (newObj.parent || newObj.parent === null) {
      delete newObj.parent;
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
        obj.children.forEach(element => {
          if (element.state !== 'stateless' || element.children.length > 0) {
            const clean = statelessCleanning(element);
            newObj.children.push(clean);
          }
        });
      }
    }
    return newObj;
  };
  // gabi :: just display stateful data
  const previousDisplay = statelessCleanning(previous);
  // Nate:: diff function returns a comparison of two objects, one has an updated change
  // gabi :: just display stateful data
  const delta = diff(previousDisplay, snapshot);
  // returns html in string
  // gabi :: just display stateful data
  const html = formatters.html.format(delta, previousDisplay);
  if (show) formatters.html.showUnchanged();
  else formatters.html.hideUnchanged();

  if (previous === undefined || delta === undefined) {
    console.log('reacthtml parser -->', ReactHtmlParser(html), typeof ReactHtmlParser(html))
    return <div className='noState'> No state change detected. Trigger an event to change state </div>;
  }
  return <div>{ReactHtmlParser(html)}</div>;
}

Diff.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  show: PropTypes.bool.isRequired,
};

export default Diff;
