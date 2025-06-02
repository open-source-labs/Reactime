// core-js is a  library that includes polyfill for many types of native js
// features such as promise, symbols, collections, typed arrays, etc.
// Used in reactime to make sure our newest code
// can run on outdated platforms and with outdated applications
declare module 'core-js';
// Regenerator runtime provides runtime support for compiled/transpiled async functions.
// Like babel that compiles modern js into older js,
// async functions are also compiled to run on engines that don't support async.
// After babel does the syntax transformation or transpiles the async functions,
// the resulting code uses regen runtime to run
// https://stackoverflow.com/questions/65378542/what-is-regenerator-runtime-npm-package-used-for
declare module 'regenerator-runtime/runtime';
