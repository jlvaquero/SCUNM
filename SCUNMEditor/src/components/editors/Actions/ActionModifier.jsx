import React from "react";
import { connect } from "react-redux";
import { delAction } from "../../../reduxActions/actions";
import { modAction } from "../../../reduxActions/actions";

class ActionModifierComponent extends React.Component {
	get displayName() { return 'ActionModifierComponent'; }

	constructor(props) {
		super(props);
		this.state = {
			name: this.props.name,
			description: this.props.value.description,
			image: this.props.value.image
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleAccept = this.handleAccept.bind(this);
	}

	handleDelete(index) {
		this.props.delAction(this.props.name);
		this.props.notifyChange();
	}

	handleChange(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value
		});
	}

	handleAccept(event) {
		event.preventDefault();
		if (this.state.name) { this.props.modAction(this.props.name, this.state); }
		else { this.props.delAction(this.props.name); }
		this.props.notifyChange();
	}

	render() {
		return (
			<form onSubmit={this.handleAccept}>
				<label htmlFor="name">
					Action Name:
				<input
						name="name"
						value={this.state.name}
						type="text"
						onChange={this.handleChange}
						autoFocus
					/>
				</label>
				<br />
				<label htmlFor="description">
					Action description:
				<input
						name="description"
						value={this.state.description}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<br />
				<label htmlFor="image">
					Action image:
				<input
						name="image"
						value={this.state.image}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<br />
				<button type="submit">Accept</button>
				<br />
				<button type="button" onClick={this.handleDelete.bind(this, this.props.name)}>Delete</button>
			</form>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		delAction: actionName => dispatch(delAction(actionName)),
		modAction: (actionName, actionData) => dispatch(modAction(actionName, actionData))
	};
};

const ActionModifier = connect(null, mapDispatchToProps)(ActionModifierComponent);
export default ActionModifier;