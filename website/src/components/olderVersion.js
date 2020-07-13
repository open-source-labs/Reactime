/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import InstallationOlder from './installationOlder';
import VisualStateOlder from './visualStateOlder';
import demogifold from '../images/demo.gif';

const styles = {
  reactGreen: '#487783',
  redCode: '#99A93A',
};

const OlderVersion = () => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  };
  return (
    <>
      {clicked ? (
        <>
          <button onClick={() => handleClick()}>
          Hide older version documenation
          </button>
          <InstallationOlder>
            <h2 style={{ color: styles.reactGreen }}>
              <strong>Simple Installation</strong>
            </h2>
            <h6>
              <a
                style={{ textDecoration: 'none', color: styles.redCode }}
                href="https://www.youtube.com/watch?v=lmG1X7Kf6zo&t="
              >
          Youtube Tutorial
              </a>
            </h6>
          </InstallationOlder>
          <VisualStateOlder>
            <h2 style={{ textAlign: 'center' }}>
              <strong>STATE:</strong>
              {' '}
      Track, Revert, Visualize
            </h2>
            <img src={demogifold} alt="ReacTime Demo" />
          </VisualStateOlder>
        </>
      ) : (
        <button onClick={() => handleClick()}> Show older version documenation </button>
      )}
    </>
  );
};

export default OlderVersion;
