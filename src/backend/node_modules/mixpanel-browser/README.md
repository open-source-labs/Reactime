# Mixpanel JavaScript Library
[![Build Status](https://travis-ci.org/mixpanel/mixpanel-js.svg?branch=master)](https://travis-ci.org/mixpanel/mixpanel-js)

The Mixpanel JavaScript Library is a set of methods attached to a global `mixpanel` object
intended to be used by websites wishing to send data to Mixpanel projects. A full reference
is available [here](https://developer.mixpanel.com/docs/javascript-full-api-reference).

## Alternative installation via NPM
This library is available as a [package on NPM](https://www.npmjs.com/package/mixpanel-browser) (named `mixpanel-browser` to distinguish it from Mixpanel's server-side Node.js library, available on NPM as `mixpanel`). To install into a project using NPM with a front-end packager such as [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/):

```sh
npm install --save mixpanel-browser
```

You can then require the lib like a standard Node.js module:

```javascript
var mixpanel = require('mixpanel-browser');

mixpanel.init("YOUR_TOKEN");
mixpanel.track("An event");
```

## Alternative installation via Bower
`mixpanel-js` is also available via front-end package manager [Bower](http://bower.io/). After installing Bower, fetch into your project's `bower_components` dir with:
```sh
bower install mixpanel
```

### Using Bower to load the snippet
You can then load the lib via the embed code (snippet) with a script reference:
```html
<script src="bower_components/mixpanel/mixpanel-jslib-snippet.min.js"></script>
```
which loads the _latest_ library version from the Mixpanel CDN ([http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js](http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js)).

### Using Bower to load the entire library
If you wish to load the specific version downloaded in your Bower package, there are two options.

1) Override the CDN library location with the global `MIXPANEL_CUSTOM_LIB_URL` var:
```html
<script>
  window.MIXPANEL_CUSTOM_LIB_URL = 'bower_components/mixpanel/mixpanel.js';
</script>
<script src="bower_components/mixpanel/mixpanel-jslib-snippet.min.js"></script>
```
or

2) Recompile the snippet with a custom `MIXPANEL_LIB_URL` using [Closure Compiler](https://developers.google.com/closure/compiler/):
```sh
java -jar compiler.jar --js mixpanel-jslib-snippet.js --js_output_file mixpanel-jslib-snippet.min.js --compilation_level ADVANCED_OPTIMIZATIONS --define='MIXPANEL_LIB_URL="bower_components/mixpanel/mixpanel.js"'
```

### Upgrading from mixpanel-bower v2.2.0 or v2.0.0
If you originally installed Mixpanel via Bower at its previous home ([https://github.com/drubin/mixpanel-bower](https://github.com/drubin/mixpanel-bower)), the two old versions have remained functionally unchanged. To upgrade to v2.3.6 or later (the first Bower version in the official repo) from a previous Bower install, note the changed filenames: previous references to `mixpanel.js` should become `mixpanel-jslib-snippet.min.js` (the minified embed code), and previous references to `mixpanel.dev.js` should become `mixpanel.js` (the library source) or `mixpanel.min.js` (the minified library for production use).

## Building bundles for release
- Install development dependencies: `npm install`
- Build: `npm run build-dist`

## Running tests
- Install development dependencies: `npm install`
- Run unit tests: `npm test`
- Start test server for browser tests: `npm run integration_test`
- Browse to [http://localhost:3000/tests/](http://localhost:3000/tests/) and choose a scenario to run

In the future we plan to automate the last step with a headless browser to streamline development (although
Mixpanel production releases are tested against a large matrix of browsers and operating systems).

## Generating and publishing documentation
- Create bundled source build: `npm run build-dist`
- Generate Markdown: `npm run dox` (result is at `doc/readme.io/javascript-full-api-reference.md`)
- Publish to readme.io via the [rdme](https://www.npmjs.com/package/rdme) util: `RDME_API_KEY=<API_KEY> npm run dox-publish`

## Thanks
For patches and support: @bohanyang, @dehau, @drubin, @D1plo1d, @feychenie, @mogstad, @pfhayes, @sandorfr, @stefansedich, @gfx, @pkaminski, @austince, @danielbaker, @mkdai, @wolever, @dpraul, @chriszamierowski
