module.exports = initEngine();

function initEngine() {
	//define Engine constructor
	function Engine(assets) {
		injectGameAPI(assets);//inject functions to be used by scritps developers in the game
		initVerbsHandlers(assets);//create command handlers that exec game scripts in order and default verb behaviour
		initIDs(assets); //initialize assets IDs
		initState(assets); //initialize rooms and actors identifiers and its state
		this.initialState = CreateInitialState(assets);
		assets.state = new Proxy(assets.state, getProxyHandler(this));//proxy game state
		this.assets = assets; //keep a reference to assets
		this.verbs = this.assets.globalResources.verbs || ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"]; //needed to be retrieved by engine host and show custom keyboard
	}

	//define engine public methods and atributes
	Engine.prototype.assets = null;
	Engine.prototype.initialState = null;
	Engine.prototype.updatedState = false;
	Engine.prototype.verbs = null;

	Engine.prototype.continue = function () {
		return this.assets.outPutCreateFromCurrentRoom();
	};

	Engine.prototype.execCommand = function (verb, dObject, iObject) {
		this.updatedState = false;
		outPut = this.assets.globalCommands[verb] ? this.assets.globalCommands[verb].call(this.assets, dObject, iObject) : { text: "What? Try again..." };
		return outPut;
	};

	Engine.prototype.name = function () {
		return this.assets.meta.name;
	};

	Engine.prototype.setState = function (state) {
		this.assets.state = new Proxy(state, getProxyHandler(this));
	};

	Engine.prototype.getState = function () {
		return this.assets.state;
	};

	Engine.prototype.reset = function () {
		this.setState(this.initialState);
	};

	return Engine;
}

function getProxyHandler(engine) {
	//create proxy object to notify changes to host
	return {
		set: function (target, key, value) {
			target[key] = value;
			engine.updatedState = true;
		},
		get: function (target, key) {//proxy through state object graph
			if (typeof target[key] === 'object' && target[key] !== null) {
				return new Proxy(target[key], getProxyHandler(engine));
			} else {
				return target[key];
			}
		},
		defineProperty: function (target, property, descriptor) { //game scripts could add new states
			engine.updatedState = true;
			Reflect.defineProperty(target, property, descriptor);
			return true;
		},
		deleteProperty: function (target, prop) {//game scripts could delete states
			engine.updatedState = true;
			delete target[prop];
			return true;
		}
	};
}

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
	//get actor from any room
	game.actorGetFromRoom = function (roomId, actorId) {
		var actor = this.roomGet(roomId).actors[actorId];
		if (!actor) return;
		actor.state = this.state.actors[actorId];
		return actor;
	};

	//get actor from inventory given its id.
	game.actorGetFromInventory = function (itemId) {
		if (!this.state.inventory.hasOwnProperty(itemId)) return null;
		return this.actorGetFromGlobal(itemId);
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
		outPut.selection = selection;
		return outPut;
	};
	//create standard room outPut
	game.outPutCreateFromRoom = function (room) {
		var text = room.descriptions[room.state.descriptionIndex];
		var imgURL = room.images ? room.images[room.state.imageIndex] : null;
		return this.outPutCreateRaw(text, imgURL);
	};
	//create standard room outPut from room where the player is
	game.outPutCreateFromCurrentRoom = function () {
		return this.outPutCreateFromRoom(this.roomGetCurrent());
	};
	//create standard actor outPut
	game.outPutCreateFromActor = function (actor) {
		var text = actor.descriptions[actor.state.descriptionIndex];
		var imgURL = actor.images ? actor.images[actor.state.imageIndex] : null;
		return this.outPutCreateRaw(text, imgURL);
	};
	//create standard outPut with the list of actors in a room. Filters invisible and removed actors (player can not interact with that)
	game.outPutCreateFromRoomActors = function (text, command, showInventory) { //showInventory=true to add inventory actor into the output
		//	var currentGame = this;
		var room = this.roomGetCurrent();
		var list = Object.keys(room.actors).filter(function (id) {
			var actor = this.actorGetFromCurrentRoom(id);
			return actor.state.visible && !actor.state.removed;
		}, this).map(function (id) {
			var item = game.actorGetFromCurrentRoom(id);
			return { id: id.replace(" ", "_"), name: item.name };
		});
		if (showInventory && Object.keys(this.state.inventory).length > 0) list.push({ id: "inventory", name: "inventory" });
		return this.outPutCreateRaw(text, null, { command: command, list: list });
	};
	//create standard outPut with the list of actors in the inventory.
	game.outPutCreateFromInventory = function (text, command) {
		var list = Object.keys(this.state.inventory).map(function (id) {
			var item = this.actorGetFromInventory(id);
			return { id: id.replace(" ", "_"), name: item.name };
		}, this);
		return this.outPutCreateRaw(text, null, { command: command, list: list });
	};
	//create standard outPut with the list of exits of the room.
	game.outPutCreateFromRoomExits = function (text, command) {
		var list = Object.keys(this.rooms[this.state.currentRoom].exits).map(function (id) {
			return { id: id.replace(" ", "_"), name: id };
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
		Reflect.defineProperty(this.state.inventory, item.id, { value: null, configurable: true, enumerable: true });
	};
	//remove the item from the inventory
	game.inventoryRemoveItem = function (item) {
		delete this.state.inventory[item.id];
	};
}
//inject verbs handlers into game
function initVerbsHandlers(game) {
	//null object pattern
	var nullActor = {
		id: "",
		doNotExist: true
	};

	var globalCommands = {};
	if (!game.globalResources.verbs) {//game will use all default verbs
		setAllDefaultHandlers();
	}
	else { //set individual handlers for every verb game has
		if (game.globalResources.verbs.includes("go")) setGo();
		if (game.globalResources.verbs.includes("inventory")) { setInventory(); setInspect(); }
		if (game.globalResources.verbs.includes("use")) setUse();
		if (game.globalResources.verbs.includes("give")) setGive();
		if (game.globalResources.verbs.includes("look at")) setLookAt();
		if (game.globalResources.verbs.includes("talk to")) setTalkTo();
		if (game.globalResources.verbs.includes("open")) setOpen();
		if (game.globalResources.verbs.includes("close")) setClose();
		if (game.globalResources.verbs.includes("push")) setPush();
		if (game.globalResources.verbs.includes("pull")) setPull();
		if (game.globalResources.verbs.includes("pick up")) setPickUp();
	}
	if (!game.globalCommands) game.globalCommands = {};//game does not provide verbs handlers, create empty

	game.globalCommands = Object.assign(globalCommands, game.globalCommands);//combine handlers, overrides default and add new ones

	function setAllDefaultHandlers() {
		setGo();
		setInspect();
		setInventory();
		setUse();
		setGive();
		setLookAt();
		setTalkTo();
		setOpen();
		setClose();
		setPush();
		setPull();
		setPickUp();
	}

	function setGo() {
		//execute scripts chain (game script -> room script -> actor script ), stop on any script returning	outPut or exec default behaviour if not
		globalCommands.go = function (direction) {
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
	}

	function setInspect() {
		//hidden verb to interact with inventory
		globalCommands.inspect = function (itemId) {
			var item = this.actorGetFromInventory(itemId);
			if (!item) return this.outPutCreateRaw("I can not find that in my inventory");
			if (item) return this.outPutCreateFromActor(item);
		};
	}

	function setInventory() {
		//outPut inventory items
		globalCommands.inventory = function () {
			var outPut = this.outPutCreateFromInventory("This is what you got:", "inspect");
			if (outPut.selection.list.length === 0) return this.outPutCreateRaw("Your pockets are empty");
			return outPut;
		};
	}
	//handler for 'use' verb
	function setUse() {
		globalCommands.use = function (firstActorId, secondActorId) {
			var outPut;
			if (!firstActorId) { //'use'
				outPut = this.outPutCreateFromRoomActors("Use what?", "use", true); //return actors in room and inventory
				if (!outPut.selection || !outPut.selection.list || outPut.selection.list.length < 1) {
					return this.outPutCreateRaw("Nothing here to use.");//no actors and inventory empty
				}
				return outPut;
			}

			if (firstActorId === "inventory") {//'use inventory'
				outPut = this.outPutCreateFromInventory("Use what?", "use"); //return inventory actors
				if (outPut.selection.list.length === 0) return this.outPutCreateRaw("My pockets are empty."); //empty inventory
				return outPut;
			}

			var firstActor = this.actorGetFromCurrentRoom(firstActorId) || this.actorGetFromInventory(firstActorId);//'use bottle'

			if (firstActor && !firstActor.state.removed && firstActor.state.visible) {//actor exist, not removed and visible
				//exec game scripts chain
				outPut = this["use"] ? this["use"](firstActor, nullActor) : null; //game script
				if (outPut) return outPut;

				var room = this.roomGetCurrent();
				outPut = room["use"] ? room.use(this, firstActor, nullActor) : null; //romm script
				if (outPut) return outPut;

				outPut = firstActor["use"] ? firstActor.use(this, nullActor) : null; //actor script
				if (outPut) return outPut; //return response

				//if not response from game scripts; a second actor is expected ('use bottle with?')
				if (!secondActorId) return this.outPutCreateFromRoomActors("Use " + firstActor.name + " with what?", "use " + firstActor.id, true);//ask for second actor

				if (secondActorId === "inventory") { return this.outPutCreateFromInventory("Use " + firstActor.name + " with what?", "use " + firstActor.id); }//'use bottle inventory' show inventory list

				var secondActor = this.actorGetFromCurrentRoom(secondActorId) || this.actorGetFromInventory(secondActorId);//'use bottle fountain'

				if (secondActor && !secondActor.state.removed && secondActor.state.visible) {//actor exist, not removed and visible
					//exec game scripts chain
					outPut = this["use"] ? this["use"](firstActor, secondActor) : null;//game script
					if (outPut) return outPut;

					room = this.roomGetCurrent();
					outPut = room["use"] ? room.use(this, firstActor, secondActor) : null;//room scrpt
					if (outPut) return outPut;

					outPut = firstActor["use"] ? firstActor.use(this, secondActor) : null;//actor script
					if (outPut) return outPut; //return response

					return this.outPutCreateRaw("It does not work.");//no response means default action.
				}
			}

			return this.outPutCreateRaw("I can not use that.");//can not find actor to use
		};
	}

	function setGive() {
		globalCommands.give = function (firstActorId, secondActorId) {
			if (!firstActorId) {
				var outPut = this.outPutCreateFromInventory("Give what?", "give");
				if (outPut.selection.list.length === 0) return this.outPutCreateRaw("My pockets are empty.");
				return outPut;
			}
			var firstActor = this.actorGetFromInventory(firstActorId);

			if (firstActor) {
				if (!secondActorId) return this.outPutCreateFromRoomActors("Give " + firstActor.name + " to...", "give " + firstActor.id, true);

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
	}

	function setLookAt() {
		globalCommands["look at"] = function (actorId) {
			if (!actorId) return this.outPutCreateFromRoomActors("Look at what?", "look_at"); // ouput list of actors
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
	}

	function setTalkTo() {
		globalCommands["talk to"] = function (actorId) {
			if (!actorId) return this.outPutCreateFromRoomActors("talk to who?", "talk_to"); // ouput list of actors
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
	}

	function setOpen() {
		globalCommands.open = function (actorId) {
			if (!actorId) return this.outPutCreateFromRoomActors("Open what?", "open", true); // ouput list of actors
			var outPut;
			if (actorId === "inventory") {
				outPut = this.outPutCreateFromInventory("Open what?", "open");
				if (outPut.selection.list.length === 0) return this.outPutCreateRaw("My pockets are empty.");
				return outPut;
			}

			var actor = this.actorGetFromCurrentRoom(actorId) || this.actorGetFromInventory(actorId);

			if (!actor) return this.outPutCreateRaw("You can not open that.");

			outPut = this["open"] ? this["open"](actor) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["open"] ? room["open"](this, actor) : null;
			if (outPut) return outPut;

			outPut = actor["open"] ? actor["open"](this) : null;
			if (outPut) return outPut;

			return this.outPutCreateRaw("It can not be opened.");
		};
	}

	function setClose() {
		globalCommands.close = function (actorId) {
			if (!actorId) return this.outPutCreateFromRoomActors("Close what?", "close", true); // ouput list of actors
			var outPut;
			if (actorId === "inventory") {
				outPut = this.outPutCreateFromInventory("Close what?", "close");
				if (outPut.selection.list.length === 0) return this.outPutCreateRaw("My pockets are empty.");
				return outPut;
			}

			var actor = this.actorGetFromCurrentRoom(actorId) || this.actorGetFromInventory(actorId);

			if (!actor) return this.outPutCreateRaw("You can not close that.");

			outPut = this["close"] ? this["close"](actor) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["close"] ? room["close"](this, actor) : null;
			if (outPut) return outPut;

			outPut = actor["close"] ? actor["close"](this) : null;
			if (outPut) return outPut;

			return this.outPutCreateRaw("It can not be closed.");
		};
	}

	function setPush() {
		globalCommands.push = function (actorId) {
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
	}

	function setPull() {
		globalCommands.pull = function (actorId) {
			if (!actorId) return this.outPutCreateFromRoomActors("Pull what?", "pull"); // ouput list of actors

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
	}

	function setPickUp() {
		globalCommands["pick up"] = function (actorId) {
			{
				if (!actorId) return this.outPutCreateFromRoomActors("Pick up what?", "pick_up"); //output list of actors in the room

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
	if (!game.state.inventory) game.state.inventory = {};
	if (!game.state.rooms) game.state.rooms = {};
	if (!game.state.actors) game.state.actors = {};
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
		else { //merge states
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
		else {//merge states
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
			else { //merge states
				game.state.actors[actorName] = Object.assign(defaultActorState, currentActorState);
			}
		}
	}
}

function CreateInitialState(game) {
	return JSON.parse(JSON.stringify(game.state)); //brute copy constructor
}