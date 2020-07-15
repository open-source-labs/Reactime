import _typeof from "@babel/runtime/helpers/esm/typeof";

/** Checks that the passed object is a valid React ref object. */
var isRefObject = function isRefObject(ref) {
  return (// https://github.com/facebook/react/blob/v16.8.2/packages/react-reconciler/src/ReactFiberCommitWork.js#L665
    ref !== null && _typeof(ref) === 'object' && ref.hasOwnProperty('current')
  );
};

export default isRefObject;