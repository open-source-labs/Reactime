/* eslint-disable react/jsx-filename-extension */
import React, { Component, useState } from 'react';
import { render } from 'react-dom';

const linkFiberRequire = require('../linkFiber');

let linkFiber;
let mode;
let snapShot;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { foo: 'bar' };
  }

  render() {
    const { foo } = this.state;
    return <div>{foo}</div>;
  }
}

// Need to create a functioanl component instance to test 
// Would need to be revised but here's the gist
// const funcComponent = () => {
//     const [ number, setNumber ] = useState(0); 
//     const newNumber = setNumber(1); 
    
//     return (
//       <div>{newNumber}</div>
//     )
// }

describe('unit test for linkFiber', () => {
  beforeEach(() => {
    snapShot = { tree: null };
    mode = {
      jumping: false,
      paused: false,
      locked: false,
    };
    linkFiber = linkFiberRequire(snapShot, mode);

    const container = document.createElement('div');
    render(<App />, container);
    linkFiber(container);
  });

  test('linkFiber should mutate the snapshot tree property', () => {
    // linkFiber mutates the snapshot
    expect(typeof snapShot.tree).toBe('object');
    expect(snapShot.tree.component.state).toBe('root');
    expect(snapShot.tree.children).toHaveLength(1);
    expect(snapShot.tree.children[0].component.state.foo).toBe('bar');
  });

  test('linkFiber should modify the setState of the stateful component', () => {
    expect(snapShot.tree.children[0].component.setState.linkFiberChanged).toBe(true);
  });
});
