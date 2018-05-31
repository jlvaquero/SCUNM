"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modAction = exports.delAction = exports.setAction = exports.modVerb = exports.delVerb = exports.setVerb = exports.setMeta = exports.selectActionElto = exports.selectVerbElto = exports.selectMetaElto = undefined;

var _actionTypes = require("./action-types");

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const selectMetaElto = exports.selectMetaElto = () => ({ type: actionTypes.SELECT_META, payload: null });
const selectVerbElto = exports.selectVerbElto = () => ({ type: actionTypes.SELECT_VERBS, payload: null });
const selectActionElto = exports.selectActionElto = () => ({ type: actionTypes.SELECT_ACTIONS, payload: null });
const setMeta = exports.setMeta = newMeta => ({ type: actionTypes.SET_META, payload: newMeta });
const setVerb = exports.setVerb = newVerb => ({ type: actionTypes.SET_VERB, payload: newVerb });
const delVerb = exports.delVerb = index => ({ type: actionTypes.DEL_VERB, payload: index });
const modVerb = exports.modVerb = (index, newValue) => ({ type: actionTypes.MOD_VERB, payload: { index, newValue } });
const setAction = exports.setAction = newAction => ({ type: actionTypes.SET_ACTION, payload: newAction });
const delAction = exports.delAction = name => ({ type: actionTypes.DEL_ACTION, payload: name });
const modAction = exports.modAction = (actionName, actionData) => ({ type: actionTypes.MOD_ACTION, payload: { actionName, actionData } });