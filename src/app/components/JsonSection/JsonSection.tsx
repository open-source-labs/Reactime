import React from 'react';
import { JSONTree } from 'react-json-tree';
import { jsonTheme, parseStringifiedValues } from '../../utils/providerUtils';

interface JsonSectionProps {
  title?: string | null;
  content: any;
  isReducer?: boolean;
}

const formatReducerData = (data: any) => {
  const formattedData: Record<string, any> = {};
  if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        formattedData[key] = value;
      }
    });
  }
  return formattedData;
};

const JsonSection = ({ title, content, isReducer = false }: JsonSectionProps): JSX.Element | null => {
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
      {title && <div className='tooltip-section-title'>{title}</div>}
      <div className='tooltip-data'>
        <JSONTree data={parsedContent} theme={jsonTheme} hideRoot shouldExpandNode={() => true} />
      </div>
    </div>
  );
};

export default JsonSection; 