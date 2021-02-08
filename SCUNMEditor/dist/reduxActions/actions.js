"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modAction = exports.delAction = exports.setAction = exports.modVerb = exports.delVerb = exports.setVerb = exports.setMeta = exports.selectElto = void 0;

var actionTypes = _interopRequireWildcard(require("./action-types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const selectElto = actionType => ({
  type: actionType,
  payload: null
});

exports.selectElto = selectElto;

const setMeta = newMeta => ({
  type: actionTypes.SET_META,
  payload: newMeta
});

exports.setMeta = setMeta;

const setVerb = newVerb => ({
  type: actionTypes.SET_VERB,
  payload: newVerb
});

exports.setVerb = setVerb;

const delVerb = index => ({
  type: actionTypes.DEL_VERB,
  payload: index
});

exports.delVerb = delVerb;

const modVerb = (index, newValue) => ({
  type: actionTypes.MOD_VERB,
  payload: {
    index,
    newValue
  }
});

exports.modVerb = modVerb;

const setAction = newAction => ({
  type: actionTypes.SET_ACTION,
  payload: newAction
});

exports.setAction = setAction;

const delAction = name => ({
  type: actionTypes.DEL_ACTION,
  payload: name
});

exports.delAction = delAction;

const modAction = (actionName, actionData) => ({
  type: actionTypes.MOD_ACTION,
  payload: {
    actionName,
    actionData
  }
});

exports.modAction = modAction;