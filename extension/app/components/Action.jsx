import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const { snapshot, selected } = props;
  console.log(selected);
  return (
    <div className="action-component">
      {snapshot.state}
      {' '}
      {selected.toString()}
    </div>
  );
};

Action.propTypes = {
  // snapshot: PropTypes.object,
};

export default Action;
