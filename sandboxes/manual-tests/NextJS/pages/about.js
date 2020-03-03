import Link from 'next/link';
import Sandboxes from '../Frontend/app';

export default function About() {
  return (
    <div>
      <Link href="/">
        <a className="ml-5" title="Index Page">
          Index Page
        </a>
      </Link>
      <Link href="/about">
        <a className="ml-5" title="About Page">
          About Page
        </a>
      </Link>
      <Link href="/last">
        <a className="ml-5" title="Last Page">
          Last Page
        </a>
      </Link>
      <p className="ml-5">This is the second Next.js Page</p>
      <Sandboxes />
    </div>
  );
}
