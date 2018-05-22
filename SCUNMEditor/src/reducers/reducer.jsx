import * as actionTypes from "../actions/action-types";
import * as appState from "../state/State";

const rootReducer = (state = appState.initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_META:
      return setMetaSelected(state);
    case actionTypes.SELECT_VERBS:
      return setVerbsSelected(state);
    case actionTypes.SET_META:
      return setMetaInfo(state, action);
    case actionTypes.SET_VERB:
      return setNewVerb(state, action);
    case actionTypes.DEL_VERB:
      return deleteVerb(state, action);
    default:
      return state;
  }
};
export default rootReducer;

function setVerbsSelected(state) {
  return Object.assign({}, state, { selectedGameElto: appState.VERB_GAME_ELTO });
}

function setMetaSelected(state) {
  return Object.assign({}, state, { selectedGameElto: appState.META_GAME_ELTO });
}

function setMetaInfo(state, action) {
  const newMeta = action.payload;
  return Object.assign({}, state, { meta: newMeta });
}

function setNewVerb(state, action) {
  const newVerb = action.payload;
  return Object.assign({}, state, { verbs: [].concat(state.verbs, newVerb) });
}

function deleteVerb(state, action) {
  const index = action.payload;
  return Object.assign({}, state, { verbs: state.verbs.slice(0, index).concat(state.verbs.slice(index + 1)) });
}