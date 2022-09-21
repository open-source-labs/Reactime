import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav";
import Board from "./Components/Board";
import Home from "./Components/Home";
import Buttons from "./Components/Buttons";

const app = document.getElementById("root");
const root = createRoot(app); 

root.render(<BrowserRouter>
  <Nav />
  <Routes>
    <Route path="/tictactoe" element={<Board />}/>
    <Route path="/" element={<Home />}/>
    <Route path="/buttons" element={<Buttons />}/>
  </Routes>
</BrowserRouter>);
