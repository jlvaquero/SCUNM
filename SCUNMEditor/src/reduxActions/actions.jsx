﻿import * as actionTypes from "./action-types";
export const selectElto = (actionType) => ({ type: actionType, payload: null });
export const setMeta = newMeta => ({ type: actionTypes.SET_META, payload: newMeta });
export const setVerb = newVerb => ({ type: actionTypes.SET_VERB, payload: newVerb });
export const delVerb = index => ({ type: actionTypes.DEL_VERB, payload: index });
export const modVerb = (index, newValue) => ({ type: actionTypes.MOD_VERB, payload: { index, newValue } });
export const setAction = newAction => ({ type: actionTypes.SET_ACTION, payload: newAction });
export const delAction = name => ({ type: actionTypes.DEL_ACTION, payload: name });
export const modAction = (actionName, actionData) => ({ type: actionTypes.MOD_ACTION, payload: { actionName, actionData } });