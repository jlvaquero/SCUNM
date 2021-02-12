import React from "react";
import { connect } from "react-redux";

class ActionItemComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  get displayName() { return 'ActionItemComponent'; }

  render() {
    return (
      <div className="action" onClick={this.props.onChildClick}>
       <li>{name}</li>
        <ul className="action">
          <li>{this.props.actionName}</li>
          <li>{this.props.actionData.description}</li>
          <li>{this.props.actionData.image}</li>
          {this.props.actionData.image &&
             <li>
            <img src={this.props.actionData.image} className="action" />
             </li>
           }
        </ul>
       </div>
    );
  }
}

const mapStateToProps = state => {
  return {  };
};

const ActionItem = connect(mapStateToProps)(ActionItemComponent);
export default ActionItem;
