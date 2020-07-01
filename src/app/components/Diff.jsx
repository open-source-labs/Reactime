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
  // Nate:: diff function returns a comparaison of two objects, one has an updated change
  const delta = diff(previous, snapshot); // initilly an array with one object, on state change becomes an object
  // console.log('delta: ', delta);
  // returns html in string
  const html = formatters.html.format(delta, previous);
  // console.log('html   -->', html)
  if (show){
    // console.log('showing unchanged values', formatters.html.showUnchanged() );
    formatters.html.showUnchanged();
  } else {
    // console.log('hiding unchanged values', formatters.html.hideUnchanged() );
    formatters.html.hideUnchanged();
  };
  
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
