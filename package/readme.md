# React-Time-Travel

A debugging tool for React. Records state whenever state is changed and allows user to jump to any previous recorded state.

Two parts are needed for this tool to function. The chrome extension must be installed, and the NPM package must be installed and used in the React code.

## Installing

1. Download the Chrome extension from Chrome Web Store.

2. Install the [npm package](https://www.npmjs.com/package/react-time-travel) in your code.
```
npm i react-time-travel
```
3. Call the library method on your root container after rendering your App.

```
const reactTimeTravel = require('react-time-travel');

const rootContainer = document.getElementById('root');
ReactDom.render(<App />, rootContainer);

reactTimeTravel(rootContainer);
```

4. Done! That's all you have to do to link your React project to our library.

## How to Use

After installing both the Chrome extension and the npm package, just open up your project in the browser. 

Then open up your Chrome DevTools. There'll be a new tab called React-Time-Travel.

## Features

### Recording

Whenever state is changed (whenever setState is called), this extension will create a snapshot of the current state tree and record it. Each snapshot will be displayed in Chrome DevTools under the React-Time-Travel panel. 

### Viewing

You can click on a snapshot to view your app's state. State can be visualized in a JSON or a tree. 

The selected snapshot can also be diffed/compared with the current dom.

### Jumping

The most important feature of all. Jumping to any previous recorded snapshot. Hitting the jump button on any snapshot will change the dom by setting their state. One important thing to note. This library does not work well when mixing React with direct DOM manipulation. Since DOM manipulation doesn't change any React state, this library cannot record or even detect that change. Of course, you should be avoiding mixing the two in the first place.

### Others

Other handy features include: 
* multiple tabs support
* a slider to move through snapshots quickly
* a play button to move through snapshots automatically
* a pause which button stops recording each snapshot
* a lock button to freeze the DOM in place. setState will lose all functionality while the extension is locked
* a persist button to keep snapshots upon refresh. handy when changing code and debugging
* export/import the current snapshots in memory

## Authors

* **Ryan Dang** - [@rydang](https://github.com/rydang)
* **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
* **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
* **Sierra Swaby** - [@starkspark](https://github.com/starkspark)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
