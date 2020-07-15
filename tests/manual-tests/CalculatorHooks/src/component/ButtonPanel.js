import Button from "./Button";
import React from "react";
// import PropTypes from "prop-types";

import "./ButtonPanel.css";

const ButtonPanel = props => {
  // const static = propTypes => {
  //   clickHandler: PropTypes.func,
  // };

  const handleClick = buttonName => {
    props.clickHandler(buttonName);
  };

  return (
      <div className="component-button-panel">
        <div>
          <Button name="AC" clickHandler={() => handleClick("AC")} />
          <Button name="+/-" clickHandler={() => handleClick("+/-")} />
          <Button name="%" clickHandler={() => handleClick("%")} />
          <Button name="÷" clickHandler={() => handleClick("÷")} orange />
        </div>
        <div>
          <Button name="7" clickHandler={() => handleClick("7")} />
          <Button name="8" clickHandler={() => handleClick("8")} />
          <Button name="9" clickHandler={() => handleClick("9")} />
          <Button name="x" clickHandler={() => handleClick("x")} orange />
        </div>
        <div>
          <Button name="4" clickHandler={() => handleClick("4")} />
          <Button name="5" clickHandler={() => handleClick("5")} />
          <Button name="6" clickHandler={() => handleClick("6")} />
          <Button name="-" clickHandler={() => handleClick("-")} orange />
        </div>
        <div>
          <Button name="1" clickHandler={() => handleClick("1")} />
          <Button name="2" clickHandler={() => handleClick("2")} />
          <Button name="3" clickHandler={() => handleClick("3")} />
          <Button name="+" clickHandler={() => handleClick("+")} orange />
        </div>
        <div>
          <Button name="0" clickHandler={handleClick} wide />
          <Button name="." clickHandler={handleClick} />
          <Button name="=" clickHandler={handleClick} orange />
        </div>
      </div>
  );
}

export default ButtonPanel