import React, { Component, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';

// importing our package entry point
const reactime = require('../index');
// Integration test
  // mocks
    // dummy react components and stuff

// Test topmost React component, which renders a Stateful component
const MockApp = () => {
  return (
    <div id="app">
      <Stateful />
      {/* <Hook /> */}
    </div>
  )
}

// Test Stateful component contains a mock state. It also renders two child components - ChildStateful and Hook (temporarily disabled)
class Stateful extends Component {
  constructor () {
    super();
    this.state = {
      number: 0,
    };
  }
  render() {
    return (<div id="stateful">
      <ChildStateful />
      {this.state.number}
      {/* <Hook/> */}
    </div>)
  }
}

class ChildStateful extends Component {
  constructor () {
    super();
    this.state = {
      foo: 'bar',
    };
  }
  render() {
    return (<div id="child-stateful">
      {this.state.foo}
    </div>)
  }
}


const Hook = () => {
  const [letter, addLetter] = useState('a');
  return (
    <div id="hook">
      {letter}
    </div>
  )
}

describe('NPM Package integration test', () => {
  // Storage for all the snapshots
  let snaps = [],
  // variable to be used to be fiber tree location of the test Stateful component 
  stateful, 
  // same but for ChildStateful
  childstateful,
  // for Hook (not currently in use)
  hook;

  describe('Link fiber', () => {
    beforeAll((done) => {
      // Listening for snapshots from linkFiber
      window.addEventListener('message', msg => {
        const { action } = msg.data;
        switch (action) {
          case 'recordSnap':
            snaps.push(msg.data.payload);
            // Once received, this part is done
            done();
            break;
          default:
            break;
        }
      })
      
      // Create the DOM node for our root div
      const testDiv = document.createElement('div');
      // Inject
      ReactDOM.render(<MockApp />, testDiv);
      // Run the root div through reactime (imported earlier)
      reactime(testDiv);

      // Assigning the locations of the test components on the fiber tree to variables
      stateful = testDiv._reactRootContainer._internalRoot.current.child.child.child;
      childstateful = stateful.child.child;

      // Make linkFiber send the first processed screenshot
      window.postMessage({ action: 'contentScriptStarted' }, '*');
    })

    test ('should send the snapshot via message', () => {
      console.log('snaps arr', snaps);
      expect(snaps.length).toBeGreaterThanOrEqual(1);
    })

    test ('Should be able to retract the state from stateful components', () => {
      console.log('state of the first component', JSON.stringify(snaps[0].children[0].state));
      // Check if the tree returned by the first snapshot (snaps[0]) contains the correct states
      expect(JSON.stringify(snaps[0].children[0].state)).toBe(JSON.stringify(stateful.memoizedState));
      expect(JSON.stringify(snaps[0].children[0].children[0].state)).toBe(JSON.stringify(childstateful.memoizedState));
    });

    xtest ('Should be able to retract the state from hook components', () => {
  
    })

    xtest ('Should be able to detect when an user uses setState', () => {

    });
  })
  describe('Time jump', () => {
    xtest('Should be able to perform time jump for stateful components', () => {
      window.postMessage()
    })
    xtest('App should reflect the desired state snapshot after jumping', () => {
      
    })
  })
})
  // Upon invoking reactime on the root container, the app should
    // should send the snapshot via message
    // Should modify setState if the component is stateful
    // Should modify useState if the component uses hooks
    // Should not invoke changeUseState if component doesn't use hooks
  // Upon receiving a request to time jump, the app should
    // invoke timejump function
    // mode.jumping should be switched to true while jumping
    // setState should not be modified while jumping
    // useState should not be modified while jumping
    // the app should reflect the desired state snapshot after jumping
    // mode.jumping should be switched back to false after jumping