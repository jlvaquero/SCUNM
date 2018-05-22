import React from "react";
import { connect } from "react-redux";
import VerbForm from "./VerbForm";
import VerbList from "./VerbList";

class VerbEditorComponent extends React.Component {
	get displayName() { return 'VerbEditorComponent'; }

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<h1>Game Verbs</h1>
				<VerbForm />
				<VerbList />
			</React.Fragment >
		);
	}
}

const VerbEditor = VerbEditorComponent;
export default VerbEditor;