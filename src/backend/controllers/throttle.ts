/**
 * @method throttle
 * @param callback A function to throttle
 * @param MIN_TIME_BETWEEN_UPDATE A number of milliseconds to use as throttling interval
 * @returns A function that limits input function, `callback`, from being called more than once every `MIN_TIME_BETWEEN_UPDATE` milliseconds
 *
 */
export default function throttle<T extends (...args: any) => any>(
  callback: T,
  MIN_TIME_BETWEEN_UPDATE: number,
): (...arg: Parameters<T>) => ReturnType<T> {
  // Initialize boolean flags for callback, throttledFunc
  /**
   * A boolean variable tracking if MIN_TIME_BETWEEN_UPDATE has passed
   *
   * This value turns TRUE after a callback function is invoked. While this value is true, no additional callback function can be invoked.
   *
   * This value turns FALSE after MIN_TIME_BETWEEN_UPDATE has passed => additional callback can now be invoked.
   *
   * @default false
   */
  let isOnCooldown: boolean = false;
  /**
   * A boolean variable tracking if there is a request to invoke the callback in the queue.
   *
   * This value turns TRUE if a request to invoke the callback is sent before the MIN_TIME_BETWEEN_UPDATE passes.
   *
   * This value turns FALSE after the callback is invoked.
   *
   * @default false
   *
   */
  let isCallQueued: boolean = false;

  let timeout: NodeJS.Timeout;
  // Wrap the passed-in function callback in a callback function that "throttles" (puts a limit on) the number of calls that can be made to function in a given period of time (ms)
  return function throttledFunc(...args: Parameters<T>): ReturnType<T> {
    // CASE 1: In cooldown mode and we have a function waiting to be executed, so do nothing
    if (isOnCooldown && isCallQueued) return;

    // CASE 2: In cooldown mode, but we have no functions waiting to be executed, so just make note that we now have a callback waiting to be executed and then return
    if (isOnCooldown) {
      isCallQueued = true;
      return;
    }

    // CASE 3: If we are ready to "fire":
    // Execute the function callback immediately
    callback(...args);
    // Initiate a new cooldown period and reset the "call queue"
    isOnCooldown = true;
    isCallQueued = false;
    // Set timeout to end the cooldown period after MIN_TIME_BETWEEN_UPDATE has passed
    clearTimeout(timeout);
    timeout = setTimeout(runAfterTimeout, MIN_TIME_BETWEEN_UPDATE);

    /**
     * @function runAfterTimeout - a function that end the cooldown mode & checks whether we have another function to be executed right after.
     * @returns void
     */
    function runAfterTimeout() {
      // If there is callback in the queue, execute callback immediately
      if (isCallQueued) {
        // Execute callback
        callback(...args);
        // Initiate a new cooldown period and reset the "call queue"
        isOnCooldown = true;
        isCallQueued = false;
        // End the cooldown period after MIN_TIME_BETWEEN_UPDATE
        clearTimeout(timeout);
        setTimeout(runAfterTimeout, MIN_TIME_BETWEEN_UPDATE);
      }
      // If no callback in queue, end the cooldown period
      else {
        // End cooldown period after MIN_TIME_BETWEEN_UPDATE has passed
        isOnCooldown = false;
      }
    }
  };
}
