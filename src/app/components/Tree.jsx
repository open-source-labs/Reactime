import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';


const getItemString = (type, data) => {
  // console.log("getItemString -> type", type)
  // console.log("getItemString -> data", data)
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

const Tree = props => {
  const { snapshot } = props;

  return (
    <>
      {snapshot && (
        <JSONTree
          data={snapshot}
          theme={{ tree: () => ({ className: 'json-tree' }) }}
          shouldExpandNode={() => true}
          getItemString={getItemString}
          labelRenderer={raw => (typeof raw[0] !== 'number' ? <span>{raw[0]}</span> : null)}
        />
      )}
    </>
  );
};

Tree.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
  }).isRequired,
};

export default Tree;
