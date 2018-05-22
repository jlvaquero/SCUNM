import React from "react";
import { connect } from "react-redux";
import { setMeta } from "../../actions/actions";

class MetaEditorComponent extends React.Component {
  get displayName() { return 'MetaEditorComponent'; }

  constructor(props) {
    super(props);
    this.state = {
      gameName: this.props.meta.gameName,
      description: this.props.meta.description,
      author: this.props.meta.author
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.props.setMeta({
      gameName: this.state.gameName,
      description: this.state.description,
      author: this.state.author
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1>Game Metadata</h1>
        <label htmlFor="gameName">
          Game Name:
        <input
            name="gameName"
            id="gameName"
            value={this.state.gameName}
            type="text"
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label htmlFor="description">
          Description:
        <input
            name="description"
            id="description"
            value={this.state.description}
            type="text"
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label htmlFor="author" >
          Author:
        <input
            name="author"
            id="author"
            value={this.state.author}
            type="text"
            onChange={this.handleChange}
          />
        </label>
      </ React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMeta: meta => dispatch(setMeta(meta))
  };
};

const mapStateToProps = state => {
  return { meta: state.meta };
};

const MetaEditor = connect(mapStateToProps, mapDispatchToProps)(MetaEditorComponent);
export default MetaEditor;