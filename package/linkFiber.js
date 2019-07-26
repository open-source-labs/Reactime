// links component state tree to library
// changes the setState method to also update our snapshot

module.exports = (snapShotTree, mode) => {
  return (container) => {
    const fiber = container._reactRootContainer._internalRoot.current.child;
  };
};
