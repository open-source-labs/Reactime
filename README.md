<p align="center">
  <img src ="./assets/readme-logo-300.png" width="300"/>
</p>

<h1 align="center"><b>State Debugger for React</b></h1>

[![GitHub](https://img.shields.io/github/license/oslabs-beta/reactime)](https://github.com/oslabs-beta/reactime) [![Build Status](https://travis-ci.com/oslabs-beta/reactime.svg?branch=master)](https://travis-ci.com/oslabs-beta/reactime) [![npm version](https://badge.fury.io/js/reactime.svg)](http://badge.fury.io/js/reactime) [![Dependencies](https://david-dm.org/oslabs-beta/reactime.svg)](https://david-dm.org/oslabs-beta/reactime#info=dependencies) [![DevDependencies](https://david-dm.org/oslabs-beta/reactime/dev-status.svg)](https://david-dm.org/oslabs-beta/reactime?type=dev) [![Vulnerabilities](https://snyk.io/test/github/oslabs-beta/reactime/badge.svg)](https://snyk.io/test/github/oslabs-beta/reactime)![BabelPresetPrefs](https://img.shields.io/badge/babel%20preset-airbnb-ff69b4)![LintPrefs](https://img.shields.io/badge/linted%20with-eslint-blueviolet)

![demo](./assets/recoil-demo.gif) &nbsp;&nbsp;
![demo](./assets/hooks-demo.gif)

👑   Nominated for the Productivity Booster award at [React Open Source Awards 2020](https://osawards.com/react/)! 👑  


<b>Reactime</b> is a debugging tool for React developers. It records a snapshot whenever a target application's state is changed and allows the user to jump to any previously recorded state.

Currently, Reactime supports React apps using stateful components and Hooks, with beta support for Recoil and Context API.

Reactime 5.0 beta extends the core functionality by including support for [Recoil](https://recoiljs.org/). The latest release incorporates additional visualizations for component relationships as well as atom-selector relationships for Recoil applications. Reactime 5.0 includes expanded [typedoc](https://typedoc.org/api/) documentation for developers looking to contribute to the source code. 

After installing Reactime, you can test its functionalities with the following demo repositories:

- [Vanilla React Calculator](https://joshua0308.github.io/calculator/)
- [Bitcoin Price Index](http://reactime-demo2.us-east-1.elasticbeanstalk.com)
- [Recoil Design Tool](https://github.com/jacques-blom/recoil-design-tool)
- [Recoil Todo List](https://github.com/kevinfey/recoilTest)

## <b>Installation</b>

To get started, install the Reactime [extension](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) from Chrome Web Store. 

### Alternative Installation
Use `src/extension/build/build.zip` for manual installation in [Developer mode](https://developer.chrome.com/extensions/faq#faq-dev-01). Turn on 'Allow access to file URLs' in extension details page if testing locally.

*** for depracated installation steps, [click here](https://github.com/open-source-labs/reactime/blob/master/readme-OldVersion.md) ***

## <b>How to Use</b>

After installing the Chrome extension, just open up your project in the browser.

Then open up your Chrome DevTools and navigate to the Reactime panel.

## <b>Features</b>

### Recording

Whenever state is changed (whenever setState, useState, or useRecoilState is called), this extension will create a snapshot of the current state tree and record it. Each snapshot will be displayed in Chrome DevTools under the Reactime panel.

### Viewing

You can click on a snapshot to view your app's state. State can be visualized in a Component Graph, JSON Tree, or Performance Graph. In a Recoil application, flow of data from atoms to components is visualized in the Relationships tab. Also, snapshots can be diffed with the previous snapshot, which can be viewed in Diff mode.

### Jumping

Using the actions sidebar, a user can jump to any previous recorded snapshots. Hitting the jump button on any snapshot will allow a user to view state data at any point in the history of the target application.

### TypeScript Support

Reactime offers beta support for TypeScript applications using stateful class components and functional components.  Further testing and development is required for custom hooks, Context API, and Concurrent Mode.

### Documentation

After cloning this repository, developers can simply run `npm run docs` at the root level and serve the dynamically generated `/docs/index.html` file on a browser. Doing so will provide a readable, extensible, and interactive GUI view of the structure and interfaces of the codebase.

### Additional Features

- hover functionality to view tooltip details on state visualizations
- ability to pan and zoom on state visualizations
- a dropdown to support development of projects on multiple tabs
- a slider to move through snapshots quickly
- a play button to move through snapshots automatically
- a pause button, which stops recording each snapshot
- a lock button to freeze the DOM in place. setState will lose all functionality while the extension is locked
- a persist button to keep snapshots upon refresh (handy when changing code and debugging)
- export/import the current snapshots in memory
- declarative titles in the actions sidebar

## <b>Authors</b>
- **Haejin Jo** - [@haejinjo](https://github.com/haejinjo)
- **Hien Nguyen** - [@hienqn](https://github.com/hienqn)
- **Jack Crish** - [@JackC27](https://github.com/JackC27)
- **Kevin Fey** - [@kevinfey](https://github.com/kevinfey)
- **Carlos Perez** - [@crperezt](https://github.com/crperezt)
- **Edwin Menendez** - [@edwinjmenendez](https://github.com/edwinjmenendez)
- **Gabriela Jardim Aquino** - [@aquinojardim](https://github.com/aquinojardim)
- **Greg Panciera** - [@gpanciera](https://github.com/gpanciera)
- **Nathanael Wa Mwenze** - [@nmwenz90](https://github.com/nmwenz90)
- **Ryan Dang** - [@rydang](https://github.com/rydang)
- **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
- **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
- **Sierra Swaby** - [@starkspark](https://github.com/starkspark)
- **Ruth Anam** - [@peachiecodes](https://github.com/peachiecodes)
- **David Chai** - [@davidchaidev](https://github.com/davidchai717)
- **Yujin Kang** - [@yujinkay](https://github.com/yujinkay)
- **Andy Wong** - [@andywongdev](https://github.com/andywongdev)
- **Chris Flannery** - [@chriswillsflannery](https://github.com/chriswillsflannery)
- **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat)
- **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla)
- **Rocky Lin** - [@rocky9413](https://github.com/rocky9413)
- **Abaas Khorrami** - [@dubalol](https://github.com/dubalol)
- **Ergi Shehu** - [@Ergi516](https://github.com/ergi516)
- **Raymond Kwan** - [@rkwn](https://github.com/rkwn)
- **Joshua Howard** - [@Joshua-Howard](https://github.com/joshua-howard)

## <b>License </b>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

