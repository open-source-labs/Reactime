const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-pages-404-js": hot(preferDefault(require("/Users/gabrielajardimaquino/Desktop/ReactimeONTEST/reactime/website/src/pages/404.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/Users/gabrielajardimaquino/Desktop/ReactimeONTEST/reactime/website/src/pages/index.js")))
}

