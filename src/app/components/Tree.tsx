import React from 'react';
import JSONTree from 'react-json-tree';


const getItemString = (type, data:{state:object|string, name:string, children:[]}) => {
  // check to make sure that we are on the tree node, not anything else
  if (
    Object.keys(data).length > 3
    && typeof data.state === 'object'
    && typeof data.name === 'string'
    && Array.isArray(data.children)
  ) {
    return <span>{data.name}</span>;
  }
  return null;
};

interface TreeProps {
  snapshot: {state?:object|string, children?:[]};
}

const Tree = (props:TreeProps) => {
  const { snapshot } = props;

  return (
    <>
      {snapshot && (
        <JSONTree
          data={snapshot}
          theme={{ tree: () => ({ className: 'json-tree' }) }}
          shouldExpandNode={() => true}
          getItemString={getItemString}
          labelRenderer={(raw:[]) => (typeof raw[0] !== 'number' ? <span>{raw[0]}</span> : null)}
        />
      )}
    </>
  );
};

export default Tree;
