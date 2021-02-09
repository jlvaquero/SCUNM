import React from "react";
import { connect } from "react-redux";

class ActionItemComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      actionData : props.data
    };
  }

  get displayName() { return 'ActionItemComponent'; }

  render() {
    return (
      <React.Fragment>
       <li>{name}</li>
       <ul className="action">
           <li>{this.props.actionData.description}</li>
           <li>{this.props.actionData.image}</li>
           {this.props.actionData.image &&
             <li>
            <img src={this.props.actionData.image} className="action" />
             </li>
           }
        </ul>
       </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {  };
};

const ActionItem = connect(mapStateToProps)(ActionItemComponent);
export default ActionItem;
