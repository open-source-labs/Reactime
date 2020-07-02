import React from 'react';
import PropTypes from 'prop-types';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';

import { useStoreContext } from '../store';

function Diff({ snapshot, show }) {
  const [mainState] = useStoreContext();
  // console.log('this is the mainState variable -->', mainState);
  const { currentTab, tabs } = mainState; // Nate:: k/v pairs of mainstate store object being created
  // console.log('this is the currentTab variable -->', currentTab);
  // console.log('this is the tabs variable -->', tabs);
  const { snapshots, viewIndex, sliderIndex } = tabs[currentTab];
  let previous;

  // previous follows viewIndex or sliderIndex
  if (viewIndex !== -1) { // if tab isnt selected, view index is set to -1
    previous = snapshots[viewIndex - 1];
    // console.log('previous with viewIndex - 1: ', previous)
  } else {
    previous = snapshots[sliderIndex - 1];
    // console.log('previous with sliderIndex - 1: ', previous)
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
