const snapShot = { tree: null };

const mode = { jumping: false };

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

const getTree = () => snapShot.tree.getCopy();

window.addEventListener('message', ({ data: { action, payload } }) => {
  if (action === 'jumpToSnap') {
    timeJump(payload);
  }
});

module.exports = {
  timeJump,
  linkFiber,
  getTree,
};
