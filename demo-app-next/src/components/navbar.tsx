import Link from 'next/link';

export default function Navbar(): JSX.Element {
  return (
    <div className='nav'>
      <Link className='link' href='/'>
        About
      </Link>
      <Link id='tictactoe' className='link' href='/tictactoe'>
        Tic-Tac-Toe
      </Link>
      <Link className='link' href='/buttons'>
        Counter
      </Link>
    </div>
  );
}
