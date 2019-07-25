module.exports = (snapShot) => {
  return (component) => {
    let snapShotIndex = snapShot.length;
    for (let i = 0; i < snapShot.length; i += 1) {
      const { component: comp } = snapShot[i];
      if (component === comp) {
        snapShotIndex = i;
      }
    }
    snapShot.splice(snapShotIndex, 1);
  };
};
