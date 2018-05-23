export const META_GAME_ELTO = 'meta';
export const VERB_GAME_ELTO = 'verb';
export const ACTION_GAME_ELTO = 'action';

export class State {  //honoring gamedata file format as close as possible will alows JSONfn to stringfy most (if not all) of gamedata file just in one command.
	//but not flat state makes inmutable a little bit harder...
	constructor() {
		this.selectedGameElto = META_GAME_ELTO;
		this.selectedActionElto = "";
		this.gameData = {};
		this.gameData.globalResources = {};
		this.gameData.meta = {
			gameName: "new game",
			author: "put your name here",
			description: "an awesome game"
		};
		this.gameData.verbs = ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"];
		this.gameData.globalResources.actions = {};
	}
}

export const initialState = new State();