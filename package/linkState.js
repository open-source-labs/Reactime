module.exports = (snapShot) => {
  return (component) => {
    snapShot.push(component);
    return component;
  };
};
