﻿module.exports.Demo = {
	meta: {
		name: "Demo",
		author: "jlvaquero",
		description: "Just a demo."
	},
	state: { //game state data
		//	player: {brokenleg: false}, //developer can add its own state at convenience
		currentRoom: "Start Gate",//The start room id
		//	inventory: null,//optional; no initial inventory in this game; engine will create empty inventory
		//rooms: null,//optional; no need of custom room state in this game; engine will create default room state values  {descriptionIndex: 0, imageIndex: 0}
		actors: { //optional; need custom state and non default values in this game
			bonfire: {
				extinguished: false //custom state
			},
			bottle: {
				collectible: true //default collectible state is false. need true for the bottle
			},
			invBottle: {
				filled: false //custom state
			},
			"silver coin": {
				visible: false //default visible state is true, need false for the coin
			}
		}
	},//end game state
	//game assets
	globalResources: {
		actions: { //optional, outPut in response of user actions
			extinguish: {
				description: "A dense cloud of steam raises when you throw the water into the bonfire.",
				image: "http://skullappreciationsociety.com/wp-content/uploads/2012/11/fire-skull-gif.gif"
			},
			fillBottle: {
				description: "You fill the bottle with the water of the fountain.",
				image: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"  //animated gif
			},
			hotCoin: {
				description: "Auch! The coin is too hot.You can not do that" //image is optional
			},
			bottleEmpty: {
				description: "The bottle is empty."
			},
			youShallNotPass: {
				description: "The guard says: Only Cthulhu servants can enter."
			},
			giveCoin: {
				description: "The guard takes the coin and left."
			}
		},
		actors: { //optional, actor that does not belong to a room  (i.e. inventory items)
			invCoin: { //id=invCoin property will be created by the engine
				name: "Silver Coin",// show the player a pretty name
				descriptions: {
					0: "A silver coin with a octopus impressed on it."
				},
				images: {
					0: "https://ferrebeekeeper.files.wordpress.com/2016/03/1ae50e13e41a882c2b10acf4e2db3cbb.gif"
				},
				give: function (game, secondActor) { //script for give action (i.e. give coin guard)
					if (secondActor.id !== "guard") return null; //let default behaviour works
					secondActor.state.removed = true;//guard left
					game.roomGetCurrent().guardLeft();//notify room to change its state
					game.inventoryRemoveItem(this);//coin removed from inventory
					return game.outPutCreateFromAction("giveCoin");//reference to globalResources.actions
				},
				use: function (game, secondActor) { //script for use action (i.e. use coin fountain)
					if (secondActor.doNotExist) return null;
					if (secondActor.id === "fountain") return game.outPutCreateRaw("My only wish is not loosing this coin..."); //funny easter eggs
					return game.outPutCreateRaw("There is no coin slot!"); //no coin slot exist in this game
				}
			},
			invBottle: {
				name: "Bottle",
				descriptions: {
					0: "It is a empyt bottle",
					1: "It is a bottle with some water" //once you fill the bottle in the fountain
				},
				images: {
					0: "https://media.giphy.com/media/12IK01JJiBXtvi/giphy.gif", //empty bottle
					1: "https://68.media.tumblr.com/1562737ff37ec39f4ce5269e35368803/tumblr_n34tvwVB5h1qza1qzo1_500.gif" //water bottle
				},
				fill: function () { //change invBottle state
					this.state.filled = true;
					this.state.descriptionIndex = 1;
					this.state.imageIndex = 1;
				},
				empty: function () { //change invBottle state
					this.statelfilled = false;
					this.state.descriptionIndex = 0;
					this.state.imageIndex = 0;
				},
				use: function (game, secondactor) {
					if (secondactor.id === "fountain") {
						this.fill();
						return game.outPutCreateFromAction("fillBottle");
					}
					if (secondactor.id === "bonfire") {
						if (!this.state.filled) return game.outPutCreateFromAction("bottleEmpty");
						secondactor.extinguish(game);//extinguish bonfire
						this.empty();
						game.actorGetFromCurrentRoom("silver coin").state.collectible = true;//now tha coin can be picked up
						return game.outPutCreateFromAction("extinguish");
					}
				}
			}
		} //optional //default are ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"];
		//verbs: ["jump", "go"]// optional; custom verbs; WARNING: overrides (does not combine with) default verbs
		//the engine provides handlers for default verbs, custom verbs requires custom handlers in globalCommands section.
	},
	/*globalCommands: { //mandatory if custom verbs are defined
			jump: function(actorId){...} //i.e. jump fence
			//<go> not defined, the engine will inject default <go> handler
	},*/
	rooms: {
		"Start Gate": { //id="Start Gate" property will be created by the engine
			name: "Start Gate",
			descriptions: {
				0: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a still active bonfire on the side of the road.",
				1: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a extinguished bonfire on the side of the road."
			},
			images: {
				0: "http://www.nelive.in/sites/default/files/Untitled-4%20%282%29.gif"
			},
			actors: { //actors in the room
				bonfire: {
					name: "Bonfire",
					descriptions: {
						0: "A pretty hot bonfire. Looks like a coin shines among the embers.",
						1: "A extinguished bonfire.  Looks like a coin shines among the embers.", //once you use the water to extinguish it
						2: "A extinguished bonfire."
					},
					images: {
						0: "https://68.media.tumblr.com/3b279a1c80608f8c6b350254ebaca533/tumblr_nv0pqzmWTF1uejtspo1_500.gif", //active bonfire animated gif with blinking shine
						1: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"  //exinguished bonfire
					},
					extinguish: function (game) { //change bonfire state and notify to the room
						this.extinguished = true;
						this.state.descriptionIndex = 1;
						this.state.imageIndex = 1;
						game.roomGetCurrent().bonfireExtinguished();
					},
					coinPickedUp: function () {
						this.state.descriptionIndex = 2;
					},
					"look at": function (game) { //make coin visible but let default look_at action work
						game.actorGetFromCurrentRoom("silver coin").state.visible = true;
					},
					use: function (game, secondActor) {
						if (secondActor.id === "invBottle") {
							if (!secondActor.state.filled) return game.outPutCreateFromAction("bottleEmpty");
							this.extinguish(game);
							secondActor.empty();
							game.actorGetFromCurrentRoom("silver coin").state.collectible = true;
							return game.outPutCreateFromAction("extinguish");
						}
					}
				},
				"silver coin": {
					name: "Silver coin",
					descriptions: {
						0: "A silver coin shines among the bonfire embers. I can not see the details."
					},
					inventoryActor: "invCoin", //globalResources.actors Id reference. invCoin will be added to player inventory as default pick up action
					"pick up": function (game) { //can not pick up untin bonfire is extinguished
						if (!this.state.collectible) return game.outPutCreateFromAction("hotCoin");
						game.actorGetFromCurrentRoom("bonfire").coinPickedUp();
						return null;
					}
				}
			},
			bonfireExtinguished: function () {
				this.state.descriptionIndex = 1;//change room state (description) when bonfire is extinguished
			},
			exits: {//exits from this room (exitText : roomID)
				"Mansion yard": "A Fountain"
				//east: null, //a null value shows the player the option but response with "No way to go"
				//south: null,
				//west: null
			}
		},
		"A Fountain": {
			name: "A Fountain",
			descriptions: {
				0: "You are near a fountain. It is in front of a huge mansion. There is a empty bottle just besides the fountain and an armed guard at the mansion entrance.",
				1: "You are near a fountain. It is in front of a huge mansion. There is an armed guard at the mansion entrance.", //once you pick up the bottle
				2: "You are near a fountain. It is in front of a huge mansion."//once the guard left
			},
			images: {
				0: "http://conacpolizu.ro/ro/wp-content/uploads/sites/3/2015/10/cine1.gif"
			},
			guardLeft: function () {
				this.state.descriptionIndex = 2;
			},
			actors: {
				bottle: {
					name: "Bottle",
					descriptions: {
						0: "It is a empyt bottle"
					},
					images: {
						0: "https://media.giphy.com/media/12IK01JJiBXtvi/giphy.gif"
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
						0: "https://hugemega.files.wordpress.com/2014/04/owl14.gif"
					},
					use: function (game, secondActor) {
						if (secondActor.id === "invBottle") {
							secondActor.fill();
							return game.outPutCreateFromAction("fillBottle");
						}
					}
				},
				guard: {
					name: "Armed guard",
					descriptions: {
						0: "A guard with an axe that keeps you form enter the mansion."
					},
					images: {
						0: "http://www.animated-gifs.eu/category_war/war-old/erzherzog_siegmund_kb_ha.gif"
					},
					"talk to": function (game) {
						return game.outPutCreateFromAction("youShallNotPass"); //output from definded globalResources.actions example
					},
					push: function (game) {
						return game.outPutCreateRaw("To a guard with an axe? No way!"); //raw output example
					},
					pull: function (game) {
						return game.outPutCreateRaw("To a guard with an axe? No way!");
					}
				}
			},
			exits: {
				"Inside mansion": "Mansion",
				//		east: null,
				"Burnt bridge": "Start Gate"
				//		west: null
			},
			bottlePickedUp: function () {
				this.state.descriptionIndex = 1;
			},
			go: function (game, direction) { //restrict movement at room level until condition is met
				if (direction === "Inside mansion") {
					if (!game.actorGetFromCurrentRoom("guard").state.removed) {
						return game.outPutCreateFromAction("youShallNotPass");
					}
				}
			}
		},
		Mansion: {
			name: "Mansion",
			descriptions: {
				0: "You are in the hall of a huge mansion. Cthulhu is here \u{1F419} and is going to eat your soul. You have finally found a purpose for your miserable existence. This is the of end the demo. Now go and make a great adventure with SCUNM engine!"
			},
			images: { 0: "http://68.media.tumblr.com/8151d789c24e297a14f5de9305a4526a/tumblr_o1tljezAKb1um9ovfo9_r3_500.gif" },
			exits: {
				//			north: null,
				//			east: null,
				"Back to the yard": "A Fountain"
				//			west: null
			}
		}
	}
};