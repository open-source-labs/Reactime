module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  // parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [0],
    'no-console': [0],
    'react/prop-types': [0]
  }
};
