import _extends from "@babel/runtime/helpers/extends";
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getElementType, getUnhandledProps } from '../../lib';
/**
 * A dropdown menu can contain dividers to separate related content.
 */

function DropdownDivider(props) {
  var className = props.className;
  var classes = cx('divider', className);
  var rest = getUnhandledProps(DropdownDivider, props);
  var ElementType = getElementType(DropdownDivider, props);
  return React.createElement(ElementType, _extends({}, rest, {
    className: classes
  }));
}

DropdownDivider.handledProps = ["as", "className"];
DropdownDivider.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Additional classes. */
  className: PropTypes.string
} : {};
export default DropdownDivider;