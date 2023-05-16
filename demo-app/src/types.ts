export type Scoreboard = {
  X: number;
  O: number;
};

export type Player = 'X' | 'O';

export type BoardText = 'X' | 'O' | '-';

export type BoardContent = Array<Array<BoardText>>;

//will move scoreboard and player into Board.tsx as these two types are only being used there
//wont make a difference but this is for cleanliness sake