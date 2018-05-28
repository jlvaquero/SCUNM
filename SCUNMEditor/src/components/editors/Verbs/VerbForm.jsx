import React from "react";
import { connect } from "react-redux";
import { setVerb } from "../../../actions/actions";

class VerbFormComponent extends React.Component {
	get displayName() { return 'VerbFormComponent'; }

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = { verbToAdd: "Verb name here" };
	}

	handleChange(event) {
		event.preventDefault();
		this.setState({ verbToAdd: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.setVerb(this.state.verbToAdd);
		this.setState({ verbToAdd: "Verb name here" });
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label htmlFor="verb">Verb Name:
						<input
						name="verb"
						id="verb"
						value={this.state.verbToAdd}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<button type="submit">
					Add Verb
				</button>
			</form>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setVerb: verb => dispatch(setVerb(verb))
	};
};

const VerbForm = connect(null, mapDispatchToProps)(VerbFormComponent);
export default VerbForm;