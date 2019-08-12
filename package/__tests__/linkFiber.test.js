/* eslint-disable import/no-extraneous-dependencies */
// const Tree = require('./tree');
import React from 'react';
import { render } from 'react-dom';

const linkFiberRequire = require('../linkFiber');

let linkFiber;
let mode;
let snapShot;
let component;

describe('unit test for linkFiber', () => {
  beforeEach(() => {
    snapShot = { tree: null };
    mode = {
      jumping: false,
      paused: false,
      locked: false,
    };
    linkFiber = linkFiberRequire(snapShot, mode);

    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = { foo: 'bar' };
      }

      render() {
        return <div>{this.state.foo}</div>;
      }
    }

    const container = document.createElement('div');
    render(<App />, container);
    linkFiber(container);
    // eslint-disable-next-line prefer-destructuring
    component = snapShot.tree.children[0].component;
  });

  test('linkFiber should mutate the snapshot tree property', () => {
    // linkFiber mutates the snapshot
    expect(typeof snapShot.tree).toBe('object');
    expect(snapShot.tree.component.state).toBe('root');
    expect(snapShot.tree.children).toHaveLength(1);
    expect(snapShot.tree.children[0].component.state.foo).toBe('bar');
  });

  test('linkFiber should modify the setState of the stateful component', () => {
    expect(snapShot.tree.children[0].component.setState.name).toBe('newSetState');
  });

  // test('newSetState should still setState correctly', () => {
  //   component.setState({ foo: 'barf' });
  //   expect(component.state).not.toEqual({ foo: 'bar' });
  //   expect(component.state).toEqual({ foo: 'barf' });
  // });
});
