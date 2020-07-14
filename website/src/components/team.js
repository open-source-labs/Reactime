/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import './layout.css';

const styles = {
  reactGreen: 'white', // h4
  // lighterGreen: `#002e2b`,
  lightestGreen: '#62D6FB', // hover, link color
  biosBColor: '#353C44', // `#E4C2B3`, // team bios bg-color #e6e6e6
  redCode: '#62D6FB', // hover, link color
};

const StyledWrapper = styled.div`
  background: radial-gradient(circle, rgba(53,60,68,1) 0%, rgba(0,0,0,1) 100%)
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

const Grid = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`;

const StyledGridElement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  background: ${styles.biosBColor};
  width: 200px;
  height: 100%;
  margin: 10px;
  border-radius: 5px;
  position: relative;
  border: 1px solid rgba(184, 196, 194, 0.25);
  box-shadow: 1px 3px 4px 1px rgba(0, 0, 0, 0.2);
  h4 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 600;
    text-align: center;
    color: ${styles.reactGreen};
  }
  p {
    color: white;
    text-align: justify-left;
    font-family: sans-serif;
    font-size: 12px;
    line-height: 15px;
    margin: 0 8px;
  }
  a[title="Github"] {
    position: relative;
    bottom: 8px;
    padding-top: 10px;
    color: white;
    text-decoration: none;
    font-weight: 300;
  }
  a {
    text-decoration: none;
  }
  /* h4:hover {
    cursor: pointer;
    color: ${styles.lightestGreen};
  } */
  a:hover {
    color: ${styles.redCode};
  }
`;

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      images: allFile {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              sizes(maxWidth: 600) {
                ...GatsbyImageSharpSizes
              }
            }
          }
        }
      }
    }
  `);

  const getImage = personName => {
    const image = data.images.edges.find(n => n.node.name === personName);
    if (!image) return null;
    const imageSizes = image.node.childImageSharp.sizes;
    return (
      <Img
        style={{
          borderRadius: '100px',
          marginTop: '10px',
          width: '100px',
          height: '100px',
        }}
        alt={personName}
        sizes={imageSizes}
      />
    );
  };

  const [bios, setBios] = useState({
    Abaas: false,
    Andy: false,
    Bryan: false,
    Carlos: false,
    Chris: false,
    David: false,
    Edwin: false,
    Ergi: false,
    Gabriela: false,
    JoshuaH: false,
    Josh: false,
    Nat: false,
    Pras: false,
    Rajeeb: false,
    Raymond: false,
    Rocky: false,
    Ruth: false,
    Ryan: false,
    Sierra: false,
    Yujin: false,
  });

  const handleClick = (name, event) => {
    if (!event.target.href) {
      setBios({ ...bios, [name]: !bios[name] });
    }
  };

  return (
    <>
      <StyledWrapper>
        <StyledDiv>
          <StyledMain>
            {children}
            <Grid>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Abaas', e)}
              >
                {getImage('abaas')}
                <h4>Abaas Khorrami</h4>
                {bios.Abaas ? (
                  <div className="content">
                    <p>
                      Abaas is an experienced fullstack developer based in New York who is passionate
                      about React, TypeScript, authentication, and cryptocurrency. He was recently
                      sponsored by SingleSprout to give a talk on concurrent rendering in React. He is
                      a graduate of the University of Virginia.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/dubalol" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  dubalol
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Andy', e)}
              >
                {getImage('andy')}
                <h4>Andy Wong</h4>
                {bios.Andy ? (
                  <div className="content">
                    <p>
                      Andy is an experienced software engineer based in New
                      York. At JPMorgan Chase, he previously specialized in
                      robotics process automation and enterprise cloud software.
                      His interests include running marathons all over the
                      globe, Rube Goldberg Machines, and animals with opposable
                      thumbs. Andy recently gave a talk about WebAssembly and
                      another one about GoLang with Ruth.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/andywongdev" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  andywongdev
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Bryan', e)}
              >
                {getImage('bryan')}
                <h4>Bryan Lee</h4>
                {bios.Bryan ? (
                  <div className="content">
                    <p>
                      Bryan is a passionate software engineer with an interest
                      in data analysis, AI, and machine learning. He builds
                      fullstack applications using React and Node.Js with a
                      focus on scalability and usability. When he's not giving a
                      talk about SQL database management, Bryan listens to John
                      Mayer or plays ping pong in his downtime. He is a CS
                      graduate of Boston College.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/mylee1995" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  mylee1995
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Carlos', e)}
              >
                {getImage('carlos')}
                <h4>Carlos Perez</h4>
                {bios.Carlos ? (
                  <div className="content">
                    <p>
                    Carlos is a full-stack developer with a passion for optimized code and test-driven development. He is experienced in React, Node.js, SQL and NoSQL, and recently gave a sponsored talk on caching techniques in web development. In his free time, he enjoys playing with his dog (Penny), mindfulness meditation, gaming, and outdoors activities.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/crperezt" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  crperezt
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Chris', e)}
              >
                {getImage('chris')}
                <h4>Chris Flannery</h4>
                {bios.Chris ? (
                  <div className="content">
                    <p>
                      Chris is a creative engineer with a passion for chicken
                      parm and ultra-slick UX. He recently gave talks in NYC on
                      webservers vs. serverless and Typescript, and plans on
                      leveraging his deep knowledge of React and Abstract Syntax
                      Trees in interesting new ways later throughout 2020. In
                      his spare (Reac)time, Chris enjoys attending local punk
                      shows and designing logos.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/chriswillsflannery" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  chriswillsflannery
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('David', e)}
              >
                {getImage('david')}
                <h4>David Chai</h4>
                {bios.David ? (
                  <div className="content">
                    <p>
                      David is a multicultural fullstack developer with a
                      passion for React, SQL, and Express. He has an uncanny
                      ability to explain complex topics, simply. He has a ton of
                      love for j-pop, gadgets, and dad jokes (especially as a
                      proud father to his exuberant dog, Ayumi, named after his
                      favorite j-pop singer). Chai recently gave talks about
                      React Fiber under the hood and an introduction to gRPCs.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/davidchai717" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  davidchai717
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Edwin', e)}
              >
                {getImage('edwin')}
                <h4>Edwin Menendez</h4>
                {bios.Edwin ? (
                  <div className="content">
                    <p>
                    Edwin is a driven software engineer from Los Angeles, CA who is passionate about solving real life problems and making a difference in the engineering field. He is passionate about contributing to open source software, continuing to improve software, and has a passion for solving algorithms,. Edwin is experienced in Node.js, Express, React, JavaScript, and Python. Aside from coding, some of Edwin's interests include playing basketball, watching the NBA, Lakers Fan, loves to make people laugh, loves talking about math and physics, and traveling around the world trying to find the best burger place!
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/edwinjmenendez" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  edwinjmenendez
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Ergi', e)}
              >
                {getImage('ergi')}
                <h4>Ergi Shehu</h4>
                {bios.Ergi ? (
                  <div className="content">
                    <p>
                      Ergi is a full stack developer from Brooklyn with a passion for React and client
                      side frameworks. He is experienced in many forms with authentication. He
                      recently gave a talk sponsored by SingleSprout on the differences between Vue
                      and angular. Ergi loves traveling, working out and pizza!
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/Ergi516" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  ergi516
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Gabriela', e)}
              >
                {getImage('gabriela')}
                <h4>Gabriela Aquino</h4>
                {bios.Gabriela ? (
                  <div className="content">
                    <p>
                      Gabriela is an fullstack developer based in Los Angeles.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/aquinojardim" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  {' '}
                  aquinojardim
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Greg', e)}
              >
                {getImage('greg')}
                <h4>Greg Panciera</h4>
                {bios.Greg ? (
                  <div className="content">
                    <p>
                      Greg is a software engineer based in Chicago, with a background in music production and music technology. He’s passionate about the arts and about finding innovative applications for technology. He received his BS in Computer Engineering from the University of Michigan.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/gpanciera" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  gpanciera
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('JoshuaH', e)}
              >
                {getImage('JH')}
                <h4>Joshua Howard</h4>
                {bios.JoshuaH ? (
                  <div className="content">
                    <p>
                      Joshua’s passion lies in creating aesthetically pleasing, highly-engaging user experiences.
                      His background in NYC’s tech startup community gives him a unique perspective
                      on what it takes to bring a product from the idea and design phases to a
                      successful launch. He seamlessly transitions between prototyping platforms
                      like Adobe XD and his favorite development tools, such as React and GraphQL.
                      <br />
                      <br />
                      In his free time, he enjoys savory weekend brunches, talking about SpaceX, and
                      doing spontaneous adventures with friends.
                      <br />
                      <a style={{ fontStyle: 'italic' }} href="http://joshuahoward.tech/" title="Joshua's Website">
                        joshuahoward.tech
                      </a>
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/Joshua-Howard" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  joshua-howard
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Josh', e)}
              >
                {getImage('josh')}
                <h4>Josh Kim</h4>
                {bios.Josh ? (
                  <div className="content">
                    <p>
                      Josh is a product-driven software engineer with incredible
                      passion for solving everyday problems. He takes delight in
                      thinking about user experience when building scalable
                      fullstack applications with React, Redux, and Node and
                      giving talks about wrapping Rest API in GraphQL. Besides
                      coding, he enjoys playing soccer, cooking Korean style
                      bbq, and going on spontaneous road trips.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/joshua0308" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  joshua0308
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Nat', e)}
              >
                {getImage('nat')}
                <h4>Nate Wa Mwenze</h4>
                {bios.Nat ? (
                  <div className="content">
                    <p>
                      Nate is a full stack developer specializing in React and Node. He loves to create interactive and immersive products. He also loves to incorporate web audio in client side applications. He's hosted a tech-talk with Singlesprout Outside of software development he loves drawing, practicing yoga, playing retro 8 bit video games, and traveling to new cities.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/nmwenz90" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  nmwenz90
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Pras', e)}
              >
                {getImage('pras')}
                <h4>Prasanna Malla</h4>
                {bios.Pras ? (
                  <div className="content">
                    <p>
                      Pras is an experienced full stack software engineer
                      passionate about mobile first progressive web apps,
                      specializing in React and Node.js to build scalable and
                      performant applications. His interests include
                      contributing to open-source, tinkering with IoT devices,
                      meditating, nature & hiking. Pras recently gave a talk on
                      future of Frontend in New York.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/prasmalla" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  prasmalla
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Rajeeb', e)}
              >
                {getImage('rajeeb')}
                <h4>Rajeeb Banstola</h4>
                {bios.Rajeeb ? (
                  <div className="content">
                    <p>
                      Rajeeb is an experienced full stack software engineer
                      primarily focused on React, NodeJS with a passion for
                      solving real life problems with scalable and reliable
                      applications. He recently gave a talk on Functional
                      Programming Style and likes to tinker around with
                      Haskell/Elm in his free time. Apart from coding, he likes
                      hiking, cooking and practice mindfulness meditation.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/rajeebthegreat" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  rajeebthegreat
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Raymond', e)}
              >
                {getImage('raymond')}
                <h4>Raymond Kwan</h4>
                {bios.Raymond ? (
                  <div className="content">
                    <p>
                      Raymond is a full-stack engineer based in New York. He is passionate about open
                      source software and the democratizing power of technology. Other interests
                      include exploring mountainous remote border regions, restaurant hopping,
                      sous-vide, learning Chinese, and sharing funny comments discovered in large
                      codebases.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/rkwn" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  rkwn
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Rocky', e)}
              >
                {getImage('rocky')}
                <h4>Rocky Lin</h4>
                {bios.Rocky ? (
                  <div className="content">
                    <p>
                      Rocky is an experienced software engineer based in NY. At
                      CWD, he provided guidance and mentorship to engineers
                      implementing solutions to the core hardware involved in
                      the company’s business model. He’s passionate about React
                      Hooks, concurrent mode, D3, and GraphQL. His interests
                      include basketball, snowboarding, and road trips. He
                      recently gave a talk about WebSockets.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/rocky9413" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  rocky9413
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Ruth', e)}
              >
                {getImage('ruth')}
                <h4>Ruth Anam</h4>
                {bios.Ruth ? (
                  <div className="content">
                    <p>
                      Ruth is a creative developer who loves simplicity in design and scalable,
                      maintainable applications. She’s passionate about intertwining functional
                      programming with JavaScript and modularized backend architecture. In her spare
                      time, she can be found at Boston Celtics games and painting. She’s given talks
                      about Kubernetes and Golang.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/peachiecodes" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  peachiecodes
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Ryan', e)}
              >
                {getImage('ryan')}
                <h4>Ryan Dang</h4>
                {bios.Ryan ? (
                  <div className="content">
                    <p>
                      Ryan is an experienced fullstack developer with an
                      expertise in React and Node. He loves contributing to
                      open-source developer tools, tinkering with minecraft
                      modpacks, and watching Scrubs. But above all else, Ryan
                      adores algorithms, the more complex the better. Ryan
                      recently gave a talk on dependency injection in JS. He is
                      a CS graduate of uMich, Ann Arbor.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/rydang" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  rydang
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Sierra', e)}
              >
                {getImage('sierra')}
                <h4>Sierra Swaby</h4>
                {bios.Sierra ? (
                  <div className="content">
                    <p>
                      Sierra is a fullstack software engineer who enjoys
                      creating amazing, interactive projects. She leverages her
                      ux/ui engineering experience from higher education
                      institutions towards specializing in client-facing
                      applications. In her free time, Sierra gives public talks
                      about Docker & Kubernetes, walks around the Brooklyn
                      Bridge, and can be found traveling and trying new food.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/starkspark" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  starkspark
                </a>
              </StyledGridElement>
              <StyledGridElement
                className="teamStyle"
                onClick={e => handleClick('Yujin', e)}
              >
                {getImage('yujin')}
                <h4>Yujin Kang</h4>
                {bios.Yujin ? (
                  <div className="content">
                    <p>
                      Yujin is a methodical software developer passionate about
                      product design, user experience, utilizing effective
                      project management methods, refactoring code to a few
                      lines, and using the right tools for the job. When she's
                      not coding, Yujin enjoys rollerblading in Domino park,
                      making Korean fusion food, ninja curling, and giving talks
                      on either Angular or system design.
                    </p>
                  </div>
                ) : null}
                <a href="https://github.com/yujinkay" title="Github">
                  <FontAwesomeIcon icon={faGithub} />
                  {' '}
                  yujinkay
                </a>
              </StyledGridElement>
            </Grid>
          </StyledMain>
        </StyledDiv>
      </StyledWrapper>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
