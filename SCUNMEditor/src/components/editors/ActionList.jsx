import React from "react";
import { connect } from "react-redux";

class ActionListComponent extends React.Component {
	get displayName() { return 'ActionListComponent'; }

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ul>
				{Object.keys(this.props.actions).map((name, index) => (
					<React.Fragment key="{name}">
						<li value={name}>{name}</li>
						<ul className="action" value={name}>
							<li>{this.props.actions[name].description}</li>
							<li>{this.props.actions[name].image}</li>
							{this.props.actions[name].image &&
								<li>
									<img src={this.props.actions[name].image} height="100px" width="100px"></img>
								</li>
							}
						</ul>
					</React.Fragment>
				))}
			</ul>

		);
	}
}

const mapStateToProps = state => {
	return { actions: state.gameData.globalResources.actions };
};

const ActionList = connect(mapStateToProps)(ActionListComponent);
export default ActionList;