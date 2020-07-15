import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _forEach from "lodash/forEach";
import computeClassNames from './computeClassNames';
import computeClassNamesDifference from './computeClassNamesDifference';
var prevClassNames = new Map();
/**
 * @param {React.RefObject} nodeRef
 * @param {Object[]} components
 */

var handleClassNamesChange = function handleClassNamesChange(nodeRef, components) {
  var currentClassNames = computeClassNames(components);

  var _computeClassNamesDif = computeClassNamesDifference(prevClassNames.get(nodeRef), currentClassNames),
      _computeClassNamesDif2 = _slicedToArray(_computeClassNamesDif, 2),
      forAdd = _computeClassNamesDif2[0],
      forRemoval = _computeClassNamesDif2[1];

  if (nodeRef.current) {
    _forEach(forAdd, function (className) {
      return nodeRef.current.classList.add(className);
    });

    _forEach(forRemoval, function (className) {
      return nodeRef.current.classList.remove(className);
    });
  }

  prevClassNames.set(nodeRef, currentClassNames);
};

export default handleClassNamesChange;