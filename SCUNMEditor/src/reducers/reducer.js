import * as actionTypes from "../actions/action-types";

const META_GAME_ELTO = 'meta';
const VERB_GAME_ELTO = 'verb';

const initialState = {
  selectedGameElto: META_GAME_ELTO
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_META:
      return Object.assign({}, state, { selectedGameElto: META_GAME_ELTO });
    case actionTypes.SELECT_VERBS:
      return Object.assign({}, state, { selectedGameElto: VERB_GAME_ELTO });
    default:
      return state;
  }
};
export default rootReducer;