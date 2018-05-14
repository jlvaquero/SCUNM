'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var title = 'Here comes the editor';

_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  title
), document.getElementById('app'));