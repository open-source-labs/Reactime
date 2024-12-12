import React, {useState} from 'react';
import { ProvConContainerProps} from '../FrontendTypes';


const ProvConContainer = (props: ProvConContainerProps): JSX.Element  => {

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
                        color: isExpanded ? "#1f2937" : "#059669",
                    }}
                >
                    {node.name}
                </p>
                {/* Render HookState if it exists */}
                {isExpanded && node.componentData?.hooksState && (
                    <div>
                        <h1 style={{fontWeight: "bold"}}>State: {'{}'}</h1>
                        <ul>
                                {Object.entries(node.componentData.hooksState).map(([key, value]) => (
                                    <li style={{ whiteSpace: "normal" , overflowWrap: "break-word", listStyleType: "none" }}>
                                        <strong>{key}:</strong> {typeof value === 'object'? JSON.stringify(value, null,2): value.toString()}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
    
                {/* Render Context Property if it exists */}
                {isExpanded && node.componentData?.context &&  Object.keys(node.componentData?.context).length !== 0 && (
                    <div>
                        <h1 style={{fontWeight: "bold"}}>Context Property: {'{}'} </h1>   
                        <ul>
                            {Object.entries(node.componentData.context).map(([key, value]) => {
                                // Parse if the value is a JSON string
                                let parsedValue = value;
                                if (typeof value === "string") {
                                    try {
                                        parsedValue = JSON.parse(value);
                                    } catch {
                                        parsedValue = value; // Keep the original value if parsing fails
                                    }
                                }
                                return (
                                    <li key={key} style={{ whiteSpace: "normal", overflowWrap: "break-word", listStyleType: "none" }}>
                                        <strong>{key}:</strong>{" "}
                                        {typeof parsedValue === "object" && parsedValue !== null ? (
                                            <ul style={{ listStyleType: "none", paddingLeft: "1rem" }}>
                                                {Object.entries(parsedValue).map(([nestedKey, nestedValue]) => (
                                                    <li key={nestedKey}>
                                                        <strong>{nestedKey}:</strong> {nestedValue === null ? "null" : nestedValue.toString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            parsedValue === null ? "null" : parsedValue.toString()
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                  
                )}
    
                {/* Render Context Value if it exists */}
                {isExpanded && node.componentData?.props?.value && (
                    <div>
                        <h1 style={{fontWeight: "bold"}}>Context Value: {'{}'}</h1>
                            <ul>
                                    {(() => {
                                        try {
                                            const parsedValue = JSON.parse(node.componentData.props.value); // Parse the JSON string
                                            return Object.entries(parsedValue).map(([key, value]) => (
                                                <li key={key} style={{ whiteSpace: "normal", overflowWrap: "break-word", listStyleType: "none" }}>
                                                    {/* <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value?.toString()} */}

                                                    <strong>{key}:</strong>{" "}
                                                    {value === null ? (
                                                        "null"
                                                    ) : typeof value === "object" ? (
                                                        <ul style={{ listStyleType: "none", paddingLeft: "1rem" }}>
                                                            {Object.entries(value).map(([nestedKey, nestedValue]) => (
                                                                <li key={nestedKey}>
                                                                    <strong>{nestedKey}:</strong> {nestedValue === null ? "null" : nestedValue?.toString()}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        value?.toString()
                                                    )}
                                                </li>
                                            ));
                                        } catch (error) {
                                            return (
                                                <li style={{ color: "red" }}>
                                                    Error parsing value: {error.message}
                                                </li>
                                            );
                                        }
                                    })()}
                                </ul>
                    </div>
            
                )}
    
                {/* Recursively Render Children */}
                {isExpanded &&
                    node.children &&
                    node.children.map((child) => renderNestedObject(child, depth + 1))}
            </div>
        );
    };
    

    return (
        <div style={{ width: "260px", marginLeft: "25px"}}>
            {renderNestedObject(contextProvidersOnly)}
        </div>
    );

};


export default ProvConContainer;