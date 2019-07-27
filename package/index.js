const snapShot = { tree: null };

const mode = { jumping: false };

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

const getTree = () => snapShot.tree.getCopy();

window.addEventListener('message', ({ data: { action, payload } }) => {
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload);
      break;
    case 'stepToSnap':
      const { speed, steps } = payload;
    default:
  }
});

module.exports = {
  timeJump,
  linkFiber,
  getTree,
};
