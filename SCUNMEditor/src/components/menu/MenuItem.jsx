import React from "react";
import { connect } from "react-redux";
import { selectElto } from "../../reduxActions/actions";

class MenuItemElement extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  get displayName() { return this.props.name; }

  handleClick(event) {
    event.preventDefault();
    this.props.selectActionElto(this.props.actionType);
  }

  render() {
    return (
      <li className="menu" onClick={this.handleClick}>
        {this.props.name}
      </li>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectActionElto: (actionType) => dispatch(selectElto(actionType))
  };
};

const MenuItem = connect(null, mapDispatchToProps)(MenuItemElement);
export default MenuItem;