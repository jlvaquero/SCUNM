var game = {
		state: { //game state data, this data will be loaded/saved for every command for every user
				currentRoom: "Start Gate",
				inventory: null,
				rooms: {
					"A Fountain": { doorOpened: false }
				},
				interactives: {
					bonfire: {
						extinguished: false
					},
					bottle: {
						filled: false,
						collectible: true
					},
					key: {
						visible: false,
						collectible: false
					}
				}
		},//end game state
		//game assets
		globalResources: {
			comandNotFound: "What? Try again...",
			images: {
				TitleImage: "http://gameimages/myGame/Title.gif"
			},
			actions: {
				extinguish: {
					description: "A dense cloud of steam raises when you throw the water in the bonfire." ,
					images: "http://gameimages/myGame/ExtinguishingBonfire.gif"  //animated gif
				}
			}
		},
		verbs: {
			go: null,
			use: null,
			"pick up": null,
			"look at": null,
			inventory: null,
			inspect: null
		},
		globalCommands: {
			go: function (game, direction) {

				if (!direction) return game.outPutCreateFromRoomExits("Where to?", "go");//output list of directions

				var destRoom = game.roomGetCurrent().exits[direction];
				if (destRoom) {
					game.roomSetCurrent(destRoom);
					return game.outPutCreateFromRoom(game.roomGetCurrent());
				}

				return game.outPutCreateRaw("No way to go...");

			},
			"pick up": function (game, interactiveName) {
				{
					if (!interactiveName) return game.outPutCreateFromRoomInteractives("Pick up what?", "pick up"); //output list of interactives in the room
					
					var item = game.interactiveGetFromCurrentRoom(interactiveName);
					if (game.inventoryAddItem(item)) return game.outPutCreateRaw("You picked up " + item.name);
			
					return game.outPutCreateRaw("You can not pick up that.");
				}
			},
			inventory: function (game) { return game.outPutCreateFromInventory("This is what you got:","inspect"); }, //output inventory
			"look at": function (game, interactiveName) {
				if (!interactiveName) return game.outPutCreateFromRoomInteractives("Look at what?",  "look at"); // ouput list of interactives
				
				objetive = game.interactiveGetFromCurrentRoom(interactiveName);
				if (objetive && objetive.state.visible) return game.outPutCreateFromInteractive(objetive); 

				return game.outPutCreateRaw("You can not see that.");
			},
			inspect: function (game, itemName) {
				if (!itemName) return game.outPutCreateFromInventory("Inspect what?", "inspect");//output list inventory items
	
				item = game.interactiveGetFromInventory(itemName);
				if (item) return game.outPutCreateFromInteractive(item);

				return game.outPutCreateRaw("There is no " + itemName + "in your inventory!");
			},
			use: function (game, firstInteractiveName, secondInteractiveName) {

			}
		},
		rooms: {
				"Start Gate": {
						name: "Start Gate",
						descriptions: { 0: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a still active bonfire on the side of the road." },
						images: { 0: "http://gameimages/myGame/StartGate.gif" },
						interactives: {
							bonfire: {
								name: "bonfire",
								descriptions: {
									0: "A pretty hot bonfire. Looks like a key shines among the embers.",
									1: "A extinguished bonfire." //once you use the water to extinguish it
								},
								images: {
									0: "http://gameimages/myGame/bonfire.gif",
									1: "http://gameimages/myGame/extinguishedBonfire.gif"
								}
							},
							key: {
								name: "key",
								descriptions: {
									0: "A copper key."							
								},
								images: {
									0: "http://gameimages/myGame/copperKey.gif"
								}
							}
						},
						exits: {
								north: "A Fountain",
								east: null,
								south: null,
								west: null
						},
						"look at": function (game, interactiveName) {

							if (interactiveName == "bonfire") {
								game.interactiveGetFromCurrentRoom("key").state.visible = true;
							}
							return null; //let gobal command handle this
						},
						"pick up": function (game, itemName) {
							if (itemName == "key") {
								var key = game.interactiveGetFromCurrentRoom("key");
								if (key.state.visible && !key.state.collectible) return game.outPutCreateRaw("Auch! The key is too hot. You can not do that");
							}
							return null; //let gobal command handle this
						}
				},
				"A Fountain": {
						name: "A Fountain",
						descriptions: {
								0: "You are near a fountain. It is in front of a huge mansion. There is a empty bottle just besides it",
								1: "You are near a fountain. It is in front of a huge mansion."//once you pick up the bottle
						},
						images: { 0: "http://gameimages/myGame/AFountain.gif" },
						interactives: {
							bottle: {
								name: "bottle",
								descriptions: {
									0: "It is a empyt bottle",
									1: "It is a bottle with some water" //once you fill the bottle in the fountain
								},
								images: {
									0: "http://gameimages/myGame/EmptyBottle.gif",
									1: "http://gameimages/myGame/WaterBottle.gif"
								}
							},
							fountain: {
								name: "fountain",
									descriptions: {
										0: "A marble fountain with lots of water."
									},
									images: {
										0: "http://gameimages/myGame/fountain.gif"
									}
							}
						},
						exits: {
								north: "Mansion",
								east: null,
								south: "Start Gate",
								west: null
						},
						go: function (game, direction) {

							if (direction == "north" && game.roomGetCurrent().state.doorOpened == false) {
								return game.outPutCreateRaw("The entrace of the mansion is closed.");
							}
							return null; //let gobal command handle this
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
	var room = this.rooms[this.state.currentRoom];
	room.state = this.state.rooms[room.name];
	return room;
};

game.roomSetCurrent = function (destRoom) {
	this.state.currentRoom = destRoom;
};

game.roomGet = function (roomName) {
	var room = this.rooms[roomName];
	room.state = this.state.rooms[room.name];
	return room;
};

game.interactiveGetFromCurrentRoom = function (interactiveName) {
	interactive = this.roomGetCurrent().interactives[interactiveName];
	interactive.state = this.state.interactives[interactiveName];
	return interactive;
};

game.interactiveGetFromInventory = function (itemName) {
	return this.state.inventory[itemName];
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

game.outPutCreateFromInteractive = function (entity) {

	var text = entity.state ? entity.descriptions[entity.state.descriptionIndex] : entity.descriptions[0];
	var imgURL = entity.state ? entity.images[entity.state.imageIndex] : entity.descriptions[0];
	return this.outPutCreateRaw(text, imgURL);
};

game.outPutCreateFromRoomInteractives = function (text, command) {
	var currentGame = this;
	var room = this.roomGetCurrent();
	var list = Object.keys(room.interactives).filter(function (name) {
		return currentGame.interactiveGetFromCurrentRoom(name).state.visible;
	});
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromInventory = function(text, command) {
	var list = Object.keys(this.state.inventory);
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromRoomExits = function (text, command) {
	var list = Object.keys(this.rooms[this.state.currentRoom].exits);
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.inventoryAddItem = function (item) {
	if (item && item.state.collectible && item.state.visible) {
		this.state.inventory[item.name] = item;
		return true;
		}
	return false;
};

game.resourceGet = function (name) { //i.e. "images.TitleImage"
	var resPath = name.split(".");
	var resource = this.globalResources;

	gerResource = function () {
		resource = resource[resPath[index]];
	};

	for (var index in resPath) {
		gerResource();
	}

	return resource;

};
//game will be in memory always (TODO: make a engine for redis that allows just load in memory game assets needed for the task)

//engine for host

initState = function (game) {
	game.state.inventory = new Object();
	for (var roomName in game.rooms) {

		var roomState = game.state.rooms[roomName];
		if (!roomState) {//not exist, create it
			roomState = {
				descriptionIndex: 0,
				imageIndex: 0
			};
			game.state.rooms[roomName] = roomState;
		}
		else {//add properties needed by the engine 
			roomState["descriptionIndex"] === undefined ? roomState.descriptionIndex = 0 : null;
			roomState["imageIndex"] === undefined ? roomState.imageIndex = 0 : null;
		}

		for (var interactiveName in game.rooms[roomName].interactives) {
			var itemState = game.state.interactives[interactiveName]; 
			if (!itemState) { //not exist, create it
				itemState = {
					descriptionIndex: 0,
					imageIndex: 0,
					visible: true,
					collectible: false
				};
				game.state.interactives[interactiveName] = itemState;
			}
			else { //add properties needed by the engine 
				itemState["descriptionIndex"] === undefined ? itemState.descriptionIndex = 0 : null;
				itemState["imageIndex"] === undefined ? itemState.imageIndex = 0 : null;
				itemState["visible"] === undefined ? itemState.visible = true : null;
				itemState["collectible"] === undefined ? itemState.collectible = false : null;
			}

		}
	}

};

getCurrentRoom = function (game) { //without injecting state, better performance
	return game.rooms[game.state.currentRoom];
};

execCommand = function (game, verb, dObject, iObject) {
	var currentRoom = getCurrentRoom(game);
	var cmd = getRoomCommand(game, verb);
	var outPut = cmd ? cmd.call(game, game, dObject, iObject) : null;
	if (outPut) return outPut;
	cmd = getGlobalCommand(game, verb);
	outPut = cmd ? cmd.call(game, game, dObject, iObject) : { text: game.globalResources.comandNotFound };
	return outPut;
};

getGlobalCommand = function (game, verb) {
	return game.globalCommands[verb];
};

getRoomCommand = function (game, verb) {
	return getCurrentRoom(game)[verb];
};

start = function (game) {
	var currentRoom = getCurrentRoom(game);
	var roomState = game.state.rooms[game.state.currentRoom];
	return {
		text: currentRoom.descriptions[roomState.descriptionIndex],
		imgUrl: currentRoom.imageUrl ? currentRoom.imageUrl : null
	};
};

initState(game);
var res;
console.log("> Commands: " + Object.keys(game.verbs).join(", ")); // this will be custom keyboard in telegram chat

console.log("start");
console.log("> " + start(game).text);

console.log("look at");
res = execCommand(game, "look at");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("look at bonfire");
console.log("> " + execCommand(game, "look at", "bonfire").text);

console.log("look at key");
console.log("> " + execCommand(game, "look at", "key").text);

console.log("pick up");
res = execCommand(game, "pick up");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("pick up key");
console.log("> " + execCommand(game, "pick up", "key").text);

console.log("go");
res = execCommand(game, "go");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

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
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("inspect");
res = execCommand(game, "inspect");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("inspect bottle");
console.log("> " + execCommand(game, "inspect", "bottle").text);

//console.log("go north");
//console.log("> " + execCommand(game, "go", "north").text);
//console.log("pick up bottle");
//console.log("> " + game.execCommand("pick_up", "bottle").description);
//console.log("go south");
//console.log("> " + game.execCommand("go", "south").description);
//console.log("go north");
//console.log("> " + game.execCommand("go", "north").description);
//console.log(game.state.inventory);