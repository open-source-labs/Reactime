const snapShot = { tree: null };

const mode = {
  jumping: false, paused: false, locked: false,
};

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

const getTree = () => snapShot.tree.getCopy();

window.addEventListener('message', ({ data: { action, payload } }) => {
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload);
      break;
    case 'setLock':
      mode.locked = payload;
      break;
    case 'setPause':
      mode.paused = payload;
      break;
    default:
  }
});

module.exports = {
  timeJump,
  linkFiber,
  getTree,
};
