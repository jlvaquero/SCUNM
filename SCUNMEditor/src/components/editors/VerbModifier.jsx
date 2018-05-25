import React from "react";
import { connect } from "react-redux";
import { delVerb } from "../../actions/actions";

class VerbModifierComponent extends React.Component {
	get displayName() { return 'VerbModifierComponent'; }

	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index,
			value: this.props.value
		};
	}

	handleDelete(index) {
		this.props.delVerb(index);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleAccept() {
		//	this.props.modVerb(this.state.index, this.state.value);
	}

	render() {
		return (
			<React.Fragment>
				<input
					value={this.state.value}
					type="text"
					onChange={this.handleChange.bind(this)}
				/>
				<button type="button" onClick={this.handleAccept.bind(this)}>Accept</button>
				<button type="button" onClick={this.handleDelete.bind(this, this.state.index)}>Delete</button>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		delVerb: index => dispatch(delVerb(index))
	};
};

const VerbModifier = connect(null, mapDispatchToProps)(VerbModifierComponent);
export default VerbModifier;