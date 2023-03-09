//! Next has Typescript + ESLint integration and Fast Refresh built in

//! JS and CSS files are auto-minified for production

//! Code splitting - Each file inside the REQUIRED pages folder will automatically code split into its own javascript bundle during build step
//! Any code shared between pages is also split into another bundle to avoid re-downloading the same code on further navigation.

//! When building application, Next transform s code into production-optimized files, such as HTML files for statically generated pages, JS for rendering pages on the server/interactivity, and CSS files

//! Rather than client side rendering (browser receives an empty HTML shell from the server along with the JavaScript instructions to construct the UI), Next pre-renders every page by default (HTML is generated in advance, on a server, instead of having it all done by JavaScript on the user's device.)

//! Depending on which type of page you want to create, you can use Static Site generation (getStaticProps), Server-side rendering, or Client-side rendering
//* Which type of render to use: https://nextjs.org/docs/basic-features/data-fetching/overview
import { useState } from 'react';
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

// This helps Next distinguish which component to render as the main component of this page
export default function HomePage() {
  const names = ['Lance Ziegler', 'Peter Lam', 'Ngok Zwolinski', 'Zack Freeman'];

  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <Header title='Reactime Team' />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}
