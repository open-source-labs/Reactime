import React from 'react';
import JSONTree from 'react-json-tree';

const getItemString = (type, data, itemType, itemString) => (
  <span>
    //
    {type}
  </span>
);

const Tree = (props) => {
  const { snapshot } = props;
  return (
    <JSONTree
      data={snapshot}
      theme={{ tree: () => ({ className: 'json-tree' }) }}
      getItemString={getItemString}
    />
  );
};
export default Tree;
