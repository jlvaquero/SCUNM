import React from "react";
import { connect } from "react-redux";
import { selectActorElto } from "../../reduxActions/actions";

class ActorMenuElement extends React.Component {
	get displayName() { return 'ActorMenuElement'; }

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		this.props.selectActorElto();
	}

	render() {
		return (
			<li className="menu" onClick={this.handleClick}>
				Actors
      </li>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectActorElto: () => dispatch(selectActorElto())
	};
};

const ActorMenu = connect(null, mapDispatchToProps)(ActorMenuElement);
export default ActorMenu;