# React-Time-Travel

A debugging tool for React. Records state whenever state is changed and allows user to jump to any previous recorded state.

Two parts are needed for this tool to function. The chrome extension must be installed, and the NPM package must be installed and used in the React code.

## Installing

1. Download the Chrome extension from Chrome Web Store.

2. Install the npm package in your code.
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

## Authors

* **Ryan Dang** - [@rydang](https://github.com/rydang)
* **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
* **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
* **Sierra Swaby** - [@starkspark](https://github.com/starkspark)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

