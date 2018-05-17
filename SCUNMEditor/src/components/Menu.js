import React from "react";
import MetaMenu from "./menu/MetaMenu";
import VerbMenu from "./menu/VerbMenu";

const Menu = () => (
  <div className="column-left">
    <ul>
      <MetaMenu />
      <VerbMenu />
    </ul>
  </div>
);
export default Menu;