const snapShot = [];
const mode = { jumping: false };

const linkState = require('./linkState')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);
const unlinkState = require('./unlinkState')(snapShot);

const getShot = () => snapShot.map(({ component }) => component.state);

window.addEventListener('message', ({ data: { action, payload } }) => {
  if (action === 'jumpToSnap') {
    timeJump(payload);
  } else if (action === 'stepToJump') {
    payload.forEach(snap => timeJump(snap));
  }
});

module.exports = {
  linkState,
  unlinkState,
  timeJump,
  getShot,
};
