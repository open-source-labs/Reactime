module.exports = function Graph(snapshot, parent) {
  this.parent = parent;
  this.snapshot = snapshot;
  this.children = [];
  this.add = (snapshot) => {};
  this.remove = () => {};
};
