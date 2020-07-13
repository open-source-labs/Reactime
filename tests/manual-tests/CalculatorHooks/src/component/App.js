import React, { useState } from "react";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import calculate from "../logic/calculate";
import "./App.css";

const App = props => {  
  const [obj, setObj] = useState({ total: null, next: null, operation: null });

  const handleClick = buttonName => {
    setObj(calculate(obj, buttonName));
  };

  return (
    <div className="component-app">
      <Display value={obj.next || obj.total || "0"} />
      <ButtonPanel clickHandler={handleClick} />
    </div>
  );
}

export default App