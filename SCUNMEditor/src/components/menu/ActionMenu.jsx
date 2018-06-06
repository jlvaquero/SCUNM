import React from "react";
import { connect } from "react-redux";
import { selectActionElto } from "../../reduxActions/actions";

class ActionMenuElement extends React.Component {
	get displayName() { return 'ActionMenuElement'; }

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		this.props.selectActionElto();
	}

	render() {
		return (
			<li className="menu" onClick={this.handleClick}>
				Actions
      </li>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectActionElto: () => dispatch(selectActionElto())
	};
};

const ActionMenuElmnt = connect(null, mapDispatchToProps)(ActionMenuElement);
export default ActionMenuElmnt;