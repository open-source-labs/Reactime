import React from "react";
// import PropTypes from "prop-types";

import "./Display.css";

const Display = props => {
  // const static = propTypes => {
  //   value: PropTypes.string,
  // };

  return (
    <div className="component-display">
      <div>{props.value}</div>
    </div>
  );
}

export default Display