import React from "react";
import MetaMenu from "./menu/MetaMenu";
import VerbMenu from "./menu/VerbMenu";
import ActionMenu from "./menu/ActionMenu";

const Menu = () => (
	<div className="column-left">
		<ul>
			<MetaMenu />
			<VerbMenu />
			<ActionMenu />
		</ul>
	</div>
);
export default Menu;