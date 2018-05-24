import React from "react";
import ActionForm from "./ActionForm";
import ActionList from "./ActionList"

class ActionEditorComponent extends React.Component {
	get displayName() { return 'ActionEditorComponent'; }

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<h1>Game Actions</h1>
				<ActionForm />
				<ActionList />
			</React.Fragment >
		);
	}
}

const ActionEditor = ActionEditorComponent;
export default ActionEditor;