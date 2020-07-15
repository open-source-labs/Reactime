import * as React from 'react';

var isActionSupported = function isActionSupported(targetRef, method) {
  return targetRef && !!targetRef.current && !!targetRef.current[method];
};

var useEventListener = function useEventListener(options) {
  var capture = options.capture,
      listener = options.listener,
      type = options.type,
      targetRef = options.targetRef;
  var latestListener = React.useRef(listener);
  latestListener.current = listener;
  var eventHandler = React.useCallback(function (event) {
    return latestListener.current(event);
  }, []);
  React.useEffect(function () {
    if (isActionSupported(targetRef, 'addEventListener')) {
      ;
      targetRef.current.addEventListener(type, eventHandler, capture);
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error('@stardust-ui/react-component-event-listener: Passed `targetRef` is not valid or does not support `addEventListener()` method.');
    }

    return function () {
      if (isActionSupported(targetRef, 'removeEventListener')) {
        ;
        targetRef.current.removeEventListener(type, eventHandler, capture);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error('@stardust-ui/react-component-event-listener: Passed `targetRef` is not valid or does not support `removeEventListener()` method.');
      }
    };
  }, [capture, targetRef, type]);
};

export default useEventListener;