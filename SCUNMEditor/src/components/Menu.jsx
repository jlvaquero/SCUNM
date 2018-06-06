import React from "react";
import MetaMenu from "./menu/MetaMenu";
import VerbMenu from "./menu/VerbMenu";
import ActionMenu from "./menu/ActionMenu";
import ActorMenu from "./menu/ActorsMenu";

const Menu = () => (
	<div className="column-left">
		<ul className="menu">
			<MetaMenu />
			<VerbMenu />
			<ActionMenu />
			<ActorMenu />
		</ul>
	</div>
);
export default Menu;