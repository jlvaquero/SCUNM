import React from "react";
import { connect } from "react-redux";
import VerbForm from "./VerbForm";
import { delVerb } from "../../actions/actions";

class VerbListComponent extends React.Component {
	get displayName() { return 'VerbListComponent'; }

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		const index = event.target.value;
		this.props.delVerb(index);
	}

	render() {
		return (
			<ul >
				{this.props.verbs.map((verb, index) => (
					<li
						key={index}
						value={index}
						onClick={this.handleClick}>
						{verb}
					</li>
				))}
			</ul>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		delVerb: index => dispatch(delVerb(index))
	};
};

const mapStateToProps = state => {
	return { verbs: state.verbs };
};

const VerbList = connect(mapStateToProps, mapDispatchToProps)(VerbListComponent);
export default VerbList;