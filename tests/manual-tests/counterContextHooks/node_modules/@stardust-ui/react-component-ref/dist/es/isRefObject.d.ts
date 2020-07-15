import * as React from 'react';
/** Checks that the passed object is a valid React ref object. */
declare const isRefObject: (ref: any) => ref is React.RefObject<any>;
export default isRefObject;
