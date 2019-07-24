// links component state to library
// changes the setState method to also update our snapshot

module.exports = (snapShot) => {
  function sendSnapShot() {
    const payload = snapShot.map(comp => comp.state);
    window.postMessage({
      action: 'recordSnap',
      payload,
    });
  }

  return (component) => {
    snapShot.push(component);

    sendSnapShot();

    const oldSetState = component.setState.bind(component);

    function newSetState(state, callback = () => { }) {
      oldSetState(state, () => {
        sendSnapShot();
        callback();
      });
    }

    component.setState = newSetState;
  };
};
