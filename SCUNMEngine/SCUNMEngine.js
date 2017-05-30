module.exports = function (assets) {

	injectGameAPI(assets);//inject functions to be used by developers scritps in the game
	initVerbsCommands(assets);//create command handlers that exec game scripts in order and default verb behaviour
	initGame(assets); //initialize rooms and actors identifiers and its state

	var engine = {};

	var stateChangedHandler = {
		set: function (target, key, value) {
			target[key] = value;
			engine.updatedState = true;
		},
		get: function(target, key) {
			if (typeof target[key] === 'object' && target[key] !== null) {
				return new Proxy(target[key], stateChangedHandler);
			} else {
				return target[key];
			}
		}
	};

	engine.initialState = JSON.parse(JSON.stringify(assets.state));
	assets.state = new Proxy(assets.state, stateChangedHandler);
	//engine.initialState = assets.state;
	
	engine.continue = function () {
		return assets.outPutCreateFromCurrentRoom();
	};
	
	engine.execCommand = function (verb, dObject, iObject) {
		engine.updatedState = false;
		outPut = assets.globalCommands[verb] ? assets.globalCommands[verb].call(assets, dObject, iObject) : { text: "What? Try again..." };
		return outPut;
	};
	engine.name = function () { return assets.meta.name; };
	engine.setState = function (state) {
		assets.state = new Proxy(state, stateChangedHandler);
	}; //assets will be in memory always, restore user "savegame" on every request
	engine.getState = function () { return assets.state; }; //retrieve "savegame" to persist it
	engine.verbs = ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"]; //needed to be retrieved by telegram bot and show custom keyboard
	engine.reset = function () { this.setState(this.initialState);  };
	
	return engine;
};

function injectGameAPI(game) {
	//get the room where the player is
	game.roomGetCurrent = function () {
		return this.roomGet(this.state.currentRoom);
	};
	//move player to room
	game.roomSetCurrent = function (destRoomId) {
		this.state.currentRoom = destRoomId;
	};
	//get any room given its ID. Returns static assets and current state in one object
	game.roomGet = function (roomId) {
		var room = this.rooms[roomId];
		room.state = this.state.rooms[roomId];
		return room;
	};
	//get actor from current room given its id. Returns static assets and current state in one object
	game.actorGetFromCurrentRoom = function (actorId) {
		var actor = this.roomGetCurrent().actors[actorId];
		if (!actor) return;
		actor.state = this.state.actors[actorId];
		return actor;
	};
	//get actor from inventory given its id.
	game.actorGetFromInventory = function (itemId) {
		if (!this.state.inventory.hasOwnProperty(itemId)) return null;
		return actorGetFromGlobal[itemId];
	};
		//get actor from global actor pool given its id. Returns static assets and current state in one object
	game.actorGetFromGlobal = function (actorId) {
		var actor = this.globalResources.actors[actorId];
		actor.state = this.state.actors[actorId];
		return actor;
	};
	//create custom outPut
	game.outPutCreateRaw = function (text, imgURL, selection) {
		var outPut = new Object();
		outPut.text = text;
		if (imgURL) outPut.imgURL = imgURL;
		if (selection) {
			outPut.selection = { command: selection.command, list: selection.list };
		}
		return outPut;
	};
	//create standard room outPut
	game.outPutCreateFromRoom = function (room) {
		var text = room.descriptions[room.state.descriptionIndex];
		var imgURL = room.images[room.state.imageIndex];
		return this.outPutCreateRaw(text, imgURL);
	};
	//create standard room outPut from room where the player is
	game.outPutCreateFromCurrentRoom = function () {
		return this.outPutCreateFromRoom(this.roomGetCurrent());
	};
	//create standard actor outPut
	game.outPutCreateFromActor = function (actor) {
		var text = actor.descriptions[actor.state.descriptionIndex];
		var imgURL = actor.images[actor.state.imageIndex];
		return this.outPutCreateRaw(text, imgURL);
	};
	//create standard outPut with the list of actors in a room. Filters invisible and removed actor (player can not interact with that)
	game.outPutCreateFromRoomActors = function (text, command, showInventory) {
		var currentGame = this;
		var room = this.roomGetCurrent();
		var list = Object.keys(room.actors).filter(function (id) {
			var actor = currentGame.actorGetFromCurrentRoom(id);
			return actor.state.visible && !actor.state.removed;
		}).map(function (id) {
			var item = game.actorGetFromCurrentRoom(id);
			return { id: id, name: item.name };
		});
		if (showInventory) list.push({ id: "inventory", name: "inventory" });
		return this.outPutCreateRaw(text, null, { command: command, list: list });
	};
	//create standard outPut with the list of actors in the inventory.
	game.outPutCreateFromInventory = function (text, command) {
		var game = this;
		var list = Object.keys(this.state.inventory).map(function (id) {
			var item = game.actorGetFromInventory(id);
			return { id: id, name: item.name };
		});
		return this.outPutCreateRaw(text, null, { command: command, list: list });
	};
	//create standard outPut with the list of exits of the room.
	game.outPutCreateFromRoomExits = function (text, command) {
		var list = Object.keys(this.rooms[this.state.currentRoom].exits).map(function (id) {
			return { id: id, name: id };
		});
		return this.outPutCreateRaw(text, null, { command: command, list: list });
	};
	//create standard outPut of an action defined in actions asset
	game.outPutCreateFromAction = function (actionName) {
		var action = this.globalResources.actions[actionName];
		return this.outPutCreateRaw(action.description, action.image);
	};
	//add an actor from global actor pool to the inventory. Use the linked inventory actor definded in source actor
	game.inventoryAddItem = function (item) {
		item = this.actorGetFromGlobal(item.inventoryActor);
		this.state.inventory[item.id] = null;
	};
	//remove the item from the inventory
	game.inventoryRemoveItem = function (item) {
		delete this.state.inventory[item.id];
	};
}

function initVerbsCommands(game) {
	game.globalCommands = new Object;
//execute scripts chain, stop on any script returning	outPut or exec default behaviour if not
	game.globalCommands.go = function (direction) {

		if (!direction) return this.outPutCreateFromRoomExits("Where to?", "go");//output list of directions

		var destRoom = this.roomGetCurrent().exits[direction];
		if (!destRoom) return this.outPutCreateRaw("No way to go...");

		var outPut = this["go"] ? this.go(direction) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["go"] ? room.go(this, direction) : null;
		if (outPut) return outPut;

		//default behaviour
		this.roomSetCurrent(destRoom);
		return this.outPutCreateFromRoom(this.roomGetCurrent());
	};
	//hidden verb to interact with inventory
	game.globalCommands.inspect = function (itemId) {
		var item = this.actorGetFromInventory(itemId);
		if (!item) return this.outPutCreateRaw("I can not find that in my inventory");
		if (item) return this.outPutCreateFromActor(item);
	};
	//outPut inventory items
	game.globalCommands.inventory = function () {
		return this.outPutCreateFromInventory("This is what you got:", "inspect");
	};

	game.globalCommands.use = function (firstActorId, secondActorId) {
		if (!firstActorId) return this.outPutCreateFromRoomActors("Use what?", "use", true);

		if (firstActorId === "inventory") { return this.outPutCreateFromInventory("Use what?", "use"); }

		var firstActor = this.actorGetFromCurrentRoom(firstActorId) || this.actorGetFromInventory(firstActorId);

		if (firstActor && !firstActor.state.removed && firstActor.state.visible) {
			var outPut = this["use"] ? this["use"](firstActor) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["use"] ? room.use(this, firstActor) : null;
			if (outPut) return outPut;

			outPut = firstActor["use"] ? firstActor.use(this) : null;
			if (outPut) return outPut;

			if (!secondActorId) return this.outPutCreateFromRoomActors("Use " + firstActor.name + " with what?", "use " + firstActor.name, true);

			if (secondActorId === "inventory") { return this.outPutCreateFromInventory("Use " + firstActor.name + " with what?", "use " + firstActor.name); }

			var secondActor = this.actorGetFromCurrentRoom(secondActorId) || this.actorGetFromInventory(secondActorId);

			if (secondActor && !secondActor.state.removed && secondActor.state.visible) {
				outPut = this["use"] ? this["use"](firstActor, secondActor) : null;
				if (outPut) return outPut;

				room = this.roomGetCurrent();
				outPut = room["use"] ? room.use(this, firstActor, secondActor) : null;
				if (outPut) return outPut;

				outPut = firstActor["use"] ? firstActor.use(this, secondActor) : null;
				if (outPut) return outPut;

				return this.outPutCreateRaw("It does not work.");
			}
		}

		return this.outPutCreateRaw("I can not use that.");
	};

	game.globalCommands.give = function (firstActorId, secondActorId) {
		if (!firstActorId) return this.outPutCreateFromInventory("Give what?", "give");

		var firstActor = this.actorGetFromInventory(firstActorId);

		if (firstActor) {

			if (!secondActorId) return this.outPutCreateFromRoomActors("Give " + firstActor.name + " to...", "give " + firstActor.name);

			var secondActor = this.actorGetFromCurrentRoom(secondActorId);

			if (secondActor && !secondActor.state.removed && secondActor.state.visible) {
				outPut = this["give"] ? this["give"](firstActor, secondActor) : null;
				if (outPut) return outPut;

				room = this.roomGetCurrent();
				outPut = room["give"] ? room.use(this, firstActor, secondActor) : null;
				if (outPut) return outPut;

				outPut = firstActor["give"] ? firstActor.give(this, secondActor) : null;
				if (outPut) return outPut;

				return this.outPutCreateRaw("I can not give that.");
			}
		}

		return this.outPutCreateRaw("I can not give that.");
	};

	game.globalCommands["look at"] = function (actorId) {

		if (!actorId) return this.outPutCreateFromRoomActors("Look at what?", "look at"); // ouput list of actors
		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not see that.");
		if (!actor.state.visible || actor.state.removed) return this.outPutCreateRaw("You can not see that.");

		var outPut = this["look at"] ? this["look at"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["look at"] ? room["look at"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["look at"] ? actor["look at"](this) : null;
		if (outPut) return outPut;

		//default behaviour
			return this.outPutCreateFromActor(actor);
	};

	game.globalCommands["talk to"] = function (actorId) {
		if (!actorId) return this.outPutCreateFromRoomActors("talk to what?", "look at"); // ouput list of actors
		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not talk to that.");
		if (!actor.state.visible || actor.state.removed) return this.outPutCreateRaw("You can not talk to that.");

		var outPut = this["talk to"] ? this["talk to"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["talk to"] ? room["talk to"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["talk to"] ? actor["talk to"](this) : null;
		if (outPut) return outPut;

		//default behaviour
			return this.outPutCreateRaw("You can not talk to that");
	};

	game.globalCommands.open = function (actorId) {
		if(!actorId) return this.outPutCreateFromRoomActors("Open what?", "open"); // ouput list of actors

		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not open that.");

		var outPut = this["open"] ? this["open"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["open"] ? room["open"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["open"] ? actor["open"](this) : null;
		if (outPut) return outPut;

		return this.outPutCreateRaw("It can not be opened.");

	};

	game.globalCommands.close = function (actorId) {
		if (!actorId) return this.outPutCreateFromRoomActors("Close what?", "close"); // ouput list of actors

		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not close that.");

		var outPut = this["close"] ? this["close"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["close"] ? room["close"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["close"] ? actor["close"](this) : null;
		if (outPut) return outPut;

		return this.outPutCreateRaw("It can not be closed.");

	};

	game.globalCommands.push = function (actorId) {
		if (!actorId) return this.outPutCreateFromRoomActors("Push what?", "push"); // ouput list of actors

		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not push that.");

		var outPut = this["push"] ? this["push"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["push"] ? room["push"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["push"] ? actor["push"](this) : null;
		if (outPut) return outPut;

		return this.outPutCreateRaw("I can not push that.");

	};

	game.globalCommands.pull = function (actorId) {
		if (!actorId) return this.outPutCreateFromRoomActors("Push what?", "pull"); // ouput list of actors

		var actor = this.actorGetFromCurrentRoom(actorId);
		if (!actor) return this.outPutCreateRaw("You can not pull that.");

		var outPut = this["pull"] ? this["pull"](actor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["pull"] ? room["pull"](this, actor) : null;
		if (outPut) return outPut;

		outPut = actor["pull"] ? actor["pull"](this) : null;
		if (outPut) return outPut;

		return this.outPutCreateRaw("I can not pull that.");

	};

	game.globalCommands["pick up"] = function (actorId) {
		{
			if (!actorId) return this.outPutCreateFromRoomActors("Pick up what?", "pick up"); //output list of actors in the room

			var actor = this.actorGetFromCurrentRoom(actorId);
			if (!actor) return this.outPutCreateRaw("Nothing to pick up.");

			var outPut = this["pick up"] ? this["pick up"](actor) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["pick up"] ? room["pick up"](this, actor) : null;
			if (outPut) return outPut;

			outPut = actor["pick up"] ? actor["pick up"](this) : null;
			if (outPut) return outPut;

			//default behaviour
			if (!actor.state.visible || actor.state.removed) return this.outPutCreateRaw("Nothing to pick up.");
			if (!actor.state.collectible) return this.outPutCreateRaw("You can not pick up that ");
			this.inventoryAddItem(actor);
			actor.state.removed = true;
			return this.outPutCreateRaw("You picked up " + actor.name);
		}
	};

}

function initGame(game) {
	initIDs(game);
	initState(game);
}
//initialize rooms and actors ID's
function initIDs(game) {
	var actorID;
	for (actorID in game.globalResources.actors) {
		game.globalResources.actors[actorID].id = actorID;
	}
	for (var roomName in game.rooms) {
		game.rooms[roomName].id = roomName;
		for (actorID in game.rooms[roomName].actors) {
			game.rooms[roomName].actors[actorID].id = actorID;
		}
	}
}
//initialize rooms and actors state. Create default states when needed.
function initState(game) {
	if (!game.state.inventory) game.state.inventory = new Object();
	if (!game.state.rooms) game.state.rooms = new Object();
	if (!game.state.player) game.state.player = new Object();
	if (!game.state.actors) game.state.actors = new Object();
	var currentActorState;
	var defaultActorState;
	var actorName;
	for (actorName in game.globalResources.actors) {
		currentActorState = game.state.actors[actorName];
		defaultActorState = {
			descriptionIndex: 0,
			imageIndex: 0,
			visible: true,
			collectible: false,
			removed: false
		};
		if (!currentActorState) { //not exist, create it
			game.state.actors[actorName] = defaultActorState;
		}
		else { //add properties needed by the engine 
			game.state.actors[actorName] = Object.assign(defaultActorState, currentActorState);
		}

	}

	for (var roomName in game.rooms) {
		
		var currentRoomState = game.state.rooms[roomName];
		var defaultRoomState = {
			descriptionIndex: 0,
			imageIndex: 0
		};
		if (!currentRoomState) {//not exist, create it
			game.state.rooms[roomName] = defaultRoomState;
		}
		else {//add properties needed by the engine 
			game.state.rooms[roomName] = Object.assign(defaultRoomState, currentRoomState);
		}

		for (actorName in game.rooms[roomName].actors) {
			currentActorState = game.state.actors[actorName];
			defaultActorState = {
				descriptionIndex: 0,
				imageIndex: 0,
				visible: true,
				collectible: false,
				removed: false
			};
			if (!currentActorState) { //not exist, create it
				game.state.actors[actorName] = defaultActorState;
			}
			else { //add properties needed by the engine 
				game.state.actors[actorName] = Object.assign(defaultActorState, currentActorState);
			}
		}
	}
}

