import * as actionTypes from "../actions/action-types";
import * as appState from "../state/State";

const rootReducer = (state = appState.initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_META:
      return setMetaSelected(state);
    case actionTypes.SELECT_VERBS:
      return setVerbsSelected(state);
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