import React from "react";
import { connect } from "react-redux";
import { delVerb } from "../../actions/actions";

class VerbListComponent extends React.Component {
	get displayName() { return 'VerbListComponent'; }

	constructor(props) {
		super(props);
	}

	handleClick(index) {
		this.props.delVerb(index);
	}

	render() {
		return (
			<ul className="verb" >
				{this.props.verbs.map((verb, index) => (
					<li
						key={index}
						className="verb"
						onClick={this.handleClick.bind(this, index)}>
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
	return { verbs: state.gameData.verbs };
};

const VerbList = connect(mapStateToProps, mapDispatchToProps)(VerbListComponent);
export default VerbList;