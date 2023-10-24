const { TextEncoder } = require('util');
module.exports = {
  globals: {
    TextEncoder: TextEncoder,
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['www', './src/backend/__tests__/ignore', './src/app/__tests__enzyme/ignore', './src/backend/__tests__/linkFiber.test.ts', './src/app/slices/mainSlice.ts'],
  coveragePathIgnorePatterns: ['/src/backend/__tests__/ignore/', '/src/app/__tests__enzyme/ignore'],
  transformIgnorePatterns: ['/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
};
