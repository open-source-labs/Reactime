import React from 'react';
import { ProvConContainerProps } from '../FrontendTypes';
import JsonSection from '../components/JsonSection/JsonSection';
import { keepContextAndProviderNodes, filterComponentProperties } from '../utils/providerUtils';

const ProvConContainer = ({ currentSnapshot }: ProvConContainerProps): JSX.Element => {
  // Process and filter the component tree
  const contextProvidersOnly = keepContextAndProviderNodes(currentSnapshot);
  const filteredProviders = filterComponentProperties(contextProvidersOnly);

  return (
    <div>
      <div className='route-header'>Providers / Consumers</div>
      {filteredProviders ? (
        <JsonSection content={filteredProviders} />
      ) : (
        <div className='accessibility-text'>
          <p>No providers or consumers found in the current component tree.</p>
        </div>
      )}
    </div>
  );
};

export default ProvConContainer;
