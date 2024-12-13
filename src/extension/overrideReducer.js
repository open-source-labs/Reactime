(function () {
  console.log('[Reactime Debug] Initial override script loaded');

  function setupOverride(renderer) {
    console.log('[Reactime Debug] Setting up useReducer override');

    try {
      const originalUseReducer = renderer?.currentDispatcher?.useReducer;

      if (!originalUseReducer) {
        throw new Error('useReducer not found in React renderer.');
      }

      renderer.currentDispatcher.useReducer = function (reducer, initialArg, init) {
        console.log('[Reactime Debug] useReducer intercepted:', reducer.name || 'anonymous');

        const wrappedReducer = (state, action) => {
          console.log('[Reactime Debug] Reducer called:', { state, action });
          return reducer(state, action);
        };

        return originalUseReducer(wrappedReducer, initialArg, init);
      };

      console.log('[Reactime Debug] useReducer successfully overridden.');
    } catch (err) {
      console.error('[Reactime Debug] Error in setupOverride:', err);
    }
  }

  function findValidRenderer() {
    const renderers = Array.from(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.values());

    console.log('[Reactime Debug] Found renderers:', renderers);

    const validRenderer = renderers.find((renderer) => renderer?.currentDispatcher?.useReducer);

    if (validRenderer) {
      console.log('[Reactime Debug] Valid renderer with useReducer found.');
      return validRenderer;
    }

    console.warn('[Reactime Debug] No valid renderer with useReducer found.');
    return null;
  }

  function waitForHooks(renderer, maxAttempts = 50, interval = 100) {
    let attempts = 0;

    const intervalId = setInterval(() => {
      attempts++;

      if (renderer?.currentDispatcher?.useReducer) {
        console.log('[Reactime Debug] useReducer found during render cycle.');
        setupOverride(renderer); // Set up hook overrides
        clearInterval(intervalId); // Stop polling
      } else if (attempts >= maxAttempts) {
        console.warn('[Reactime Debug] Max attempts reached. useReducer not found.');
        clearInterval(intervalId);
      }
    }, interval);
  }

  function initialize() {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const renderer = findValidRenderer();

      if (renderer) {
        if (renderer.currentDispatcher?.useReducer) {
          // If hooks are immediately available, override them
          setupOverride(renderer);
        } else {
          // If not, wait for hooks to become available
          waitForHooks(renderer);
        }
      }
    } else {
      console.error('[Reactime Debug] React DevTools hook not found.');
    }
  }

  // Start initialization
  initialize();
})();
