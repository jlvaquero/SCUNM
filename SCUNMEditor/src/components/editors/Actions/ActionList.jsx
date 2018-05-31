import React from "react";
import { connect } from "react-redux";
import ActionModifier from "./ActionModifier";

class ActionListComponent extends React.Component {
	get displayName() { return 'ActionListComponent'; }

	constructor(props) {
		super(props);
		this.state = {
			editAction: ""
		};
	}

	handleClick(name) {
		this.setState({ editAction: name });
	}

	resetEditAction() {
		this.setState({ editAction: "" });
	}

	render() {
		return (
			<ul>
				{Object.keys(this.props.actions).map((name, index) => {
					let outPut;
					if (name != this.state.editAction) {
						outPut = (
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
						);
					}
					else {
						outPut = (
							<ActionModifier key={name} name={name} value={this.props.actions[name]} notifyChange={this.resetEditAction.bind(this)} />
						);
					}
					return outPut;
				})}
			</ul>
		);
	}
}

const mapStateToProps = state => {
	return { actions: state.gameData.globalResources.actions };
};

const ActionList = connect(mapStateToProps)(ActionListComponent);
export default ActionList;