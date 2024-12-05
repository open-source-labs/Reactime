import React from 'react';
import { JSONTree } from 'react-json-tree';

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
  base09: '#824508',
  base0A: '#fec418',
  base0B: '#48b685',
  base0C: '#5bc4bf',
  base0D: '#06b6ef',
  base0E: '#815ba4',
  base0F: '#e96ba8',
};

const ToolTipDataDisplay = ({ containerName, dataObj }) => {
  // If there's no data to display, don't render anything
  if (
    !dataObj ||
    (Array.isArray(dataObj) && dataObj.length === 0) ||
    Object.keys(dataObj).length === 0
  ) {
    return null;
  }

  const formatReducerData = (reducerStates) => {
    // Transform the array of reducers into an object with hook names as keys
    return reducerStates.reduce((acc, reducer) => {
      acc[reducer.hookName || 'Reducer'] = {
        state: reducer.state,
      };
      return acc;
    }, {});
  };

  const printableObject = {};

  if (containerName === 'Reducers') {
    if (!dataObj || dataObj.length === 0) {
      return null;
    }
    printableObject[containerName] = formatReducerData(dataObj);
  } else {
    // Handle normal state/props
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
    printableObject[containerName] = data;
  }

  return (
    <div className='tooltipData' key={`${containerName}-data-container`}>
      <JSONTree
        data={printableObject}
        theme={{ extend: colors, tree: () => ({ className: `tooltipData-JSONTree` }) }}
        shouldExpandNodeInitially={() => true}
        hideRoot={true}
      />
    </div>
  );
};

export default ToolTipDataDisplay;
