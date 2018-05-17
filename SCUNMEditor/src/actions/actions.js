import * as actionTypes from "../actions/action-types";
export const selectMetaElto = () => ({ type: actionTypes.SELECT_META, payload: null });
export const selectVerbElto = () => ({ type: actionTypes.SELECT_VERBS, payload: null });
export const setMeta = newMeta => ({ type: actionTypes.SET_META, payload: newMeta });