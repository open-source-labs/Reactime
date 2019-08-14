/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from 'react-dom';

const linkFiberRequire = require('../linkFiber');

let linkFiber;
let mode;
let snapShot;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { foo: 'bar' };
  }

  render() {
    const { foo } = this.state;
    return <div>{foo}</div>;
  }
}

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
