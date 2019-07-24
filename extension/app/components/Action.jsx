import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const { snapshot } = props;
  return <div className="action-component">{snapshot.state}</div>;
};

Action.propTypes = {
  // snapshot: PropTypes.object,
};

export default Action;
