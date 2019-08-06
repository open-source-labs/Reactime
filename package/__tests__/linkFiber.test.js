// const Tree = require('./tree');
let linkFiber;
let ReactDOM;
let React;
let mode;
let snapShot;

describe('unit test for linkFiber', () => {
  beforeEach(() => {
    snapShot = { tree: null };
    mode = {
      jumping: false,
      paused: false,
      locked: false,
    };
    React = require('react');
    ReactDOM = require('react-dom');
    linkFiber = require('../linkFiber')(snapShot, mode);

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
    ReactDOM.render(<App />, container);
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
    console.log(snapShot.tree.children[0].component.setState);
    // snapShot.tree.children[0].component.setState({ foo: 'josh' });
    // expect(snapShot.tree.children[0].component.setState).toBeInstanceOf(newSetState);
    // expect(snapShot.tree.children[0].component.state.foo).toBe('josh');
  });
});
