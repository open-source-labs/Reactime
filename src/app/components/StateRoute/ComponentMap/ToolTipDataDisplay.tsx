import React from 'react';
import { JSONTree } from 'react-json-tree';

const ToolTipDataDisplay = ({ data }) => {
  if (!data) return null;

  const jsonTheme = {
    scheme: 'custom',
    base00: 'transparent',
    base0B: '#14b8a6', // dark navy for strings
    base0D: '#60a5fa', // Keys
    base09: '#f59e0b', // Numbers
    base0C: '#EF4444', // Null values
  };

  // Helper function to parse stringified JSON in object values
  const parseStringifiedValues = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const parsed = { ...obj };
    for (const key in parsed) {
      if (typeof parsed[key] === 'string') {
        try {
          // Check if the string looks like JSON
          if (parsed[key].startsWith('{') || parsed[key].startsWith('[')) {
            const parsedValue = JSON.parse(parsed[key]);
            parsed[key] = parsedValue;
          }
        } catch (e) {
          // If parsing fails, keep original value
          continue;
        }
      } else if (typeof parsed[key] === 'object') {
        parsed[key] = parseStringifiedValues(parsed[key]);
      }
    }
    return parsed;
  };

  const formatReducerData = (reducerStates) => {
    // Check if reducerStates exists and is an object
    if (!reducerStates || typeof reducerStates !== 'object') {
      return {};
    }

    // Handle both array and object formats
    const statesArray = Array.isArray(reducerStates) ? reducerStates : Object.values(reducerStates);

    return statesArray.reduce((acc, reducer) => {
      // Add additional type checking for reducer object
      if (reducer && typeof reducer === 'object') {
        acc[reducer.hookName || 'Reducer'] = reducer.state;
      }
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

    // Parse any stringified JSON before displaying
    const parsedContent = parseStringifiedValues(content);

    if (isReducer && parsedContent) {
      // Only try to format if we have valid content
      const formattedData = formatReducerData(parsedContent);

      // Check if we have any formatted data to display
      if (Object.keys(formattedData).length === 0) {
        return null;
      }

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
          <JSONTree data={parsedContent} theme={jsonTheme} hideRoot shouldExpandNode={() => true} />
        </div>
      </div>
    );
  };

  return (
    <div className='tooltip-container'>
      {renderSection('Props', data.componentData?.props)}
      {renderSection('State', data.componentData?.state || data.componentData?.hooksState)}
      {renderSection(null, data.componentData?.reducerStates, true)}
    </div>
  );
};

export default ToolTipDataDisplay;
