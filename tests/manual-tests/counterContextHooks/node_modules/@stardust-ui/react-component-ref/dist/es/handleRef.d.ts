import * as React from 'react';
/**
 * The function that correctly handles passing refs.
 *
 * @param ref An ref object or function
 * @param node A node that should be passed by ref
 */
declare const handleRef: <N>(ref: React.Ref<N>, node: N) => void;
export default handleRef;
