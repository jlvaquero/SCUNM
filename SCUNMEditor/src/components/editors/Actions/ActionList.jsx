import React from "react";
import { connect } from "react-redux";
import ActionModifier from "./ActionModifier";
import ActionItem from "./ActionItem";

class ActionListComponent extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			editAction: ""
		};
	}

  get displayName() { return 'ActionListComponent'; }

	handleClick(name) {
		this.setState({ editAction: name });
	}

	resetEditAction() {
		this.setState({ editAction: "" });
	}

	render() {
		return (
			<ul>
				{Object.keys(this.props.actions).map((name, _) => {
					let outPut;
					if (name !== this.state.editAction) {
						outPut = (
							<div className="action" key={name} onClick={this.handleClick.bind(this, name)}>
                <ActionItem actionName={name} actionData={this.props.actions[name]} />
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