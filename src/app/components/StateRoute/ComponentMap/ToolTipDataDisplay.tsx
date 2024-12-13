import React from 'react';
import { JSONTree } from 'react-json-tree';

const ToolTipDataDisplay = ({ containerName, dataObj }) => {
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
      // Use the hookName as the key and only include the state
      acc[reducer.hookName || 'Reducer'] = reducer.state;
      return acc;
    }, {});
  };

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <JSONTree
          data={value}
          theme={{
            scheme: 'custom',
            base00: 'transparent',
            base0B: '#14b8a6', // Teal for strings
            base0D: '#60a5fa', // Blue for keys
            base09: '#f59e0b', // Orange for numbers
            base0C: '#06b6d4', // Cyan for nulls
          }}
          hideRoot
          shouldExpandNode={() => true}
        />
      );
    }
    return <span className='tooltip-value'>{String(value)}</span>;
  };

  const renderContent = () => {
    if (containerName === 'Reducers') {
      const formattedData = formatReducerData(dataObj);
      return (
        <div className='tooltip-content'>
          {Object.entries(formattedData).map(([hookName, state]) => (
            <div key={hookName} className='tooltip-reducer-item'>
              <div className='tooltip-reducer-name'>{hookName}</div>
              <div className='tooltip-reducer-state'>{renderValue(state)}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='tooltip-content'>
        {Object.entries(dataObj).map(([key, value]) => (
          <div key={key} className='tooltip-item'>
            <div className='tooltip-data'>
              <span className='tooltip-key'>{key}</span>
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='tooltip-container'>
      <div className='tooltip-header'>
        <h3 className='tooltip-title'>{containerName}</h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default ToolTipDataDisplay;
