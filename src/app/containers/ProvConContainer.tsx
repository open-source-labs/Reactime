import React, { useState } from 'react';
import { ProvConContainerProps, FilteredNode } from '../FrontendTypes';
import { JSONTree } from 'react-json-tree';

const ProvConContainer = (props: ProvConContainerProps): JSX.Element => {
  const jsonTheme = {
    scheme: 'custom',
    base00: 'transparent',
    base0B: '#1f2937', // dark navy for strings
    base0D: '#60a5fa', // Keys
    base09: '#f59e0b', // Numbers
    base0C: '#EF4444', // Null values
  };

  //deconstruct props
  const { currentSnapshot } = props;

  //parse through node
  const keepContextAndProviderNodes = (node) => {
    if (!node) return null;

    // Check if this node should be kept
    const hasContext =
      node?.componentData?.context && Object.keys(node.componentData.context).length > 0;
    const isProvider = node?.name && node.name.endsWith('Provider');
    const shouldKeepNode = hasContext || isProvider;

    // Process children first
    let processedChildren = [];
    if (node.children) {
      processedChildren = node.children
        .map((child) => keepContextAndProviderNodes(child))
        .filter(Boolean); // Remove null results
    }

    // If this node should be kept or has kept children, return it
    if (shouldKeepNode || processedChildren.length > 0) {
      return {
        ...node,
        children: processedChildren,
      };
    }

    // If neither the node should be kept nor it has kept children, filter it out
    return null;
  };
  const contextProvidersOnly = keepContextAndProviderNodes(currentSnapshot);

  const filterComponentProperties = (node: any): FilteredNode | null => {
    if (!node) return null;

    // Helper function to check if an object is empty (including nested objects)
    const isEmptyObject = (obj: any): boolean => {
      if (!obj) return true;
      if (Array.isArray(obj)) return obj.length === 0;
      if (typeof obj !== 'object') return false;

      // Check each property recursively
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'object') {
          if (!isEmptyObject(value)) return false;
        } else if (value !== undefined && value !== null) {
          return false;
        }
      }
      return true;
    };

    // Create a new object for the filtered node
    const filteredNode: FilteredNode = {};

    // Flatten root level props if they exist
    if (node.props && !isEmptyObject(node.props)) {
      Object.entries(node.props).forEach(([key, value]) => {
        if (!isEmptyObject(value)) {
          filteredNode[`prop_${key}`] = value;
        }
      });
    }

    // Flatten componentData properties into root level if they exist
    if (node.componentData) {
      // Add context directly if it exists
      if (node.componentData.context && !isEmptyObject(node.componentData.context)) {
        filteredNode.context = node.componentData.context;
      }

      // Flatten componentData.props if they exist
      if (node.componentData.props && !isEmptyObject(node.componentData.props)) {
        Object.entries(node.componentData.props).forEach(([key, value]) => {
          if (!isEmptyObject(value)) {
            filteredNode[`prop_${key}`] = value;
          }
        });
      }

      // Flatten componentData.hooksState if it exists
      if (node.componentData.hooksState && !isEmptyObject(node.componentData.hooksState)) {
        Object.entries(node.componentData.hooksState).forEach(([key, value]) => {
          if (!isEmptyObject(value)) {
            filteredNode[`hook_${key}`] = value;
          }
        });
      }
    }

    // Flatten root level hooksState if it exists
    if (node.hooksState && !isEmptyObject(node.hooksState)) {
      Object.entries(node.hooksState).forEach(([key, value]) => {
        if (!isEmptyObject(value)) {
          filteredNode[`hook_${key}`] = value;
        }
      });
    }

    // Process children and add them using the node's name as the key
    if (node.hasOwnProperty('children') && Array.isArray(node.children)) {
      for (const child of node.children) {
        const filteredChild = filterComponentProperties(child);
        if (filteredChild && !isEmptyObject(filteredChild) && child.name) {
          filteredNode[child.name] = filteredChild;
        }
      }
    }

    // Only return the node if it has at least one non-empty property
    return isEmptyObject(filteredNode) ? null : filteredNode;
  };
  const filteredProviders = filterComponentProperties(contextProvidersOnly);
  console.log('filtered', filteredProviders);

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

    return (
      <div className='tooltip-section'>
        <div className='tooltip-section-title'>{title}</div>
        <div className='tooltip-data'>
          <JSONTree
            data={parsedContent}
            theme={jsonTheme}
            hideRoot
            shouldExpandNode={() => true}
            shouldExpandNodeInitially={() => true}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className='route-header'>Providers / Consumers</div>
      {filteredProviders ? (
        <div>{renderSection(null, filteredProviders)}</div>
      ) : (
        <div className='accessibility-text '>
          <p>No providers or consumers found in the current component tree.</p>
        </div>
      )}
    </div>
  );
};

export default ProvConContainer;
