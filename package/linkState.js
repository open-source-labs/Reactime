// links component state to library
// changes the setState method to also update our snapshot

module.exports = (snapShot, mode) => {
  function sendSnapShot() {
    if (mode.jumping) return;
    const payload = snapShot.map(({ component }) => component.state);
    window.postMessage({
      action: 'recordSnap',
      payload,
    });
  }

  return (component) => {
    const oldSetState = component.setState.bind(component);

    const setStateAsync = (state) => {
      return new Promise(resolve => oldSetState(state, resolve));
    };

    snapShot.push({ component, setStateAsync });

    function newSetState(state, callback = () => { }) {
      oldSetState(state, () => {
        sendSnapShot();
        callback();
      });
    }

    component.setState = newSetState;
  };
};
