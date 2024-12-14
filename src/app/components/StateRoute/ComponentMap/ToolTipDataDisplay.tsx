import React from 'react';
import { JSONTree } from 'react-json-tree';

const ToolTipDataDisplay = ({ data }) => {
  if (!data) return null;

  const jsonTheme = {
    scheme: 'custom',
    base00: 'transparent',
    base0B: '#ffff', // white for strings
    base0D: '#60a5fa', // Blue for keys
    base09: '#f59e0b', // Orange for numbers
    base0C: '#EF4444', // red for nulls
  };

  const formatReducerData = (reducerStates) => {
    return reducerStates.reduce((acc, reducer) => {
      acc[reducer.hookName || 'Reducer'] = reducer.state;
      return acc;
    }, {});
  };

  const renderSection = (title, content, isReducer = false) => {
    if (
      !content ||
      (Array.isArray(content) && content.length === 0) ||
      Object.keys(content).length === 0
    ) {
      return null;
    }

    if (isReducer) {
      const formattedData = formatReducerData(content);
      return (
        <div className='tooltip-section'>
          {Object.entries(formattedData).map(([hookName, state]) => (
            <div key={hookName}>
              <div className='tooltip-section-title'>{hookName}</div>
              <div className='tooltip-data'>
                <JSONTree data={state} theme={jsonTheme} hideRoot shouldExpandNode={() => true} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='tooltip-section'>
        <div className='tooltip-section-title'>{title}</div>
        <div className='tooltip-data'>
          <JSONTree data={content} theme={jsonTheme} hideRoot shouldExpandNode={() => true} />
        </div>
      </div>
    );
  };

  return (
    <div className='tooltip-container'>
      {renderSection('Props', data.componentData.props)}
      {renderSection('State', data.componentData.state || data.componentData.hooksState)}
      {renderSection(null, data.componentData.reducerStates, true)}
    </div>
  );
};

export default ToolTipDataDisplay;
