import React from "react";
import { connect } from "react-redux";
import { delVerb } from "../../../reduxActions/actions";
import { modVerb } from "../../../reduxActions/actions";

class VerbModifierComponent extends React.Component {
	get displayName() { return 'VerbModifierComponent'; }

	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index,
			value: this.props.value
		};
	}

	handleDelete() {
		this.props.delVerb(this.state.index);
		this.props.notifyChange();
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleAccept() {
		if (this.state.value) { this.props.modVerb(this.state.index, this.state.value); }
		else { this.props.delVerb(this.state.index); }
		this.props.notifyChange();
	}

	render() {
		return (
			<React.Fragment>
				<input
					value={this.state.value}
					type="text"
					onChange={this.handleChange.bind(this)}
					autoFocus
				/>
				<button type="button" onClick={this.handleAccept.bind(this)}>Accept</button>
				<button type="button" onClick={this.handleDelete.bind(this)}>Delete</button>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		delVerb: index => dispatch(delVerb(index)),
		modVerb: (index, newValue) => dispatch(modVerb(index, newValue))
	};
};

const VerbModifier = connect(null, mapDispatchToProps)(VerbModifierComponent);
export default VerbModifier;