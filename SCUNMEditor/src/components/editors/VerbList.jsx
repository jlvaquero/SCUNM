import React from "react";
import { connect } from "react-redux";
import VerbModifier from "./VerbModifier";

class VerbListComponent extends React.Component {
	get displayName() { return 'VerbListComponent'; }

	constructor(props) {
		super(props);
		this.state = {
			editIndex: -1
		};
	}

	handleModifySelection(index, value) {
		this.setState({ editIndex: index });
	}

	render() {
		return (
			<ul className="verb" >
				{this.props.verbs.map((verb, index) => {
					let outPut;
					if (index != this.state.editIndex) {
						outPut = (
							<li
								key={index}
								className="verb"
								onClick={this.handleModifySelection.bind(this, index, verb)}>
								{verb}
							</li>
						);
					}
					else {
						outPut = (
							<VerbModifier key={index} index={index} value={verb} />
						);
					}
					return outPut;
				})}
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