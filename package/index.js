const snapShot = [];

window.addEventListener('message', (event) => {
  console.log('data received', event.data);
});

const linkState = require('./linkState')(snapShot);

module.exports = {
  linkState,
};
