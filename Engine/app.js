var game = {
	state: { //game state data
		player: null,
		currentRoom: "Start Gate",
		inventory: null,
		rooms: null,
		actors: {
			bonfire: {
				extinguished: false
			},
			bottle: {
				collectible: true
			},
			invBottle: {
				filled: false
			},
			key: {
				visible: false,
				collectible: false
			},
			door: {
				opened: false
			}
		}
	},//end game state
	//game assets
	globalResources: {
		images: {
			TitleImage: "http://gameimages/myGame/Title.gif"
		},
		actions: {
			extinguish: {
				description: "A dense cloud of steam raises when you throw the water into the bonfire.",
				image: "http://gameimages/myGame/ExtinguishingBonfire.gif"  //animated gif
			},
			fillBottle: {
				description: "You fill the bottle with the water of the fountain.",
				image: "http://gameimages/myGame/fillBottle.gif"  //animated gif
			},
			hotKey: {
				description: "Auch! The key is too hot.You can not do that",
			},
			bottleEmpty: {
				description: "The bottle is empty."
			},
			doorClosed: {
				description: "The door of the mansion is key locked."
			}
		},
		actors: {
			invKey: {
				name: "Copper key",
				descriptions: {
					0: "A copper key."
				},
				images: {
					0: "http://gameimages/myGame/copperKey.gif"
				}
			},
			invBottle: {
				name: "Bottle",
				descriptions: {
					0: "It is a empyt bottle",
					1: "It is a bottle with some water" //once you fill the bottle in the fountain
				},
				images: {
					0: "http://gameimages/myGame/EmptyBottle.gif",
					1: "http://gameimages/myGame/WaterBottle.gif"
				},
				fill: function () {
					this.state.filled = true;
					this.state.descriptionIndex = 1;
					this.state.imageIndex = 1;
				},
				empty: function () {
					this.statelfilled = false;
					this.state.descriptionIndex = 0;
					this.state.imageIndex = 0;
				},
				use: function (game, secondactor) {
					if (!secondactor) return;

					if (secondactor.id == "fountain") {
						this.fill();
						return game.outPutCreateFromAction("fillBottle");
					}
					if (secondactor.id == "bonfire") {
						if (!secondactor.state.filled) return outPutCreateFromAction("bottleEmpty");
						secondactor.extinguish();
						this.empty();
						game.actorGetFromCurrentRoom("key").collectible = true;
					}
				},
			}
		}
	},
	rooms: {
		"Start Gate": {
			name: "Start Gate",
			descriptions: {
				0: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a still active bonfire on the side of the road.",
				1: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a extinguished bonfire on the side of the road."
			},
			images: {
				0: "http://gameimages/myGame/StartGate.gif",
				1: "http://gameimages/myGame/StartGateExtinguished.gif"
			},
			actors: {
				bonfire: {
					name: "Bonfire",
					descriptions: {
						0: "A pretty hot bonfire. Looks like a key shines among the embers.",
						1: "A extinguished bonfire." //once you use the water to extinguish it
					},
					images: {
						0: "http://gameimages/myGame/bonfire.gif",
						1: "http://gameimages/myGame/extinguishedBonfire.gif"
					},
					extinguish: function () {
						this.extinguished = true;
						this.state.descriptionIndex = 1;
						this.state.imageIndex = 1;
					},
					"look at": function () {
						game.actorGetFromCurrentRoom("key").state.visible = true;
					},
					use: function (game, secondActor) {
						if (!secondActor) return;
						if (secondActor.id == "invBottle") {
							if (!secondActor.state.filled) return outPutCreateFromAction("bottleEmpty");
							this.extinguish();
							secondActor.empty();
							game.actorGetFromCurrentRoom("key").state.collectible = true;
						}
					}
				},
				key: {
					name: "Copper key",
					descriptions: {
						0: "A copper key."
					},
					images: {
						0: "http://gameimages/myGame/copperKey.gif"
					},
					inventoryActor: "invKey",
					"pick up": function (game) {
						var outPut = this.state.collectible ? game.roomGetCurrent().keyPickedUp() : game.outPutCreateFromAction("hotKey");
						return outPut;
					},
				}
			},
			exits: {
				north: "A Fountain",
				east: null,
				south: null,
				west: null
			},
			keyPickedUp: function () {
				this.state.descriptionIndex = 1;
				this.state.imageIndex = 1;
			}
		},
		"A Fountain": {
			name: "A Fountain",
			descriptions: {
				0: "You are near a fountain. It is in front of a huge mansion. There is a empty bottle just besides it",
				1: "You are near a fountain. It is in front of a huge mansion."//once you pick up the bottle
			},
			images: {
				0: "http://gameimages/myGame/AFountain.gif"
			},
			actors: {
				bottle: {
					name: "Bottle",
					descriptions: {
						0: "It is a empyt bottle",
					},
					images: {
						0: "http://gameimages/myGame/EmptyBottle.gif",
					},
					inventoryActor: "invBottle",
					"pick up": function (game) {
						game.roomGetCurrent().bottlePickedUp();
					}
				},
				fountain: {
					name: "Marble fountain",
					descriptions: {
						0: "A marble fountain with lots of water."
					},
					images: {
						0: "http://gameimages/myGame/fountain.gif"
					},
					use: function (game, secondActor) {
						if (!secondActor) return;
						if (secondActor.id == "invBottle") {
							secondActor.fill();
							return game.outPutCreateFromAction("fillBottle");
						}
					},
				}
			},
			exits: {
				north: "Mansion",
				east: null,
				south: "Start Gate",
				west: null
			},
			bottlePickedUp: function () {
				this.state.descriptionIndex = 1;
			},
			go: function (game, direction) {
				if (direction == "north" && game.roomGetCurrent().doorOpened == false) {
					return game.outPutCreateFromAction("doorClosed");
				}
			}
		},
		Mansion: {
			name: "Mansion",
			descriptions: {
				0: "You are in a huge mansion. Seems abandoned."
			},
			images: { 0: "http://gameimages/myGame/Mansion.gif" },
			exits: {
				north: null,
				east: null,
				south: "A Fountain",
				west: null
			}
		}
	}
};


//Inject Game API on init
game.roomGetCurrent = function () {
	return this.roomGet(this.state.currentRoom);
};

game.roomSetCurrent = function (destRoomId) {
	this.state.currentRoom = destRoomId;
};

game.roomGet = function (roomId) {
	var room = this.rooms[roomId];
	room.state = this.state.rooms[roomId];
	return room;
};

game.actorGetFromCurrentRoom = function (actorId) {
	var actor = this.roomGetCurrent().actors[actorId];
	if (!actor) return;
	actor.state = this.state.actors[actorId];
	return actor;
};

game.actorGetFromInventory = function (itemId) {
	return this.state.inventory[itemId];
};

game.actorGetFromGlobal = function (actorId) {
	var actor = this.globalResources.actors[actorId];
	actor.state = this.state.actors[actorId];
	return actor;
};

game.outPutCreateRaw = function (text, imgURL, selection) {
	var game = this;
	var outPut = new Object();
	outPut.text = text;
	if (imgURL) outPut.imgURL = imgURL;
	if (selection) {
		outPut.selection = { command: selection.command, list: selection.list };
	}
	return outPut;
};

game.outPutCreateFromRoom = function (room) {
	var text = room.descriptions[room.state.descriptionIndex];
	var imgURL = room.images[room.state.imageIndex];
	return this.outPutCreateRaw(text, imgURL);
};

game.outPutCreateFromActor = function (actor) {
	var text = actor.descriptions[actor.state.descriptionIndex];
	var imgURL = actor.images[actor.state.imageIndex];
	return this.outPutCreateRaw(text, imgURL);
};

game.outPutCreateFromRoomActors = function (text, command, showInventory) {
	var currentGame = this;
	var room = this.roomGetCurrent();
	var list = Object.keys(room.actors).filter(function (id) {
		var actor = currentGame.actorGetFromCurrentRoom(id);
		return actor.state.visible && !actor.state.removed;
	}).map(function (id) {
		var item = game.actorGetFromCurrentRoom(id);
		return { id: id, name: item.name }
	});
	if (showInventory) list.push({ id: "inventory", name: "inventory" })
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromInventory = function (text, command) {
	var list = Object.keys(this.state.inventory).map(function (id) {
		var item = game.actorGetFromInventory(id);
		return { id: id, name: item.name }
	});
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromRoomExits = function (text, command) {
	var list = Object.keys(this.rooms[this.state.currentRoom].exits).map(function (id) {
		return { id: id, name: id }
	});;
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromAction = function (actionName) {
	var action = this.globalResources.actions[actionName];
	return this.outPutCreateRaw(action.description, action.image);
};

game.inventoryAddItem = function (item) {
	item = this.actorGetFromGlobal(item.inventoryActor);
	this.state.inventory[item.id] = item;
};

game.inventoryRemoveItem = function (item) {
	delete this.state.inventory[item.id];
};

game.globalCommands = new Object;

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

game.globalCommands.inspect = function (itemId) {
	var item = this.actorGetFromInventory(itemId);
	if (!item) return this.outPutCreateRaw("I can not find that in my inventory");
	if (item) return this.outPutCreateFromActor(item);
};

game.globalCommands.inventory = function () { return this.outPutCreateFromInventory("This is what you got:", "inspect"); };

game.globalCommands.use = function (firstActorId, secondActorId) {
	if (!firstActorId) return this.outPutCreateFromRoomActors("Use what?", "use", true);

	if (firstActorId == "inventory") { return this.outPutCreateFromInventory("Use what?", "use") };

	var firstActor = this.actorGetFromCurrentRoom(firstActorId) || this.actorGetFromInventory(firstActorId);

	if (firstActor && !firstActor.state.removed &&  firstActor.state.visible ) {
		var outPut = this["use"] ? this["use"](firstActor) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["use"] ? room.use(this, firstActor) : null;
		if (outPut) return outPut;

		outPut = firstActor["use"] ? firstActor.use(this) : null;
		if (outPut) return outPut;

		if (!secondActorId) return this.outPutCreateFromRoomActors("Use " + firstActor.name + " with what?", "use " + firstActor.name, true);

		if (secondActorId == "inventory") { return this.outPutCreateFromInventory("Use " + firstActor.name + " with what?", "use " + firstActor.name) };

		var secondActor = this.actorGetFromCurrentRoom(secondActorId) || this.actorGetFromInventory(secondActorId);

		if (secondActor && !secondActor.state.removed && secondActor.state.visile ) {
			var outPut = this["use"] ? this["use"](firstActor, secondActor) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["use"] ? room.use(this, firstActor, secondActor) : null;
			if (outPut) return outPut;

			outPut = firstActor["use"] ? firstActor.use(this, secondActor) : null;
			if (outPut) return outPut;

			return this.outPutCreateRaw("It does not work.");
		}
	}

	return this.outPutCreateRaw("I can not use that.");
};

game.globalCommands["look at"] = function (actorId) {
	if (!actorId) return this.outPutCreateFromRoomActors("Look at what?", "look at"); // ouput list of actors

	var actor = this.actorGetFromCurrentRoom(actorId);
	if (!actor) return this.outPutCreateRaw("You can not see that.");

	var outPut = this["look at"] ? this["look at"](actor) : null;
	if (outPut) return outPut;

	var room = this.roomGetCurrent();
	outPut = room["look at"] ? room["look at"](this, actor) : null;
	if (outPut) return outPut;

	outPut = actor["look at"] ? actor["look at"](this) : null;
	if (outPut) return outPut;

	//default behaviour
	if (actor.state.visible && !actor.state.removed) {
		return this.outPutCreateFromActor(actor);
	}
	return this.outPutCreateRaw("You can not see that.");
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

//game will be in memory always

//engine for host

initGame = function (game) {
	initState(game);
	initIDs(game);
};

initIDs = function (game) {
	for (var actorID in game.globalResources.actors) {
		game.globalResources.actors[actorID].id = actorID;
	}
	for (var roomName in game.rooms) {
		game.rooms[roomName].id = roomName;
		for (var actorID in game.rooms[roomName].actors) {
			game.rooms[roomName].actors[actorID].id = actorID;
		}
	}
};

initState = function (game) {
	if (!game.state.inventory) game.state.inventory = new Object();
	if (!game.state.rooms) game.state.rooms = new Object();
	if (!game.state.player) game.state.player = new Object();
	if (!game.state.actors) game.state.actors = new Object();

	for (var actorName in game.globalResources.actors) {
		var currentActorState = game.state.actors[actorName];
		var defaultActorState = {
			descriptionIndex: 0,
			imageIndex: 0,
			visible: true,
			collectible: false,
			removed: false,
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

		for (var actorName in game.rooms[roomName].actors) {
			var currentActorState = game.state.actors[actorName];
			var defaultActorState = {
				descriptionIndex: 0,
				imageIndex: 0,
				visible: true,
				collectible: false,
				removed: false,
			};
			if (!currentActorState) { //not exist, create it
				game.state.actors[actorName] = defaultActorState;
			}
			else { //add properties needed by the engine 
				game.state.actors[actorName] = Object.assign(defaultActorState, currentActorState);
			}
		}
	}
};

execCommand = function (game, verb, dObject, iObject) {
	outPut = game.globalCommands[verb] ? game.globalCommands[verb].call(game, dObject, iObject) : { text: "What? Try again..." };
	return outPut;
};

start = function (game) {
	var currentRoom = game.roomGetCurrent();
	return {
		text: currentRoom.descriptions[currentRoom.state.descriptionIndex],
		imgUrl: currentRoom.images[currentRoom.state.imageIndex]
	};
};

var verbs = {
	go: null,
	use: null,
	"pick up": null,
	"look at": null,
	inventory: null
};

initGame(game);
//var jgame = JSON.stringify(game);
var res;
//console.log("> Commands: " + Object.keys(verbs).join(", ")); // this will be custom keyboard in telegram chat

console.log("start");
console.log("> " + start(game).text);

console.log("look at");
res = execCommand(game, "look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + execCommand(game, "look at", "key").text);

console.log("look at bonfire");
console.log("> " + execCommand(game, "look at", "bonfire").text);

console.log("look at");
res = execCommand(game, "look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + execCommand(game, "look at", "key").text);

console.log("pick up");
res = execCommand(game, "pick up");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("pick up bonfire");
console.log("> " + execCommand(game, "pick up", "bonfire").text);

console.log("pick up key");
console.log("> " + execCommand(game, "pick up", "key").text);

console.log("go");
res = execCommand(game, "go");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);

console.log("look at fountain");
console.log("> " + execCommand(game, "look at", "fountain").text);

console.log("look at bottle");
console.log("> " + execCommand(game, "look at", "bottle").text);

console.log("pick up bottle");
console.log("> " + execCommand(game, "pick up", "bottle").text);

console.log("inventory");
res = execCommand(game, "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("inspect invBottle");
console.log("> " + execCommand(game, "inspect", "invBottle").text);

console.log("go south");
console.log("> " + execCommand(game, "go", "south").text);

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);

console.log("use");
res = execCommand(game, "use");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use fountain");
res = execCommand(game, "use", "fountain");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use fountain fountain");
res = execCommand(game, "use", "fountain", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use inventory");
res = execCommand(game, "use", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle");
res = execCommand(game, "use", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle inventory");
res = execCommand(game, "use", "invBottle", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use bottle bottle");
res = execCommand(game, "use", "bottle", "bottle");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use bottle fountain");
res = execCommand(game, "use", "bottle", "fountain");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use fountain bottle");
res = execCommand(game, "use", "fountain", "bottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

//console.log("use bottle");
//res = execCommand(game, "use", "bottle");
//console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

//console.log("use bottle fountain");
//console.log("> " + execCommand(game, "use", "bottle", "fountain").text);

//console.log("go south");
//console.log("> " + execCommand(game, "go", "south").text);

//console.log("use bottle bonfire");
//console.log("> " + execCommand(game, "use", "bottle", "bonfire").text);

//console.log("look at bonfire");
//console.log("> " + execCommand(game, "look at", "bonfire").text);

//console.log("pick up key");
//console.log("> " + execCommand(game, "pick up", "key").text);

//console.log("go north");
//console.log("> " + execCommand(game, "go", "north").text);
//console.log("pick up bottle");
//console.log("> " + game.execCommand("pick_up", "bottle").description);
//console.log("go south");
//console.log("> " + game.execCommand("go", "south").description);
//console.log("go north");
//console.log("> " + game.execCommand("go", "north").description);
//console.log(game.state.inventory);