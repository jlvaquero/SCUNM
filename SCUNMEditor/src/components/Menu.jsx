import React from "react";
import MetaMenu from "./menu/MetaMenu";
import VerbMenu from "./menu/VerbMenu";
import ActionMenu from "./menu/ActionMenu";
import ActorMenu from "./menu/ActorsMenu";
import MenuItem from "./menu/MenuItem";
import * as actionTypes from "../reduxActions/action-types";

const Menu = () => (
	<div className="column-left">
		<ul className="menu">
      <MenuItem name="Meta" actionType={actionTypes.SELECT_META} />
      <MenuItem name="Verbs" actionType={actionTypes.SELECT_VERBS} />
      <MenuItem name="Actions" actionType={actionTypes.SELECT_ACTIONS} />
      <MenuItem name="Actors" actionType={actionTypes.SELECT_ACTORS} />
		</ul>
	</div>
);
export default Menu;