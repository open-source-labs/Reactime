const snapShot = [];

window.addEventListener('message', ({ data: { action, payload } }) => {
  if (action === 'jumpToSnap') {
    console.log('snap received from chrome', payload);
  }
});

const linkState = require('./linkState')(snapShot);

module.exports = {
  linkState,
};
