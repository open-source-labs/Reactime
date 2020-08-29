#!/bin/bash

# building with $DIST=1 also implies $FULL=1
if [ ! -z "$DIST" ]; then
    export FULL=1
fi

echo 'Building main bundle'
./node_modules/.bin/rollup -i src/loader-globals.js -f iife -o build/mixpanel.globals.js -n mixpanel -c rollup.config.js
ln -sf mixpanel.globals.js build/mixpanel.js

if [ ! -z "$FULL" ]; then
    echo 'Minifying main build and snippets'
    java -jar vendor/closure-compiler/compiler.jar --js build/mixpanel.js --js_output_file build/mixpanel.min.js --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "(function() {
%output%
})();"
    java -jar vendor/closure-compiler/compiler.jar --js mixpanel-jslib-snippet.js --js_output_file build/mixpanel-jslib-snippet.min.js --compilation_level ADVANCED_OPTIMIZATIONS
    java -jar vendor/closure-compiler/compiler.jar --js mixpanel-jslib-snippet.js --js_output_file build/mixpanel-jslib-snippet.min.test.js --compilation_level ADVANCED_OPTIMIZATIONS --define='MIXPANEL_LIB_URL="../build/mixpanel.min.js"'

    echo 'Building module bundles'
    ./node_modules/.bin/rollup -i src/loader-module.js -f amd -o build/mixpanel.amd.js -c rollup.config.js
    ./node_modules/.bin/rollup -i src/loader-module.js -f cjs -o build/mixpanel.cjs.js -c rollup.config.js
    ./node_modules/.bin/rollup -i src/loader-module.js -f umd -o build/mixpanel.umd.js -n mixpanel -c rollup.config.js

    echo 'Bundling module-loader test runners'
    ./node_modules/.bin/webpack tests/module-cjs.js tests/module-cjs.bundle.js
    ./node_modules/.bin/browserify tests/module-es2015.js -t [ babelify --compact false ] --outfile tests/module-es2015.bundle.js

    echo 'Bundling module-loader examples'
    pushd examples/commonjs-browserify; npm install && npm run build; popd
    pushd examples/es2015-babelify; npm install && npm run build; popd
    pushd examples/umd-webpack; npm install && npm run build; popd
fi

if [ ! -z "$DIST" ]; then
    echo 'Copying to dist/'
    rm -r dist
    cp -r build dist
fi
