import React from "react";
import ReactDOM from "react-dom";
import reactime from "reactime";
import App from "./component/App";
import "./index.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";

const rootContainer = document.getElementById('root'); 
ReactDOM.render(<App />, rootContainer); 
// uncomment the line below to test Reactime 3.3 or older 
// reactime(rootContainer);