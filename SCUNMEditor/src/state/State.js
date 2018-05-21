export const META_GAME_ELTO = 'meta';
export const VERB_GAME_ELTO = 'verb';

export class GameMetaData {
  constructor() {
    this.gameName = "new game";
    this.author = "put your name here";
    this.description = "an awesome game";
  }
}

export class State {
  constructor() {
    this.selectedGameElto = META_GAME_ELTO;
    this.meta = new GameMetaData();
  }
}

export const initialState = new State();