import * as React from 'react';
/** Creates a React ref object from existing DOM node. */
declare const toRefObject: <T extends Node>(node: T) => React.RefObject<T>;
export default toRefObject;
