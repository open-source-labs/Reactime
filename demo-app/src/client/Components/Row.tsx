import React from 'react';
import Box from './Box';
import { BoardText } from '../../types';

type RowProps = {
  handleBoxClick: (row: number, column: number) => void;
  values: Array<BoardText>;
  row: number;
};

const Row = (props: RowProps) => {
  const boxes: Array<JSX.Element> = [];
  for (let i = 0; i < 3; i++) {
    boxes.push(
      <Box
        key={i}
        row={props.row}
        column={i}
        handleBoxClick={props.handleBoxClick}
        value={props.values[i]}
      ></Box>,
    );
  }

  return <div className='row'>{boxes}</div>;
};

export default Row;
