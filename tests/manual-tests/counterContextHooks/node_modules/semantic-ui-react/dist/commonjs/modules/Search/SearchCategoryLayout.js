"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function SearchCategoryLayout(props) {
  var categoryContent = props.categoryContent,
      resultsContent = props.resultsContent;
  return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
    className: "name"
  }, categoryContent), _react["default"].createElement("div", {
    className: "results"
  }, resultsContent));
}

SearchCategoryLayout.handledProps = ["categoryContent", "resultsContent"];
SearchCategoryLayout.propTypes = process.env.NODE_ENV !== "production" ? {
  /** The rendered category content */
  categoryContent: _propTypes["default"].element.isRequired,

  /** The rendered results content */
  resultsContent: _propTypes["default"].element.isRequired
} : {};
var _default = SearchCategoryLayout;
exports["default"] = _default;