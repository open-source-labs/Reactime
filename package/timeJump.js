module.exports = (snapShot) => {
  return (newSnapShot) => {
    newSnapShot.forEach(async (state, i) => {
      await snapShot[i].oldSetState(state);
    });
  };
};
