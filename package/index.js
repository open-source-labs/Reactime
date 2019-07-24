const snapShot = [];
const mode = { jumping: false };

const linkState = require('./linkState')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

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
