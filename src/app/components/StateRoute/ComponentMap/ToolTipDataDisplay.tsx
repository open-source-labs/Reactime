import React from 'react';
import JSONTree from 'react-json-tree';


const colors = {
  scheme: 'paraiso',
  author: 'jan t. sott',
  base00: '#2f1e2e',
  base01: '#41323f',
  base02: '#4f424c',
  base03: '#776e71',
  base04: '#8d8687',
  base05: '#a39e9b',
  base06: '#b9b6b0',
  base07: '#e7e9db',
  base08: '#ef6155',
  //base09 is orange for booleans and numbers. This base in particular fails to match the entered color.
  base09: '#824508', 
// base09: '#592bad', // alternative purple
  base0A: '#fec418',
  base0B: '#48b685',
  base0C: '#5bc4bf',
  base0D: '#06b6ef',
  base0E: '#815ba4',
  base0F: '#e96ba8',
};


const ToolTipDataDisplay = ({ containerName, dataObj }) => {
  //The key:value properties of printableObject will be rendered in the JSON Tree
  const printableObject = {}
  //If state is null rather than an object, print "State: null" in tooltip
  if (!dataObj) {
      printableObject[containerName] = dataObj;
  } else {
    // Props often contain circular references and messages from the backend must be sent as JSON
    // objects (strings). JSON objects can't contain circular ref's, so the backend filters out problematic
    // values by stringifying the values of object properties and ignoring any values that fail the
    // conversion due to a circular ref. 
    // The following logic converts these values back to JS so they display clearly and are collapsible.
    const data = {};
    for (const key in dataObj) {
      if (typeof dataObj[key] === 'string') {
        try {
          data[key] = JSON.parse(dataObj[key]);
        } catch {
          data[key] = dataObj[key];
        }
      } else {
        data[key] = dataObj[key];
      }
    }
    // Adds container name (State, Props, future different names for hooks) at top of object
    // so everything nested in it will collapse when you click on it.
    printableObject[containerName] = data
  }

  return (
    <div
      className='tooltipData'
      key={`${containerName}-data-container`}
    >
      <JSONTree
        data={printableObject}
        theme={{ extend: colors, tree: () => ({ className: `tooltipData-JSONTree` }) }}
        shouldExpandNode={() => true}
        hideRoot={true}
        />
    </div>
  )
};

export default ToolTipDataDisplay;