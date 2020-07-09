// returns a throttled version of an input function
// the returned throttled function only executes at most once every t milliseconds
export const throttle = (f, t) => {
  let isOnCooldown = false;
  let isCallQueued = false;
  const throttledFunc = () => {
    if (isOnCooldown && isCallQueued) return;
    if (isOnCooldown) {
      isCallQueued = true;
      return;
    }
    f();
    isOnCooldown = true;
    isCallQueued = false;

    const runAfterTimeout = () => {
      if (isCallQueued) {
        isCallQueued = false;
        isOnCooldown = true; // not needed I think
        setTimeout(runAfterTimeout, t);
        return;
      }
      isOnCooldown = false;
    };
    setTimeout(runAfterTimeout, t);
  };
  return throttledFunc;
};

export const helper2 = () => {};