// (function () {
//   console.log('[Reactime Debug] Initial override script loaded');

//   let attempts = 0;
//   const MAX_ATTEMPTS = 50;

//   function verifyReactHooks() {
//     return (
//       window.React &&
//       typeof window.React.useReducer === 'function' &&
//       typeof window.React.useState === 'function'
//     );
//   }

//   const checkReact = () => {
//     attempts++;
//     console.log(`[Reactime Debug] Checking for React (attempt ${attempts})`);

//     // Only proceed if we can verify React hooks exist
//     if (verifyReactHooks()) {
//       console.log('[Reactime Debug] Found React with hooks via window.React');
//       setupOverride();
//       return;
//     }

//     // Look for React devtools hook
//     if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
//       console.log('[Reactime Debug] Found React DevTools hook');

//       // Watch for React registration
//       const originalInject = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;
//       console.log('[Reactime Debug] Original inject method:', originalInject); //ellie

//       window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function (reactInstance) {
//         console.log(
//           '[Reactime Debug] React registered with DevTools, verifying hooks availability',
//         );

//         // Give React a moment to fully initialize
//         setTimeout(() => {
//           if (verifyReactHooks()) {
//             console.log('[Reactime Debug] Hooks verified after DevTools registration');
//             setupOverride();
//           } else {
//             console.log(
//               '[Reactime Debug] Hooks not available after DevTools registration, continuing to check',
//             );
//             waitForHooks();
//           }
//         }, 2000);

//         return originalInject.apply(this, arguments);
//       };

//       return;
//     }

//     waitForHooks();
//   };

//   function waitForHooks() {
//     if (attempts < MAX_ATTEMPTS) {
//       const delay = Math.min(100 * attempts, 2000);
//       console.log(`[Reactime Debug] Hooks not found, retrying in ${delay}ms`);
//       setTimeout(checkReact, delay);
//     } else {
//       console.log('[Reactime Debug] Max attempts reached, React hooks not found');
//     }
//   }

//   function setupOverride() {
//     try {
//       console.log('[Reactime Debug] Setting up useReducer override');

//       if (!verifyReactHooks()) {
//         throw new Error('React hooks not available during override setup');
//       }

//       const originalUseReducer = window.React.useReducer;
//       window.__REACTIME_REDUCER_MAP__ = new Map();

//       window.React.useReducer = function (reducer, initialArg, init) {
//         console.log('[Reactime Debug] useReducer called with:', {
//           reducerName: reducer?.name || 'anonymous',
//           hasInitialArg: initialArg !== undefined,
//           hasInit: !!init,
//         });

//         const actualInitialState = init ? init(initialArg) : initialArg;

//         const wrappedReducer = (state, action) => {
//           try {
//             console.log('[Reactime Debug] Reducer called:', {
//               actionType: action?.type,
//               isTimeTravel: action?.type === '__REACTIME_TIME_TRAVEL__',
//               currentState: state,
//               action,
//             });

//             if (action && action.type === '__REACTIME_TIME_TRAVEL__') {
//               return action.payload;
//             }
//             return reducer(state, action);
//           } catch (error) {
//             console.error('[Reactime Debug] Error in wrapped reducer:', error);
//             return state;
//           }
//         };

//         const [state, dispatch] = originalUseReducer(wrappedReducer, actualInitialState);
//         const reducerId = Symbol('reactimeReducer');

//         console.log('[Reactime Debug] New reducer instance created:', {
//           reducerId: reducerId.toString(),
//           initialState: actualInitialState,
//           currentState: state,
//         });

//         window.__REACTIME_REDUCER_MAP__.set(reducerId, {
//           actionHistory: [],
//           dispatch,
//           initialState: actualInitialState,
//           currentState: state,
//           reducer: wrappedReducer,
//         });

//         const wrappedDispatch = (action) => {
//           try {
//             console.log('[Reactime Debug] Dispatch called:', {
//               reducerId: reducerId.toString(),
//               action,
//               currentMapSize: window.__REACTIME_REDUCER_MAP__.size,
//             });

//             const reducerInfo = window.__REACTIME_REDUCER_MAP__.get(reducerId);
//             reducerInfo.actionHistory.push(action);
//             reducerInfo.currentState = wrappedReducer(reducerInfo.currentState, action);
//             dispatch(action);
//           } catch (error) {
//             console.error('[Reactime Debug] Error in wrapped dispatch:', error);
//             dispatch(action);
//           }
//         };

//         return [state, wrappedDispatch];
//       };

//       console.log('[Reactime Debug] useReducer successfully overridden');
//     } catch (error) {
//       console.error('[Reactime Debug] Error during override setup:', error);
//       // If override fails, try again after a delay
//       setTimeout(checkReact, 500);
//     }
//   }

//   // Start checking for React
//   checkReact();

//   // Watch for dynamic React loading
//   const observer = new MutationObserver((mutations) => {
//     if (verifyReactHooks()) {
//       console.log('[Reactime Debug] React hooks found after DOM mutation');
//       observer.disconnect();
//       setupOverride();
//     }
//   });

//   observer.observe(document, {
//     childList: true,
//     subtree: true,
//   });
// })();


(function () {
  console.log('[Reactime Debug] Initial override script loaded');

  // Retry constants
  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  // Verify React hooks via registered renderers
  function verifyReactHooks() {
    try {
      const renderers = Array.from(
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.values()
      );
      return renderers.some((renderer) => renderer?.currentDispatcher?.useReducer);
    } catch (err) {
      console.error('[Reactime Debug] Error verifying React hooks:', err);
      return false;
    }
  }

  // Set up the useReducer override
  function setupOverride() {
    console.log('[Reactime Debug] Setting up useReducer override');

    try {
      const renderers = Array.from(
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.values()
      );
      const renderer = renderers[0]; // Assume first renderer for simplicity
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

  // Attempt to detect React and set up override
  function checkReact() {
    attempts++;
    console.log(`[Reactime Debug] Checking for React (attempt ${attempts}/${MAX_ATTEMPTS})`);

    if (verifyReactHooks()) {
      console.log('[Reactime Debug] React hooks found. Setting up overrides.');
      setupOverride();
    } else if (attempts < MAX_ATTEMPTS) {
      setTimeout(checkReact, Math.min(100 * attempts, 2000));
    } else {
      console.log('[Reactime Debug] Max attempts reached. React hooks not found.');
    }
  }

  // Hook into the inject method of React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const originalInject = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;

    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function (renderer) {
      console.log('[Reactime Debug] React renderer registered.');
      setupOverride(); // React is registered, so immediately set up overrides
      return originalInject.apply(this, arguments);
    };

    console.log('[Reactime Debug] React DevTools hook overridden.');
  } else {
    console.log('[Reactime Debug] React DevTools hook not found. Starting manual checks.');
    checkReact(); // Start retries if no DevTools hook
  }
})();
