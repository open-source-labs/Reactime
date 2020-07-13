/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-filename-extension */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { useStaticQuery, graphql } from "gatsby"
import styled from 'styled-components';

import './layout.css';

const styles = {
  reactGreen: '#072D2B',
  lighterGreen: '#002e2b',
  lightestGreen: '#0c4c41',
  reactGold: '#ECCB98',
  lighterGold: '#E4C2B3',
  redCode: '#99A93A',
  blueCode: '#6188B4',
  white: '#fff',
};

const StyledWrapper = styled.div`
  background: radial-gradient(circle, rgba(53,60,68,1) 0%, rgba(0,0,0,1) 100%);
`;

const StyledDiv = styled.div`
  margin: 0 auto;
  max-width: 1024px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`;

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledOL = styled.ol`
  font-family: "Raleway", sans-serif;
  color: #BDD4DB;
  @media (max-width: 700px) {
    max-width: 600px;
    padding: 0 40px;
    width: 100%;
  }
`;
const StyledPre = styled.pre`
  border-radius: 3px;
  border: 1px solid rgba(184, 196, 194, 0.25);
  box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.15);
  background: #1E1E1E;
  color: white;
`;

const Layout = ({ children }) => (
  <>
    <StyledWrapper>
      <StyledDiv>
        <StyledMain>
          {children}
          <StyledOL>
            <li>Download the extension from Chrome's Web Store.</li>
            <li>
                Install the npm package into your terminal/code editor inside of
                your application folder.
              {' '}
              <br />
              <StyledPre>
                <code>
                  <p>
                      npm i
                    {' '}
                    <span style={{ color: styles.redCode }}>reactime</span>
                  </p>
                </code>
              </StyledPre>
            </li>
            <li>
                Call the library method on your root container after rendering
                your App.
              <br />
              <StyledPre>
                <code>
                  {/* <!-- react treats app /> as a react components and tries to render it --> */}
                  <p>
                      import
                    {' '}
                    <span style={{ color: styles.redCode }}>reactime</span>
                    {' '}
                      from 'reactime';
                    {' '}
                    <br />
                      const rootContainer = document.getElementById('root');
                    {' '}
                    <br />
                      ReactDOM.
                    <span style={{ color: styles.blueCode }}>render</span>
(
                    {'<App />'}
, rootContainer);
                    <br />
                    <span style={{ color: styles.redCode }}>reactime</span>
                      (rootContainer);
                  </p>
                </code>
              </StyledPre>
                If you are using Concurrent Mode, call the library like below:
              <br />
              <StyledPre>
                <code>
                  {/* <!-- react treats app /> as a react components and tries to render it --> */}
                  <p>
                      import
                    {' '}
                    <span style={{ color: styles.redCode }}>reactime</span>
                    {' '}
                      from 'reactime';
                    {' '}
                    <br />
                      const rootContainer = ReactDOM.
                    <span style={{ color: styles.blueCode }}>createRoot</span>
                      (document.getElementById('root'));
                    <br />
                      rootContainer.render(
                    {'<App />'}
);
                    <br />
                    <span style={{ color: styles.redCode }}>reactime</span>
                      (rootContainer);
                  </p>
                </code>
              </StyledPre>
            </li>
          </StyledOL>
        </StyledMain>
      </StyledDiv>
    </StyledWrapper>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
