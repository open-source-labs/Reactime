const snapShot = [];
const linkState = require('./linkState')(snapShot);
const timeJump = require('./timeJump')(snapShot);

window.addEventListener('message', ({ data: { action, payload } }) => {
  if (action === 'jumpToSnap') {
    console.log('snap received from chrome', payload);
  }
});


module.exports = {
  linkState,
  timeJump,
};
