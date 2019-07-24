import React, { Component } from 'react';
import { render } from 'react-dom';
import TestComp from './testcomp.jsx';

const { linkState } = require('react-time-travel');

class App extends Component {
  render() {
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <Board />
        <TestComp />
      </div>
    );
  }
}

class Board extends Component {
  constructor() {
    super();
    this.state = { boxes: [], currentPlayer: 'X', winner: '-' };
    this.state.boxes.length = 9;
    this.state.boxes.fill('-');

    this.changer = this.changer.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.checkWinner = this.checkWinner.bind(this);

    linkState(this);
  }

  changePlayer(id) {
    if (this.state.boxes[id] === this.state.currentPlayer) return;
    const newPlayer = { currentPlayer: (this.state.currentPlayer === 'X') ? 'O' : 'X' }
    this.setState(newPlayer);
  }

  // returns winner or '-'
  checkWinner(boxes) {
    // check rows
    for (let r = 0; r < 3; r += 1) {
      if (boxes[r * 3] === boxes[r * 3 + 1] && boxes[r * 3] === boxes[r * 3 + 2]) {
        return (boxes[r * 3] !== '-') ? boxes[r * 3] : '-';
      }
    }
    // check columns
    for (let c = 0; c < 3; c += 1) {
      if (boxes[c] === boxes[c + 3] && boxes[c] === boxes[c + 6]) {
        return (boxes[c] !== '-') ? boxes[c] : '-';
      }
    }

    // check diagonals
    if (boxes[0] === boxes[4] && boxes[0] === boxes[8]) {
      return (boxes[0] !== '-') ? boxes[0] : '-';
    }
    if (boxes[2] === boxes[4] && boxes[2] === boxes[6]) {
      return (boxes[2] !== '-') ? boxes[2] : '-';
    }
    return '-';
  }

  // changes box to the current player
  changer(id) {
    if (this.state.winner !== '-') return;
    const newBoxes = this.state.boxes.slice();
    newBoxes[id] = this.state.currentPlayer;

    if (this.state.boxes[id] === this.state.currentPlayer) return;
    const currentPlayer = (this.state.currentPlayer === 'X') ? 'O' : 'X';
    const winner = this.checkWinner(newBoxes);
    this.setState({ boxes: newBoxes, currentPlayer, winner });
  }

  render() {
    const { winner } = this.state;
    const winDiv = (winner === '-') ? [] : <p>{winner} wins!</p>;
    const rows = [];
    rows[0] = [this.state.boxes[0], this.state.boxes[1], this.state.boxes[2]];
    rows[1] = [this.state.boxes[3], this.state.boxes[4], this.state.boxes[5]];
    rows[2] = [this.state.boxes[6], this.state.boxes[7], this.state.boxes[8]];
    return (
      <div>
        <Row ids={[0, 1, 2]} texts={rows[0]} onClick={this.changer} />
        <Row ids={[3, 4, 5]} texts={rows[1]} onClick={this.changer} />
        <Row ids={[6, 7, 8]} texts={rows[2]} onClick={this.changer} />
        {winDiv}
      </div>
    );
  }
}

class Row extends Component {
  render() {
    return (
      // row 1
      // texts = rows[0] = [-, -, -]
      // texts[0] = '-';
      <div className="Row">
        <Box text={this.props.texts[0]} onClick={() => this.props.onClick(this.props.ids[0])} />
        <Box text={this.props.texts[1]} onClick={() => this.props.onClick(this.props.ids[1])} />
        <Box text={this.props.texts[2]} onClick={() => this.props.onClick(this.props.ids[2])} />
      </div>
    );
  }
}

class Box extends Component {
  render() {
    return (
      <button className='Box' onClick={this.props.onClick}>
        {this.props.text}
      </button>
    );
  }
}

render(<App />, document.getElementById('content'));
