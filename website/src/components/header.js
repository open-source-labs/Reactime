import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import styled from "styled-components"
import GitHubButton from "react-github-btn"
import { config } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChrome,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"
config.autoAddCss = false

const styles = {
  // headerBColor: //`#487783`,
  headFontColor: `white`, // #BDD4DB
}

const HeaderContainer = styled.header`
  position: fixed;
  width: 100%;
  height: 30px;
  padding: 50px;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(298deg, rgba(46,52,58,1) 0%, rgba(0,0,0,1) 100%);



  transition: 0.2s;
  @media (max-width: 600px) {
    justify-content: center;
    flex-direction: column;
  }
`

const HeaderTitle = styled.div`
  @media (max-width: 375px) {
    h1 {
      font-size: 1.1rem;
    }
  }
`

const HeaderRight = styled.div`
  ul {
    list-style-type: none;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0;
    display: inline-block;
    padding-left: 15px;
  }
  ul li a {
    color: ${styles.headFontColor};
    text-decoration: none;
    font-size: 15px;
    font-family: sans-serif;
  }
  ul li a:hover {
    color: white;
  }
  @media (max-width: 600px) {
    // padding-top: 20px;
  }
`
const H1 = styled.h1`
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  margin: 0;
  font-weight: 400;
`

// class Header extends React.Component {
const Header = props => {
  const handleScroll = () => {
    if (
      window.innerWidth < 600 &&
      (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)
    ) {
      document.getElementById("header").style.padding = "50px"
    } else if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("header").style.padding = "30px"
    } else {
      document.getElementById("header").style.padding = "50px"
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll())
    return window.removeEventListener("scroll", () => handleScroll())
  }, [])

  // componentDidMount() {
  //   window.addEventListener("scroll", this.handleScroll)
  // }
  // componetWillUnmount() {
  //   window.removeEventListener("scroll", this.handleScroll)
  // }

  // render() {
  return (
    <HeaderContainer id="header">
      <HeaderTitle>
        <H1>
          <Link
            to="/"
            style={{
              color: styles.headFontColor,
              textDecoration: `none`,
            }}
          >
            {props.siteTitle}
          </Link>
        </H1>
      </HeaderTitle>
      <HeaderRight>
        <ul>
          <li style={{ marginBottom: `2px` }}>
            <a
              href="https://www.npmjs.com/package/reactime"
              title="ReacTime NPM Package"
            >
              npm
            </a>
          </li>
          <li>
            <a
              href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga?hl=en-US"
              title="ReacTime Chrome"
            >
              <FontAwesomeIcon icon={faChrome} />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/reactime" title="ReacTime Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/company/reactime"
              title="ReacTime LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </li>
          <li style={{ marginTop: `7px` }}>
            <GitHubButton
              href="https://github.com/open-source-labs/reactime"
              data-color-scheme="dark"
              data-size="medium"
              data-show-count="true"
              aria-label="Star open-source-labs/reactime on GitHub"
            >
              Star
            </GitHubButton>
          </li>
        </ul>
      </HeaderRight>
    </HeaderContainer>
  )
}
// }

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
