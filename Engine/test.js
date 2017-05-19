var assets = {
	meta: {
		name: "Demo",
		author: "jlvaquero",
		description: "Just a demo."
	},
	init: function () {/*init the inventory here*/ },
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
					"look at": function (game) {
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

var engine = require('./app.js')(assets);

var res;
//console.log("> Commands: " + Object.keys(verbs).join(", ")); // this will be custom keyboard in telegram chat

console.log("start");
console.log("> " + engine.continue().text);

console.log("look at");
res = engine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + engine.execCommand("look at", "key").text);

console.log("look at bonfire");
console.log("> " + engine.execCommand("look at", "bonfire").text);

console.log("look at");
res = engine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + engine.execCommand("look at", "key").text);

console.log("pick up");
res = engine.execCommand("pick up");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("pick up bonfire");
console.log("> " + engine.execCommand("pick up", "bonfire").text);

console.log("pick up key");
console.log("> " + engine.execCommand("pick up", "key").text);

console.log("go");
res = engine.execCommand("go");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("go north");
console.log("> " + engine.execCommand("go", "north").text);

console.log("look at fountain");
console.log("> " + engine.execCommand("look at", "fountain").text);

console.log("look at bottle");
console.log("> " + engine.execCommand("look at", "bottle").text);

console.log("pick up bottle");
console.log("> " + engine.execCommand("pick up", "bottle").text);

console.log("inventory");
res = engine.execCommand("inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("inspect invBottle");
console.log("> " + engine.execCommand("inspect", "invBottle").text);

console.log("go south");
console.log("> " + engine.execCommand("go", "south").text);

console.log("go north");
console.log("> " + engine.execCommand("go", "north").text);

console.log("use");
res = engine.execCommand("use");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use fountain");
res = engine.execCommand("use", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use fountain fountain");
res = engine.execCommand("use", "fountain", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use inventory");
res = engine.execCommand("use", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle");
res = engine.execCommand("use", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle inventory");
res = engine.execCommand("use", "invBottle", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle invBottle");
res = engine.execCommand("use", "invBottle", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use invBottle fountain");
res = engine.execCommand("use", "invBottle", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use fountain invBottle");
res = engine.execCommand("use", "fountain", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("go south");
console.log("> " + execCommand(game, "go", "south").text);

console.log("use bottle bonfire");
console.log("> " + execCommand(game, "use", "bottle", "bonfire").text);

console.log("look at bonfire");
console.log("> " + execCommand(game, "look at", "bonfire").text);

console.log("pick up key");
console.log("> " + execCommand(game, "pick up", "key").text);

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);
console.log("pick up bottle");
console.log("> " + game.execCommand("pick_up", "bottle").description);
console.log("go south");
console.log("> " + game.execCommand("go", "south").description);
console.log("go north");
console.log("> " + game.execCommand("go", "north").description);
console.log(game.state.inventory);