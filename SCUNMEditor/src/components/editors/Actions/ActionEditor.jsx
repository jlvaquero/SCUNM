import React from "react";
import ActionForm from "./ActionForm";
import ActionList from "./ActionList"

class ActionEditorComponent extends React.Component {
  
  constructor(props) {
    super(props);
  }

  get displayName() { return 'ActionEditorComponent'; }

  render() {
    return (
      <div className="column-center">
        <h1>Game Actions</h1>
        <ActionForm />
        <ActionList />
     </div>
    );
  }
}

const ActionEditor = ActionEditorComponent;
export default ActionEditor;