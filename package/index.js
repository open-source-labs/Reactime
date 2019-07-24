const snapShot = [];
const linkState = require('./linkState')(snapShot);
const timeJump = require('./timeJump')(snapShot);

const getShot = () => snapShot.map(({ component }) => component.state);

window.addEventListener('message', ({ data: { action, payload } }) => {
  if (action === 'jumpToSnap') {
    timeJump(payload);
  }
});

module.exports = {
  linkState,
  timeJump,
  getShot,
};
