import React from "react";
import { connect } from "react-redux";

class ActionEditorComponent extends React.Component {
	get displayName() { return 'ActionEditorComponent'; }

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{"this is action editor"}
			</div>
		);
	}
}

const ActionEditor = ActionEditorComponent;
export default ActionEditor;