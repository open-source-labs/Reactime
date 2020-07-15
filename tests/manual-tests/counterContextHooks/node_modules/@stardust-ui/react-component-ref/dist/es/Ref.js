import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactIs from 'react-is';
import RefFindNode from './RefFindNode';
import RefForward from './RefForward';
import { refPropType } from './types';

var Ref = function Ref(props) {
  var children = props.children,
      innerRef = props.innerRef;
  var child = React.Children.only(children);
  var ElementType = ReactIs.isForwardRef(child) ? RefForward : RefFindNode;
  return React.createElement(ElementType, {
    innerRef: innerRef
  }, child);
};

Ref.displayName = 'Ref'; // TODO: use Babel plugin for this

if (process.env.NODE_ENV !== 'production') {
  Ref.propTypes = {
    children: PropTypes.element.isRequired,
    innerRef: refPropType.isRequired
  };
}

export default Ref;