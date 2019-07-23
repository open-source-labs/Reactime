const snapShot = [];

const linkState = require('./linkState')(snapShot);
const getSnap = () => snapShot;


module.exports = {
  linkState,
  getSnap,
};
