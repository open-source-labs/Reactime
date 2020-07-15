# gatsby-plugin-zopfli

[![Travis](https://img.shields.io/travis/com/ovhemert/gatsby-plugin-zopfli.svg?branch=master&logo=travis)](https://travis-ci.com/ovhemert/gatsby-plugin-zopfli)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6b2619c09ca94862bf349f40eb913466)](https://www.codacy.com/app/ovhemert/gatsby-plugin-zopfli?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ovhemert/gatsby-plugin-zopfli&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/npm/gatsby-plugin-zopfli/badge.svg)](https://snyk.io/test/npm/gatsby-plugin-zopfli)
[![Coverage Status](https://coveralls.io/repos/github/ovhemert/gatsby-plugin-zopfli/badge.svg)](https://coveralls.io/github/ovhemert/gatsby-plugin-zopfli)
[![Greenkeeper badge](https://badges.greenkeeper.io/ovhemert/gatsby-plugin-zopfli.svg)](https://greenkeeper.io/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Gatsby plugin for preparing zopfli-compressed gzip versions of assets.

The Zopfli Compression Algorithm is a new, open sourced data compression library. It creates a smaller output size, typically 3–8% smaller compared to zlib at maximum compression

The compression method is best suited for static web content, files that don't change that often and that generate a lot of traffic. That's because Zopfli uses two to three times more CPU time than zlib at maximum quality.

Files compressed with Zopfli can be decompressed with existing methods on the client and there will be no performance penalty at this end.

```bash
/webpack-runtime-cde5506958f1afc4d89e.js
```
becomes
```bash
/webpack-runtime-cde5506958f1afc4d89e.js.gz
```

## Requirements

This plugin wil only generate the compressed files. To see them been served to the client, your Gatsby website should run on a production server that supports GZip. The Gatsby development server **does not** serve the compressed versions.

## Installation

With npm:

```bash
npm install --save gatsby-plugin-zopfli
```

Or with Yarn:

```bash
yarn add gatsby-plugin-zopfli
```

## Usage

In your `gatsby-config.js` file add:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-zopfli'
    }
  ]
}
```

By default, only `.css` and `.js` files are compressed, but you can override this with the `extensions` option.

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        extensions: ['css', 'html', 'js', 'svg']
      }
    }
  ]
}
```

You can even place all the zopfli-compressed files in a dedicated directory (ex. `public/zopfli`):

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        path: 'zopfli'
      }
    }
  ]
}
```

To customize compression, you can add optional parameters to the zopfli library: ([see here for details on various options)](https://github.com/pierreinglebert/node-zopfli#options)

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        path: 'zopfli',
        compression: {
          numiterations: 25
        }
      }
    }
  ]
}
```

For diagnostic information, you can enable verbose logging:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        verbose: true
      }
    }
  ]
}
```

## Maintainers

Osmond van Hemert
[![Github](https://img.shields.io/badge/-website.svg?style=social&logoColor=333&logo=github)](https://github.com/ovhemert)
[![Web](https://img.shields.io/badge/-website.svg?style=social&logoColor=333&logo=nextdoor)](https://ovhemert.dev)

## Contributing

If you would like to help out with some code, check the [details](./docs/CONTRIBUTING.md).

Not a coder, but still want to support? Have a look at the options available to [donate](https://ovhemert.dev/donate).

## Sponsors

[![BrowserStack](./docs/assets/browserstack-logo.svg)](https://www.browserstack.com/)

## License

Licensed under [MIT](./LICENSE).

_NOTE: This plugin only generates output when run in `production` mode!_
