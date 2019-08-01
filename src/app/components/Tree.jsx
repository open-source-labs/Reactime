import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';

const getItemString = (type, data, itemType, itemString) => <span>{data.name}</span>;

const Tree = (props) => {
  const { snapshot } = props;
  return (
    <React.Fragment>
      {snapshot && (
        <JSONTree
          data={snapshot}
          theme={{ tree: () => ({ className: 'json-tree' }) }}
          shouldExpandNode={() => true}
          getItemString={getItemString}
          labelRenderer={(raw) => {
            if (typeof raw[0] !== 'number') return <span>{raw[0]}</span>;
          }}
        />
      )}
    </React.Fragment>
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
