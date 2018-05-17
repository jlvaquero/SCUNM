import React from "react";
import { connect } from "react-redux";
import { selectVerbElto } from "../../actions/actions";

class VerbMenuElement extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.selectVerbElto();
  }

  render() {
    return (
      <li onClick={this.handleClick}>
        Verbs
      </li>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectVerbElto: () => dispatch(selectVerbElto())
  };
};

const VerbMenuElmnt = connect(null, mapDispatchToProps)(VerbMenuElement);
export default VerbMenuElmnt;