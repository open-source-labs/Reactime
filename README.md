<h1 align="center">
  <br>
    <img src ="./assets/readme-logo-300-no-version.png" width="300"/>
    <br>
    <br>
  React Performance Tool
    <br>
    <a href="https://osawards.com/react/"> Nominated for React Open Source Awards 2020 </a>
  <br>
</h1>

<h4 align="center"> Reactime is an open source Chrome developer tool for time travel debugging and performance monitoring in React applications. Reactime enables developers to record snapshots of application state, jump between and inspect state snapshots, and monitor performance metrics such as component render time and render frequency. </h4>

<br>
<p align="center">
  <a href="https://github.com/oslabs-beta/reactime">
    <img src="https://img.shields.io/github/license/oslabs-beta/reactime" alt="GitHub">
  </a>
  <a href="https://travis-ci.com/oslabs-beta/reactime">
    <img src="https://travis-ci.com/oslabs-beta/reactime.svg?branch=master" alt="Build Status">
  </a>  
  <a href="http://badge.fury.io/js/reactime">
    <img src="https://badge.fury.io/js/reactime.svg" alt="npm version">
  </a>  
    <img src="https://img.shields.io/badge/babel%20preset-airbnb-ff69b4" alt="BabelPresetPrefs">
    <img src="https://img.shields.io/badge/linted%20with-eslint-blueviolet" alt="LintPrefs">
</p>

<!-- [![GitHub](https://img.shields.io/github/license/oslabs-beta/reactime)](https://github.com/oslabs-beta/reactime) [![Build Status](https://travis-ci.com/oslabs-beta/reactime.svg?branch=master)](https://travis-ci.com/oslabs-beta/reactime) [![npm version](https://badge.fury.io/js/reactime.svg)](http://badge.fury.io/js/reactime) ![BabelPresetPrefs](https://img.shields.io/badge/babel%20preset-airbnb-ff69b4) ![LintPrefs](https://img.shields.io/badge/linted%20with-eslint-blueviolet) -->

<h5 align="center">
<br>
  <a href="./README.rus.md">🇷🇺  &nbsp; РУССКАЯ ВЕРСИЯ</a> &nbsp; • &nbsp;  <a href="./README.fr.md">🇫🇷  &nbsp; VERSION FRANÇAISE</a>
  <br>
</h5>
<br>

<p align="center">
<img src="./assets/new-reactime.gif" />
</p>

<p align="center">
  <a href="#how-to-use">How To Use</a> • <a href="#features">Features</a> • <a href="https://reactime.io">Website</a> • <a href="#read-more">Read More</a>
</p>

<b>Reactime 15.0</b> adds a new visualization, allowing users to zone in on individual components of a specific snapshot. Additionally, a number of bug fixes have been implemented.

Currently, Reactime supports React apps (now including React Router apps) using stateful components and Hooks, with beta support for Recoil and Context API and frameworks like Gatsby and Next.js.

Previously, <b>Reactime 14.0</b> added the exciting features below:

**I. React Router Compatibility** <br>
Reactime is now compatible with React Router applications! Prior to Reactime 14.0, recording state snapshots as the user navigated across various routes was possible, but time travel debugging was only possible for the current route (i.e. jumping back to a prior state at a different route was not possible). In order to streamline debugging of applications with multiple routes, Reactime 14.0 added functionality that allows the user to time-travel back to different routes, including live updating in the browser to reflect the state of their application at that previously visited route.

**II. Classifying State Snapshots by Route** <br>
The list of state snapshots in the Reactime dashboard is now classified by route to give the developer visual cues of the snapshot-route relationship and make time travel debugging of various routes easier.

**III. Filtering Performance Metrics by Route** <br>
The Reactime dashboard includes a stacked bar graph showing render times for each component, with a separate bar stack for each snapshot. With Reactime 14.0, this composite bar graph can now be filtered by route to allow the developer to review detailed performance data by route.

After installing Reactime, you can test its functionalities with your React application in development mode.

Please note, the time jumping feature will <b>ONLY</b> work when your application is running in <b>development mode</b>. In production mode, you are able to view your application’s component map but no additional features.

## <b>Installation</b>

To get started, install the Reactime [extension](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) from Chrome Web Store.

NOTE: The React Developer Tools [extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) is also required for Reactime to run, if you do not already have it installed on your browser.

### <b>Alternative Installation</b>

Use `src/extension/build/build.zip` for manual installation in [Developer mode](https://developer.chrome.com/extensions/faq#faq-dev-01). Turn on 'Allow access to file URLs' in extension details page if testing locally.

## <b>How to Use</b>

After installing the Chrome extension, just open up your project in the browser.

Then open up your Chrome DevTools and navigate to the Reactime panel.

## <b>Troubleshooting</b>

### ❓ <b>Why is Reactime telling me that no React application is found?</b>

Reactime initially runs using the dev tools global hook from the Chrome API. It takes time for Chrome to load this. Try refreshing your application a couple times until you see Reactime running.

### ❓ <b>There is a black screen instead of the Reactime extension</b>

Try refreshing the application you want to test and refresh the DevTools by clicking the right mouse button “Reload frame”.

### ❓ <b>I found a bug in Reactime</b>

Reactime is an open source project, and we’d really appreciate your help with improving user experience. Please create a pull request (or issue) to propose and collaborate on changes to a repository.

## <b>Features</b>

### 🔹 Viewing

You can view your application's file structure and click on a snapshot to view your app's state. State can be visualized in a Component Graph, JSON Tree, or Performance Graph. Snapshots can be diffed with the previous snapshot, which can be viewed in Diff mode.
<br>
<br>

<p align="center">
<img src="./assets/map-viewing.gif" />
</p>
<br>

### 🔹 Snapshot Series and Action Comparison

You can save a series of state snapshots and use it to analyze changes in component render performance between current and previous series of snapshots. You can also name specific snapshots and compare all snapshots with the same name.
<br>
<br>

<p align="center">
<img src="./assets/action-comparison.gif" />
</p>
<br>

### 🔹 Components Comparison

When toggled to a specific snapshot, a visualization of the individual components of the snapshow will be displayed. This can be done under the same Performance tab where the snapshots are rendered. You will also find details of each component upon hovering.
<br>
<br>

<p align="center">
<img src="./assets/components-viewing.gif" />
</p>
<br>

### 🔹 Recording

Whenever state is changed (whenever setState, useState is called), this extension will create a snapshot of the current state tree and record it. Each snapshot will be displayed in Chrome DevTools under the Reactime panel.
<br>
<br>

<p align="center">
<img src="./assets/history-tree.gif" />
</p>
<br>

### 🔹 Re-render Optimization

One of the most common issues that affects performance in React is unnecessary render cycles. This problem can be fixed by checking your renders in the Performance tab in Chrome DevTools under the Reactime panel.

### 🔹 Jumping

Using the actions sidebar, a user can jump to any previous recorded snapshots. Hitting the jump button on any snapshot will allow a user to view state data at any point in the history of the target application.

### 🔹 Gatsby

Reactime offers full support for Gatsby applications. You would be able to identify unnecessary renders, duration of each rendering, travel-debugging features and visual representation of the tree components.

### 🔹 Next.js

Reactime offers debugging and performance tools for Next.js apps: time-traveling debugging, preventing unnecessary components re-renders and making your application faster.

### 🔹 TypeScript Support

Reactime offers beta support for TypeScript applications using stateful class components and functional components. Further testing and development is required for custom hooks, Context API, and Concurrent Mode.

### 🔹 Documentation

After cloning this repository, developers can simply run `npm run docs` at the root level and serve the dynamically generated `/docs/index.html` file on a browser. Doing so will provide a readable, extensible, and interactive GUI view of the structure and interfaces of the codebase.
<br>

### <b>Additional Features</b>

-   Identifying unnecessary re-renders
-   Single-click to view tooltip details on state visualizations
-   Double-click to collapse child components
-   A reverse filter with autofill to focus on a portion of the component map
-   Ability to pan and zoom on state visualizations
-   A dropdown to support development of projects on multiple tabs
-   A slider to move through snapshots quickly
-   A play button to move through snapshots automatically
-   A lock button, which stops recording each snapshot
-   A persist button to keep snapshots upon refresh (handy when changing code and debugging)
-   Download/upload the current snapshots in memory
-   Declarative titles in the actions sidebar
-   Interative Tutorial Walkthrough
-   Toggle feature allowing temporary pause of state monitoring

### <b>Bug Fixes</b>

-   Search bar now searches for specific nodes successfully
-   Tab titles of chrome browser tabs not running an application in development mode are no longer affected by Reactime
-   Multiple black screens fixed
-   Improved UI and performance
-   No longer inject scripts to non-target applications


## <b>Read More</b>

-   [Time-Travel State with Reactime](https://medium.com/better-programming/time-traveling-state-with-reactime-6-0-53fdc3ae2a20)
-   [React Fiber and Reactime](https://medium.com/@aquinojardim/react-fiber-reactime-4-0-f200f02e7fa8)
-   [Meet Reactime - a time-traveling State Debugger for React](https://medium.com/@yujinkay/meet-reactime-a-time-traveling-state-debugger-for-react-24f0fce96802)
-   [Deep in Weeds with Reactime, Concurrent React_fiberRoot, and Browser History Caching](https://itnext.io/deep-in-the-weeds-with-reactime-concurrent-react-fiberroot-and-browser-history-caching-7ce9d7300abb)
-   [Time-Traveling Through React State with Reactime 9.0](https://rxlina.medium.com/time-traveling-through-react-state-with-reactime-9-0-371dbdc99319)
-   [What time is it? Reactime!](https://medium.com/@liuedar/what-time-is-it-reactime-fd7267b9eb89)

## <b>Authors</b>

| Authors| | |
| ------------- | ------------- | -------- |
| -   **Peng Dong** - [@d28601581](https://github.com/d28601581)          | -   **Ozair Ghulam** - [@ozairgh](https://github.com/ozairgh)       | -   **Christina Or** - [@christinaor](https://github.com/christinaor) |
| -   **Khanh Bui** - [@AndyB909](https://github.com/AndyB909)          | -   **David Kim** - [@codejunkie7](https://github.com/codejunkie7)       | -   **Robby Tipton** - [@RobbyTipton](https://github.com/RobbyTipton)  |
|-   **Kevin HoEun Lee** - [@khobread](https://github.com/khobread)         | -   **Christopher LeBrett** - [@fscgolden](https://github.com/fscgolden)      | -   **Joseph Park** - [@joeepark](https://github.com/joeepark) |
| -   **Kris Sorensen** - [@kris-sorensen](https://github.com/kris-sorensen)         | -   **Daljit Gill** - [@dgill05](https://github.com/dgill05)     | -   **Ben Michareune** - [@bmichare](https://github.com/bmichare) |
| -   **Dane Corpion** - [@danecorpion](https://github.com/danecorpion)     | -   **Harry Fox** - [@StackOverFlowWhereArtThou](https://github.com/StackOverFlowWhereArtThou)       |-   **Nathan Richardson** - [@BagelEnthusiast](https://github.com/BagelEnthusiast)  |
|-   **David Bernstein** - [@dangitbobbeh](https://github.com/dangitbobbeh)         | -   **Joseph Stern** - [@josephiswhere](https://github.com/josephiswhere)       | -   **Dennis Lopez** - [@DennisLpz](https://github.com/DennisLpz)  |
| -   **Cole Styron** - [@colestyron](https://github.com/C-STYR)      | -   **Ali Rahman** - [@CourageWolf](https://github.com/CourageWolf)      | -   **Caner Demir** - [@demircaner](https://github.com/demircaner)  |
| -   **Kevin Ngo** - [@kev-ngo](https://github.com/kev-ngo)   | -   **Becca Viner** - [@rtviner](https://github.com/rtviner)         |  -   **Caitlin Chan** - [@caitlinchan23](https://github.com/caitlinchan23) | 
|-   **Kim Mai Nguyen** - [@Nkmai](https://github.com/Nkmai) |-   **Tania Lind** - [@lind-tania](https://github.com/lind-tania) |-   **Alex Landeros** - [@AlexanderLanderos](https://github.com/AlexanderLanderos) |
|-   **Chris Guizzetti** - [@guizzettic](https://github.com/guizzettic) |-   **Jason Victor** - [@theqwertypusher](https://github.com/Theqwertypusher) |-   **Sanjay Lavingia** - [@sanjaylavingia](https://github.com/sanjaylavingia) |
|-   **Vincent Nguyen** - [@VNguyenCode](https://github.com/VNguyenCode) |-   **Haejin Jo** - [@haejinjo](https://github.com/haejinjo) |-   **Hien Nguyen** - [@hienqn](https://github.com/hienqn) |
|-   **Jack Crish** - [@JackC27](https://github.com/JackC27) |-   **Kevin Fey** - [@kevinfey](https://github.com/kevinfey) |-   **Carlos Perez** - [@crperezt](https://github.com/crperezt) |
|-   **Edwin Menendez** - [@edwinjmenendez](https://github.com/edwinjmenendez) |-   **Gabriela Jardim Aquino** - [@aquinojardim](https://github.com/aquinojardim) |-   **Greg Panciera** - [@gpanciera](https://github.com/gpanciera) |
|-   **Nathanael Wa Mwenze** - [@nmwenz90](https://github.com/nmwenz90) |-   **Ryan Dang** - [@rydang](https://github.com/rydang) |-   **Bryan Lee** - [@mylee1995](https://github.com/mylee1995) |
|-   **Josh Kim** - [@joshua0308](https://github.com/joshua0308) |-   **Sierra Swaby** - [@starkspark](https://github.com/starkspark) |-   **Ruth Anam** - [@peachiecodes](https://github.com/peachiecodes) |
|-   **David Chai** - [@davidchaidev](https://github.com/davidchai717) |-   **Yujin Kang** - [@yujinkay](https://github.com/yujinkay) |-   **Andy Wong** - [@andywongdev](https://github.com/andywongdev) |
|-   **Chris Flannery** - [@chriswillsflannery](https://github.com/chriswillsflannery) |-   **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat) |-   **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla) |
|-   **Rocky Lin** - [@rocky9413](https://github.com/rocky9413) |-   **Abaas Khorrami** - [@dubalol](https://github.com/dubalol) |-   **Ergi Shehu** - [@Ergi516](https://github.com/ergi516) |
|-   **Raymond Kwan** - [@rkwn](https://github.com/rkwn) |-   **Joshua Howard** - [@Joshua-Howard](https://github.com/joshua-howard) |-   **Lina Shin** - [@rxlina](https://github.com/rxlina) |
|-   **Andy Tsou** - [@andytsou19](https://github.com/andytsou19) |-   **Feiyi Wu** - [@FreyaWu](https://github.com/FreyaWu) |-   **Viet Nguyen** - [@vnguyen95](https://github.com/vnguyen95) |
|
-   **Alex Gomez** - [@alexgomez9](https://github.com/alexgomez9) |-   **Edar Liu** - [@liuedar](https://github.com/liuedar) |-   **Kristina Wallen** - [@kristinawallen](https://github.com/kristinawallen) |
|-   **Quan Le** - [@blachfog](https://github.com/Blachfog) |-   **Robert Maeda** - [@robmaeda](https://github.com/robmaeda) | |



## <b>License </b>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
