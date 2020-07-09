/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { render } from 'react-dom';
import linkFiberStart from '../linkFiber';
import 'expect-puppeteer';
import 'puppeteer';

// const SERVER = require('puppeteerServer');

const APP = 'http://localhost:3002';

let linkFiber;
let mode;
let snapShot;

let browser;
let page;

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

describe('unit test for linkFiber', () => {
  beforeAll(async () => {
    await SERVER;
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox',
        '--whitelisted-extension-id=fmkadmapgofadopljbjfkapdkoienihi',
        '--whitelisted-extension-id=hilpbahfbckghckaiafiiinjkeagmfhn'],
      // '--load-extension', '../../src/extension/build'],
      headless: false,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await SERVER.close();

    await browser.close();
  });


  beforeEach(() => {
    snapShot = { tree: null };
    mode = {
      jumping: false,
      paused: false,
      locked: false,
    };
    linkFiber = linkFiberStart(snapShot, mode);

    page.waitForFunction(async linkFiber => {
      const container = document.createElement('div');
      render(<App />, container);
      linkFiber(container);
    }, {}, linkFiber);
  });

  test('linkFiber should mutate the snapshot tree property', () => {
    // linkFiber mutates the snapshot

    expect(typeof snapShot.tree).toBe('object');
    //expect(snapShot.tree.component.state).toBe('root');
    expect(snapShot.tree.state).toBe('root');
    expect(snapShot.tree.children).toHaveLength(1);
    expect(snapShot.tree.children[0].component.state.foo).toBe('bar');
  });

  test('linkFiber should modify the setState of the stateful component', () => {
    expect(snapShot.tree.children[0].component.setState.linkFiberChanged).toBe(true);
  });
});
