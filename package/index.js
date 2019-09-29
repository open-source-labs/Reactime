const snapShot = { tree: null };

const mode = {
  jumping: false,
  paused: false,
  locked: false,
};

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

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
      break;
  }
});

function visitor() {
  return './Components/BoardGame.js';
}

// module.exports = linkFiber;
module.exports = {
  reactime: linkFiber,
  visitor,
};
