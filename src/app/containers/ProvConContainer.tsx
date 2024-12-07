import { width } from '@mui/system';
import React, {useState} from 'react';
import { ProvConContainerProps} from '../FrontendTypes';


const ProvConContainer = (props: ProvConContainerProps): JSX.Element  => {

    const { currentSnapshot } = props
  
    console.log('currentSnapshot', currentSnapshot)

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
    console.log('context only', contextProvidersOnly)

    const [visibleKeys, setVisibleKeys] = useState({});

    const toggleInfo = (key:string) => {
        setVisibleKeys((prev) => ({
          ...prev, //copies all current keys and their visibility from prev object
          [key]: !prev[key] // adds or updates the key in the visibleKeys object.
        }))
      };
    const someInfo = {
      ThemeProvider: { 
        UserProvider: {
          UserContext: 'some info herecdxjchffhdjhfdfdfhdjhfdjhfdjhfvhhhh',
        },
        ThemeContext1:  {
          Nested: 'some info here'},
        ThemeConext2: 'some info here'
      },
    }
    

    // Recursive function to render nested objects
  const renderNestedObjec = (obj, parentKey = '') => { //parentKey is unique keys that represent the hierarchy of the object.
    return Object.keys(obj).map((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key; // if parentKey does not exisit --> fullKey = key, else fullKey=ParentKey.Key
      return (
        // each key is rendered as a div
        <div key={fullKey} style={{width: '100%', backgroundColor: 'red'}} > 
          <div
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => toggleInfo(fullKey)} // Pass the unique key to toggle visibility
          >
            <strong>{key}</strong>
          </div>
          {visibleKeys[fullKey] && // Check if the key is visible
            (typeof obj[key] === 'object' //check if the value of the key is an object
              ? renderNestedObjec(obj[key], fullKey) // Recursive rendering for nested objects
              //if value is not an object
              : <div >{obj[key]}</div>)}
        </div>
      );
    });
  };

  return <div style={{width: '100%'}}>{renderNestedObjec(someInfo)}</div>;
};


export default ProvConContainer;