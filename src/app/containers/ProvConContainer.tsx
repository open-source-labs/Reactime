import { width } from '@mui/system';
import React, {useState} from 'react';
import { ProvConContainerProps} from '../FrontendTypes';


const ProvConContainer = (props: ProvConContainerProps): JSX.Element  => {

    const { currentSnapshot } = props;

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



    // State for managing expansion of nodes
    const [expandedNodes, setExpandedNodes] = useState({});

    // Toggle function to expand/collapse a node
    const toggleExpand = (nodeName) => {
        setExpandedNodes((prev) => ({
            ...prev,
            [nodeName]: !prev[nodeName],
        }));
    };

    // // Recursive function to render nested objects
    // const renderNestedObject = (node, depth = 0) => {
    //     const isExpanded = expandedNodes[node.name];

    //     return (
    //         <div key={node.name} style={{ marginLeft: `${depth * 20}px` }}>
    //             <p
    //                 onClick={() => toggleExpand(node.name)}
    //                 style={{
    //                     cursor: "pointer",
    //                     fontWeight: "bold",
    //                     textDecoration: "underline",
    //                     color: isExpanded ? "green" : "blue",
    //                 }}
    //             >
    //                 {node.name}
    //             </p>

    //             {isExpanded &&
    //                 node?.children?.[0]?.componentData?.context &&
    //                 node?.children?.[0]?.componentData?.props?.value && (
    //                     <div>
    //                         <p>
    //                             Context Property:{" "}
    //                             {JSON.stringify(
    //                                 node.children[0].componentData.context
    //                             )}
    //                         </p>
    //                         <p>
    //                             Context Value:{" "}
    //                             {JSON.stringify(
    //                                 node.children[0].componentData.props.value
    //                             )}
    //                         </p>
    //                     </div>
    //                 )}

    //             {/* Recursively render children */}
    //             {isExpanded &&
    //                 node.children &&
    //                 node.children.map((child) =>
    //                     renderNestedObject(child, depth + 1)
    //                 )}
    //         </div>
    //     );
    // };
    const style = {
        whiteSpace: "normal", // Allow text to wrap
        overflowWrap: "break-word", // Break long words
        width: "300px", // Limit container width
        border: "1px solid black", // Optional: Visualize container
        padding: "10px", // Optional: Add padding
      };
    

    const renderNestedObject = (node, depth = 0) => {
        const isExpanded = expandedNodes[node.name];
    
        return (
            <div key={node.name}>
                {/* Render Node Name */}
                <p
                    onClick={() => toggleExpand(node.name)}
                    style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        color: isExpanded ? "green" : "blue",
                    }}
                >
                    {node.name}
                </p>
    
                {/* Render HookState if it exists */}
                {isExpanded && node.componentData?.hooksState && (
                    <p style={{ whiteSpace: "normal" , overflowWrap: "break-word", padding: "20px"}}>
                         State: {JSON.stringify(node.componentData.hooksState)}
                    </p>
                )}
    
                {/* Render Context Property if it exists */}
                {isExpanded && node.componentData?.context &&  Object.keys(node.componentData?.context).length !== 0 && (
                    <p style={{ whiteSpace: "normal", overflowWrap: "break-word", padding: "20px"}}>
                        Context Property: {JSON.stringify(node.componentData.context)}
                    </p>
                )}
    
                {/* Render Context Value if it exists */}
                {isExpanded && node.componentData?.props?.value && (
                    <p style={{ whiteSpace: "normal" , overflowWrap: "break-word", padding: "10px"}}>
                        Context Value: {JSON.stringify(node.componentData.props.value)}
                    </p>
                )}
    
                {/* Recursively Render Children */}
                {isExpanded &&
                    node.children &&
                    node.children.map((child) => renderNestedObject(child, depth + 1))}
            </div>
        );
    };
    

    return (
        <div style={{ width: "300px" }}>
            {renderNestedObject(contextProvidersOnly)}
        </div>
    );

};


export default ProvConContainer;