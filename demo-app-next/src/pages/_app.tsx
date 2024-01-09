import '../../styles/style.css';
import React from 'react';

export default function MyApp({ Component, pageProps }): JSX.Element {
  return <Component {...pageProps} />;
}
