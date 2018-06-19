export const META_GAME_ELTO = 'meta';
export const VERB_GAME_ELTO = 'verb';
export const ACTION_GAME_ELTO = 'action';
export const ACTOR_GAME_ELTO = 'actor';

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
		this.gameData.globalResources.actions = {
			tentacleDance: {
				description: "The tentacle is happy now and he start dancing",
				image: "https://cdn.weasyl.com/static/media/5c/5b/cd/5c5bcd54c73d0e2aa76e89108e0a9740b02dcadc8b1006cc5dafebfe75b38665.gif"
			},
		};
	}
}

export const initialState = new State();