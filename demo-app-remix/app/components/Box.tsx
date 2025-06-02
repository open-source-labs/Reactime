import type { BoardText } from '../types/types';

type BoxProps = {
  value: BoardText;
  row: number;
  column: number;
  handleBoxClick: (row: number, column: number) => void;
};

const Box = (props: BoxProps) => {
  return (
    <button className='box' onClick={(e) => props.handleBoxClick(props.row, props.column)}>
      {props.value}
    </button>
  );
};

export default Box;
