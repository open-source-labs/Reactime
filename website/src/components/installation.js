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
import styled from 'styled-components';
import OlderVersion from './olderVersion';

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
            <StyledPre>
              <code>
                <p>
                    Download
                  {' '}
                  <span style={{ color: styles.redCode }}>Reactime</span>
                  {' '}
extension from Chrome's Web Store.
                  {' '}
                </p>
                <p>
                    And that's it!
                  {' '}
                  <span style={{ color: styles.redCode }}>No NPM package needed!!!</span>
                </p>
                <p>
                  <span style={{ color: styles.blueCode }}>
***
                    {' '}
New perfomance features are not avalible on Redux applications
                    {' '}
***
                  </span>
                </p>
              </code>
            </StyledPre>
            <code>
              <OlderVersion />
            </code>
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
