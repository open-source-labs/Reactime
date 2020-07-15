import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _memoize from "lodash/memoize";
import _invoke from "lodash/invoke";
import { isRefObject, toRefObject } from '@stardust-ui/react-component-ref';

var ReferenceProxy =
/*#__PURE__*/
function () {
  function ReferenceProxy(refObject) {
    _classCallCheck(this, ReferenceProxy);

    this.ref = refObject;
  }

  _createClass(ReferenceProxy, [{
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      return _invoke(this.ref.current, 'getBoundingClientRect', {});
    }
  }, {
    key: "clientWidth",
    get: function get() {
      return this.getBoundingClientRect().width;
    }
  }, {
    key: "clientHeight",
    get: function get() {
      return this.getBoundingClientRect().height;
    }
  }, {
    key: "parentNode",
    get: function get() {
      return this.ref.current ? this.ref.current.parentNode : undefined;
    }
  }]);

  return ReferenceProxy;
}();
/**
 * Popper.js does not support ref objects from `createRef()` as referenceElement. If we will pass
 * directly `ref`, `ref.current` will be `null` at the render process. We use memoize to keep the
 * same reference between renders.
 *
 * @see https://popper.js.org/popper-documentation.html#referenceObject
 */


var createReferenceProxy = _memoize(function (reference) {
  return new ReferenceProxy(isRefObject(reference) ? reference : toRefObject(reference));
});

export default createReferenceProxy;