import React from "react";
import { connect } from "react-redux";
import { setMeta } from "../../actions/actions";

class MetaEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setMeta(meta);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Game Name:
        <input
            value={this.props.meta.gameName}
            type="text"
            ref={(input) => this.inputName = input} />
        </label>
        <label>
          Description:
        <input
            value={this.props.meta.description}
            type="text"
            ref={(input) => this.inputDescription = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMeta: () => dispatch(selectMetaElto())
  };
};

const mapStateToProps = state => {
  return { meta: state.meta };
};

const MetaMenuElmnt = connect(mapStateToProps, mapDispatchToProps)(MetaMenuElement);
export default MetaMenuElmnt;