import * as actionTypes from "../actions/action-types";
import * as appState from "../state/State";
import update from 'immutability-helper';

const rootReducer = (state = appState.initialState, action) => {
	switch (action.type) {
		case actionTypes.SELECT_META:
			return setMetaSelected(state);
		case actionTypes.SELECT_VERBS:
			return setVerbsSelected(state);
		case actionTypes.SELECT_ACTIONS:
			return setActionsSelected(state);
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
	//return Object.assign({}, state, { selectedGameElto: appState.VERB_GAME_ELTO });
	return update(state, { selectedGameElto: { $set: appState.VERB_GAME_ELTO } });
}

function setMetaSelected(state) {
	//return Object.assign({}, state, { selectedGameElto: appState.META_GAME_ELTO });
	return update(state, { selectedGameElto: { $set: appState.META_GAME_ELTO } });
}

function setActionsSelected(state) {
	//return Object.assign({}, state, { selectedGameElto: appState.ACTION_GAME_ELTO });
	return update(state, { selectedGameElto: { $set: appState.ACTION_GAME_ELTO } });
}

function setMetaInfo(state, action) {
	const newMeta = action.payload;
	//return Object.assign({}, state, { gameData: { meta: newMeta } });
	return update(state, { gameData: { meta: { $set: newMeta } } });
}

function setNewVerb(state, action) {
	const newVerb = action.payload;
	//return Object.assign({}, state, { gameData: { verbs: [].concat(state.gameData.verbs, newVerb) } });
	return update(state, { gameData: { verbs: { $push: [newVerb] } } });
}

function deleteVerb(state, action) {
	const index = action.payload;
	//	return Object.assign({}, state, { gameData: { verbs: state.gameData.verbs.slice(0, index).concat(state.gameData.verbs.slice(index + 1)) } });
	return update(state, { gameData: { verbs: { $splice: [[index, 1]] } } });
}