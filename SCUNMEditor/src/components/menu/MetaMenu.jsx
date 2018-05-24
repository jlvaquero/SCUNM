import React from "react";
import { connect } from "react-redux";
import { selectMetaElto } from "../../actions/actions";

class MetaMenuElement extends React.Component {
	get displayName() { return 'MetaMenuElement'; }

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		this.props.selectMetaElto();
	}

	render() {
		return (
			<li className="menu" onClick={this.handleClick}>
				Meta
      </li>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectMetaElto: () => dispatch(selectMetaElto())
	};
};

const MetaMenuElmnt = connect(null, mapDispatchToProps)(MetaMenuElement);
export default MetaMenuElmnt;