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
			return setMetaInfo(state, action.payload);
		case actionTypes.SET_VERB:
			return setNewVerb(state, action.payload);
		case actionTypes.DEL_VERB:
			return deleteVerb(state, action.payload);
		case actionTypes.SET_ACTION:
			return setNewAction(state, action.payload);
		case actionTypes.DEL_ACTION:
			return deleteAction(state, action.payload);
		case actionTypes.MOD_VERB:
			return modifyVerb(state, action.payload);
		default:
			return state;
	}
};
export default rootReducer;

function setVerbsSelected(state) {
	return update(state, { selectedGameElto: { $set: appState.VERB_GAME_ELTO } });
}

function setMetaSelected(state) {
	return update(state, { selectedGameElto: { $set: appState.META_GAME_ELTO } });
}

function setActionsSelected(state) {
	return update(state, { selectedGameElto: { $set: appState.ACTION_GAME_ELTO } });
}

function setMetaInfo(state, newMeta) {
	return update(state, { gameData: { meta: { $set: newMeta } } });
}

function setNewVerb(state, newVerb) {
	return update(state, { gameData: { verbs: { $push: [newVerb] } } });
}

function deleteVerb(state, index) {
	return update(state, { gameData: { verbs: { $splice: [[index, 1]] } } });
}

function setNewAction(state, newAction) {
	const actionName = newAction.name;
	const actionData = {
		description: newAction.description,
		image: newAction.image
	};
	//create property dinamicaly
	return update(state, { gameData: { globalResources: { actions: { [actionName]: { $set: actionData } } } } });
}

function deleteAction(state, actionName) {
	return update(state, { gameData: { globalResources: { actions: { $unset: [actionName] } } } });
}

function modifyVerb(state, modifyData) {
	return update(state, { gameData: { verbs: { $splice: [[modifyData.index, 1, modifyData.newValue]] } } });
}