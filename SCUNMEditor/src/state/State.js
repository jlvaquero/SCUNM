export const META_GAME_ELTO = 'meta';
export const VERB_GAME_ELTO = 'verb';

class GameMetaData {
  constructor() {
    this.gameName = "";
    this.authors = [];
    this.description = "";
  }
}

export class State {
  constructor() {
    this.selectedGameElto = META_GAME_ELTO;
    this.meta = new GameMetaData();
  }
}

export const initialState = new State();