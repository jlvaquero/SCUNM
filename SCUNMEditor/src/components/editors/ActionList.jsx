import React from "react";
import { connect } from "react-redux";
import { delAction } from "../../actions/actions";

class ActionListComponent extends React.Component {
	get displayName() { return 'ActionListComponent'; }

	constructor(props) {
		super(props);
	}

	handleClick(name) {
		this.props.delAction(name);
	}

	render() {
		return (
			<ul>
				{Object.keys(this.props.actions).map((name, index) => (
					<div className="action" key={name} onClick={this.handleClick.bind(this, name)}>
						<li>{name}</li>
						<ul className="action">
							<li>{this.props.actions[name].description}</li>
							<li>{this.props.actions[name].image}</li>
							{this.props.actions[name].image &&
								<li>
									<img src={this.props.actions[name].image} className="action"></img>
								</li>
							}
						</ul>
					</div>
				))}
			</ul>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		delAction: name => dispatch(delAction(name))
	};
};

const mapStateToProps = state => {
	return { actions: state.gameData.globalResources.actions };
};

const ActionList = connect(mapStateToProps, mapDispatchToProps)(ActionListComponent);
export default ActionList;