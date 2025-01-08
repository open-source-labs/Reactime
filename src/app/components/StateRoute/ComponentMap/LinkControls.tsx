import React from 'react';

const LinkControls = ({
  linkType,
  stepPercent,
  setOrientation,
  setLinkType,
  setStepPercent,
  setSelectedNode,
  snapShots,
}) => {
  const collectNodes = (node) => {
    const nodeList = [];
    nodeList.push(node);
    for (let i = 0; i < nodeList.length; i += 1) {
      const cur = nodeList[i];
      if (cur.children?.length > 0) {
        cur.children.forEach((child) => nodeList.push(child));
      }
    }
    return nodeList;
  };

  const shouldIncludeNode = (node) => {
    // Return false if node has any context properties
    if (node?.componentData?.context && Object.keys(node.componentData.context).length > 0) {
      return false;
    }
    // Return false if node name ends with 'Provider'
    if (node?.name && node.name.endsWith('Provider')) {
      return false;
    }
    return true;
  };

  const processTreeData = (node) => {
    if (!node) return null;

    // Create a new node
    const newNode = { ...node };

    if (node.children) {
      // Process all children first
      const processedChildren = node.children
        .map((child) => processTreeData(child))
        .filter(Boolean); // Remove null results

      // For each child that shouldn't be included, replace it with its children
      newNode.children = processedChildren.reduce((acc, child) => {
        if (shouldIncludeNode(child)) {
          // If child should be included, add it directly
          acc.push(child);
        } else {
          // If child should be filtered out, add its children instead
          if (child.children) {
            acc.push(...child.children);
          }
        }
        return acc;
      }, []);
    }

    return newNode;
  };
  const filtered = processTreeData(snapShots);
  const nodeList = collectNodes(filtered);

  return (
    <div className='link-controls'>
      <div className='control-group'>
        <label className='control-label'>Orientation:</label>
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setOrientation(e.target.value)}
          className='control-select'
        >
          <option value='vertical'>Vertical</option>
          <option value='horizontal'>Horizontal</option>
        </select>
      </div>

      <div className='control-group'>
        <label className='control-label'>Link:</label>
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setLinkType(e.target.value)}
          className='control-select'
        >
          <option value='step'>Step</option>
          <option value='diagonal'>Diagonal</option>
          <option value='line'>Line</option>
        </select>
      </div>

      <div className='control-group'>
        <label className='control-label'>Select:</label>
        <select
          id='selectInput'
          name='nodeOptions'
          onChange={(e) => setSelectedNode(e.target.value)}
          className='control-select'
        >
          {nodeList.map((node) =>
            node.children.length > 0 ? (
              <option key={node.name} value={node.name}>
                {node.name}
              </option>
            ) : null,
          )}
        </select>
      </div>

      {linkType === 'step' && (
        <div className='control-group'>
          <label className='control-label'>Step:</label>
          <input
            onClick={(e) => e.stopPropagation()}
            type='range'
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step'}
            className='control-range'
          />
        </div>
      )}
    </div>
  );
};

export default LinkControls;
