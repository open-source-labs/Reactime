import React from 'react';
import JSONTree from 'react-json-tree';

const getItemString = (type, data:{state?:object|string, name:string, children:[]}) => {
  if (data && data.name) {
    return <span>{data.name}</span>;
  }
  return <span />;
};

interface TreeProps {
  snapshot: { name?: string; componentData?: object; state?: string | object; stateSnaphot?: object; children?: any[]; };
}

const Tree = (props:TreeProps) => {
  const { snapshot } = props;
  // console.log('Tree -> snapshot', snapshot);

  return (
    <>
      {snapshot && (
        <JSONTree
          data={snapshot}
          theme={{ tree: () => ({ className: 'json-tree' }) }}
          shouldExpandNode={() => true}
          getItemString={getItemString}
          labelRenderer={(raw:any[]) => {
            return (typeof raw[0] !== 'number' ? <span>{raw[0]}</span> : null)
          }}
        />
      )}
    </>
  );
};

export default Tree;
