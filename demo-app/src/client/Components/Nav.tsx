import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return(
    <div className="nav">
      <Link className="link" to="/">About</Link>
      <Link id="tictactoe" className="link" to="/tictactoe">Tic-Tac-Toe</Link>
      <Link className="link" to="/buttons">Counter</Link>
    </div>
  )
}

export default Nav;