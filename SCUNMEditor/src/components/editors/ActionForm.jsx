import React from "react";
import { connect } from "react-redux";
import { setAction } from "../../actions/actions";

class ActionFormComponent extends React.Component {
	get displayName() { return 'ActionFormComponent'; }

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			name: "Action name here",
			description: "Description to show ",
			image: "image URL"
		};
	}

	handleChange(event) {
		const { name, value } = event.target;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.setAction(this.state);
		this.setState({
			name: "Action name here",
			description: "Description to show ",
			image: "image URL"
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label htmlFor="name">Action Name:
						<input
						name="name"
						id="name"
						value={this.state.name}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<br />
				<label htmlFor="name">Action Description:
						<input
						name="description"
						id="description"
						value={this.state.description}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<br />
				<label htmlFor="name">Action Image:
						<input
						name="image"
						id="image"
						value={this.state.image}
						type="text"
						onChange={this.handleChange}
					/>
				</label>
				<button type="submit">
					Add Action
				</button>
			</form>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setAction: action => dispatch(setAction(action))
	};
};

const ActionForm = connect(null, mapDispatchToProps)(ActionFormComponent);
export default ActionForm;