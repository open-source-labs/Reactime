/* eslint-disable react/jsx-filename-extension */
import React from 'react';

const Footer = () => (
  <footer style={{ marginTop: '2rem', color: 'white' }}>
      ©
    {' '}
    {new Date().getFullYear()}
    , Built with
    {' '}
    <a
      style={{ textDecoration: 'none', color: '#99A93A' }}
      href="https://www.gatsbyjs.org"
    >
Gatsby
    </a>
  </footer>
);

export default Footer;
