import React from "react";
import { connect } from "react-redux";
import * as appState from "../state/State";
import MetaEditor from "./editors/MetaEditor";
import VerbEditor from "./editors/VerbEditor";
import ActionEditor from "./editors/ActionEditor";

class EditionWindowManager extends React.Component {
	get displayName() { return 'EditionWindowManager'; }

	constructor(props) {
		super(props);
	}

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
		}

		return (
			<div className="column-center">
				{editorToShow}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { selectedGameElto: state.selectedGameElto };
};

const EditorWindow = connect(mapStateToProps)(EditionWindowManager);
export default EditorWindow;