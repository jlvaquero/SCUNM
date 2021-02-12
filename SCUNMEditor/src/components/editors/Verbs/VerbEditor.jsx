import React from "react";
import VerbForm from "./VerbForm";
import VerbList from "./VerbList";

class VerbEditorComponent extends React.Component {
	get displayName() { return 'VerbEditorComponent'; }

	constructor(props) {
		super(props);
	}

	render() {
		return (
      <div className="column-center">
				<h1>Game Verbs</h1>
				<VerbForm />
				<VerbList />
			</div>
		);
	}
}

const VerbEditor = VerbEditorComponent;
export default VerbEditor;