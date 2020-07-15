import _isNil from "lodash/isNil";
import { isRefObject, toRefObject } from '@stardust-ui/react-component-ref';
import { isBrowser } from '../../../lib';
/**
 * Given `this.props`, return a `node` value or undefined.
 *
 * @param {object|React.RefObject} props Component's props
 * @return {React.RefObject|undefined}
 */

var getNodeRefFromProps = function getNodeRefFromProps(props) {
  var node = props.node;

  if (isBrowser()) {
    if (isRefObject(node)) return node;
    return _isNil(node) ? toRefObject(document.body) : toRefObject(node);
  }
};

export default getNodeRefFromProps;