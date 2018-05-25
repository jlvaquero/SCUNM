import * as actionTypes from "../actions/action-types";
export const selectMetaElto = () => ({ type: actionTypes.SELECT_META, payload: null });
export const selectVerbElto = () => ({ type: actionTypes.SELECT_VERBS, payload: null });
export const selectActionElto = () => ({ type: actionTypes.SELECT_ACTIONS, payload: null });
export const setMeta = newMeta => ({ type: actionTypes.SET_META, payload: newMeta });
export const setVerb = newVerb => ({ type: actionTypes.SET_VERB, payload: newVerb });
export const delVerb = index => ({ type: actionTypes.DEL_VERB, payload: index });
export const setAction = newAction => ({ type: actionTypes.SET_ACTION, payload: newAction });
export const delAction = name => ({ type: actionTypes.DEL_ACTION, payload: name });