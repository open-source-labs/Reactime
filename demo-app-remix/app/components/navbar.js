import { Link } from '@remix-run/react';

export default function Navbar() {
  return (
    <div className='nav'>
      <Link className='link' to='/'>
        About
      </Link>
      <Link id='tictactoe' className='link' to='/tictactoe'>
        Tic-Tac-Toe
      </Link>
      <Link className='link' to='/buttons'>
        Counter
      </Link>
    </div>
  );
}
