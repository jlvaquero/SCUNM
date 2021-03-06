﻿import React from "react";
import { connect } from "react-redux";
import * as appState from "../state/State";
import MetaEditor from "./editors/Meta/MetaEditor";
import VerbEditor from "./editors/Verbs/VerbEditor";
import ActionEditor from "./editors/Actions/ActionEditor";
import ActorsEditor from "./editors/Actors/ActorsEditor";

class EditionWindowManager extends React.Component {
	
	constructor(props) {
		super(props);
  }

  get displayName() { return 'EditionWindowManager'; }

	render() {
		let editorToShow;
		switch (this.props.selectedGameElto) {
			case appState.META_GAME_ELTO:
				editorToShow = (<MetaEditor />);
				break;
			case appState.VERB_GAME_ELTO:
				editorToShow = (<VerbEditor />);
				break;
			case appState.ACTION_GAME_ELTO:
				editorToShow = (<ActionEditor />);
				break;
			case appState.ACTOR_GAME_ELTO:
				editorToShow = (<ActorsEditor />);
				break;

		}
		return (
				editorToShow
		);
	}
}

const mapStateToProps = state => {
	return { selectedGameElto: state.selectedGameElto };
};

const EditorWindow = connect(mapStateToProps)(EditionWindowManager);
export default EditorWindow;