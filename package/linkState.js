// links component state to library
// changes the setState method to also update our snapshot

module.exports = (snapShot, mode) => {
  // send message to window containing component states
  // unless library is currently jumping through time
  function sendSnapShot() {
    if (mode.jumping) return;
    const payload = snapShot.map(({ component }) => component.state);
    window.postMessage({
      action: 'recordSnap',
      payload,
    });
  }

  let snapShotIndex = 0;

  function changeSetState(component) {
    // make a copy of setState
    const oldSetState = component.setState.bind(component);

    let first = true;
    function newSetState(state, callback = () => { }) {
      // if setState is being called for the first time, this conditional sends the initial snapshot
      if (first) {
        first = false;
        sendSnapShot();
      }

      // continue normal setState functionality, except add sending message middleware
      oldSetState(state, () => {
        sendSnapShot();
        callback();
      });
    }
    
    // convert setState to promise
    const setStateAsync = (state) => {
      return new Promise(resolve => oldSetState(state, resolve));
    };

    // add component to snapshot
    snapShotIndex = snapShot.push({ component, setStateAsync }) - 1;

    // replace component's setState so developer doesn't change syntax
    component.setState = newSetState;
  }

  function changeComponentWillUnmount(component) {
    component.componentWillUnmount = () => {
      console.log('dismounting');
      // console.log(snapShot.slice(0, snapShotIndex));
      // console.log(snapShot.slice(snapShotIndex + 1));
      // console.log(snapShot.slice(0, snapShotIndex).concat(snapShot.slice(snapShotIndex + 1)));
      snapShot.splice(snapShotIndex, 1);
      // console.log(snapShot);
      // snapShot[snapShotIndex] = null;
    };
  }


  return (component) => {
    changeSetState(component);
    changeComponentWillUnmount(component);
  };
};
