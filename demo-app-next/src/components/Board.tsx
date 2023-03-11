import React, { Component } from "react";
import Row from "./Row";
import { BoardText, BoardContent, Scoreboard, Player } from "../types/types";

type BoardState = {
  board: BoardContent;
  currentPlayer: Player;
  gameOver: boolean;
  message: string;
  scoreboard: Scoreboard;
};

class Board extends Component<{}, BoardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      board: this.newBoard(),
      currentPlayer: "X",
      gameOver: false,
      message: "",
      scoreboard: { X: 0, O: 0 },
    };

    this.resetBoard = this.resetBoard.bind(this);
    this.handleBoxClick = this.handleBoxClick.bind(this);
  }

  componentDidUpdate() {
    this.checkForWinner();
  }

  /**
   * @method newBoard
   * @description - returns a blank BoardContent array,
   *  for the start of a new game
   */
  newBoard(): BoardContent {
    return [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
  }

  /**
   * @method resetBoard
   * @description - sets to board object to be all '-',
   *  and sets gameOver and message to default state
   */
  resetBoard(): void {
    this.setState({
      gameOver: false,
      board: this.newBoard(),
      message: "",
    });
  }

  /**
   * @method checkForWinner
   * @description - checks to see if either player has filled a row
   *  if so, ends the game and updates the message to declare winner
   */
  checkForWinner(): void {
    const { board, gameOver, currentPlayer } = this.state;

    const spacesLeft = (): boolean => {
      for (let i of board) {
        if (i.includes("-")) return true;
      }
      return false;
    };

    if (!gameOver) {
      // win conditions: matching rows, columns, or diagonals, that are not empty('-')
      if (
        (board[0][0] === board[0][1] &&
          board[0][1] === board[0][2] &&
          board[0][2] !== "-") ||
        (board[1][0] === board[1][1] &&
          board[1][1] === board[1][2] &&
          board[1][2] !== "-") ||
        (board[2][0] === board[2][1] &&
          board[2][1] === board[2][2] &&
          board[2][2] !== "-") ||
        (board[0][0] === board[1][0] &&
          board[1][0] === board[2][0] &&
          board[2][0] !== "-") ||
        (board[0][1] === board[1][1] &&
          board[1][1] === board[2][1] &&
          board[2][1] !== "-") ||
        (board[0][2] === board[1][2] &&
          board[1][2] === board[2][2] &&
          board[2][2] !== "-") ||
        (board[0][0] === board[1][1] &&
          board[1][1] === board[2][2] &&
          board[2][2] !== "-") ||
        (board[2][0] === board[1][1] &&
          board[1][1] === board[0][2] &&
          board[0][2] !== "-")
      ) {
        // winner is the person who's turn was previous
        const winner: Player = currentPlayer === "X" ? "O" : "X";

        this.setState({
          gameOver: true,
          message: `Player ${winner} wins!`,
        });

        // draw condition: no '-' remaining in board without above win condition triggering
      } else if (!spacesLeft()) {
        this.setState({
          gameOver: true,
          message: "Draw!",
        });
      }
    }
  }

  handleBoxClick(row: number, column: number): void {
    const boardCopy: BoardContent = [
      [...this.state.board[0]],
      [...this.state.board[1]],
      [...this.state.board[2]],
    ];
    boardCopy[row][column] = this.state.currentPlayer;
    const newPlayer: Player = this.state.currentPlayer === "X" ? "O" : "X";
    this.setState({ board: boardCopy, currentPlayer: newPlayer });
  }

  render() {
    const rows: Array<JSX.Element> = [];
    for (let i = 0; i < 3; i++) {
      rows.push(
        <Row
          key={i}
          row={i}
          handleBoxClick={this.handleBoxClick}
          values={this.state.board[i]}
        />
      );
    }
    const { X, O }: Scoreboard = this.state.scoreboard;

    return (
      <div className="board">
        <h1>Tic Tac Toe</h1>
        {this.state.gameOver && <h4>{this.state.message}</h4>}
        {rows}
        <button id="reset" onClick={this.resetBoard}>
          Reset
        </button>
      </div>
    );
  }
}

export default Board;
