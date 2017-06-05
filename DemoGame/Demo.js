module.exports.Demo = {
	meta: {
		name: "Demo",
		authors: ["jlvaquero"],
		description: "Just a demo."
	},
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
			coin: {
				visible: false
			}
		}
	},//end game state
	//game assets
	globalResources: {
		actions: {
			extinguish: {
				description: "A dense cloud of steam raises when you throw the water into the bonfire.",
				image: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"  //animated gif
			},
			fillBottle: {
				description: "You fill the bottle with the water of the fountain.",
				image: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"  //animated gif
			},
			hotCoin: {
				description: "Auch! The coin is too hot.You can not do that"
			},
			bottleEmpty: {
				description: "The bottle is empty."
			},
			youShallNotPass: {
				description: "The guard says: Give me a Dragon and I let you pass."
			},
			giveCoin: {
				description: "The guard takes the coin and left."
			}
		},
		actors: {
			invCoin: {
				name: "Silver Coin",
				descriptions: {
					0: "A silver coin."
				},
				images: {
					0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
				},
				give: function (game, secondActor) {
					if (!secondActor) return null;
					if (secondActor.id !== "guard") return null;
					secondActor.state.removed = true;//guard left
					game.inventoryRemoveItem(this);//coin removed from inventory
					return game.outPutCreateFromAction("giveCoin");
				},
				use: function (game, secondActor) {
					if (!secondActor) return null;
					return game.outPutCreateRaw("There is no coin slot!");
				}
			},
			invBottle: {
				name: "Bottle",
				descriptions: {
					0: "It is a empyt bottle",
					1: "It is a bottle with some water" //once you fill the bottle in the fountain
				},
				images: {
					0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif",
					1: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
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

					if (secondactor.id === "fountain") {
						this.fill();
						return game.outPutCreateFromAction("fillBottle");
					}
					if (secondactor.id === "bonfire") {
						if (!this.state.filled) return outPutCreateFromAction("bottleEmpty");
						secondactor.extinguish();
						this.empty();
						game.actorGetFromCurrentRoom("coin").collectible = true;
						return game.outPutCreateFromAction("extinguish");
					}
				}
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
				0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif",
				1: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
			},
			actors: {
				bonfire: {
					name: "Bonfire",
					descriptions: {
						0: "A pretty hot bonfire. Looks like a coin shines among the embers.",
						1: "A extinguished bonfire.  Looks like a coin shines among the embers.", //once you use the water to extinguish it
						2: "A extinguished bonfire."
					},
					images: {
						0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif",
						1: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
					},
					extinguish: function () {
						this.extinguished = true;
						var index = game.actorGetFromCurrentRoom("coin").state.removed ? 2 : 1;
						this.state.descriptionIndex = index;
						this.state.imageIndex = index;
					},
					"look at": function (game) {
						game.actorGetFromCurrentRoom("coin").state.visible = true;
					},
					use: function (game, secondActor) {
						if (!secondActor) return;
						if (secondActor.id === "invBottle") {
							if (!secondActor.state.filled) return outPutCreateFromAction("bottleEmpty");
							this.extinguish();
							secondActor.empty();
							game.actorGetFromCurrentRoom("coin").state.collectible = true;
							return game.outPutCreateFromAction("extinguish");
						}
					}
				},
				coin: {
					name: "Silver coin",
					descriptions: {
						0: "A silver coin."
					},
					images: {
						0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
					},
					inventoryActor: "invCoin",
					"pick up": function (game) {
						var outPut = this.state.collectible ? game.roomGetCurrent().coinPickedUp() : game.outPutCreateFromAction("hotCoin");
						return outPut;
					}
				}
			},
			exits: {
				north: "A Fountain",
				east: null,
				south: null,
				west: null
			},
			coinPickedUp: function () {
				this.state.descriptionIndex = 1;
				this.state.imageIndex = 1;
			}
		},
		"A Fountain": {
			name: "A Fountain",
			descriptions: {
				0: "You are near a fountain. It is in front of a huge mansion. There is a empty bottle just besides the fountain and an armed guard at the mansion entrance.",
				1: "You are near a fountain. It is in front of a huge mansion. There is an armed guard at the mansion entrance."//once you pick up the bottle
			},
			images: {
				0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
			},
			actors: {
				bottle: {
					name: "Bottle",
					descriptions: {
						0: "It is a empyt bottle"
					},
					images: {
						0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
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
						0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
					},
					use: function (game, secondActor) {
						if (!secondActor) return;
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
						0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif"
					},
					"talk to": function (game) {
						return game.outPutCreateFromAction("youShallNotPass");
					},
					push: function (game) {
						return game.outPutCreateRaw("To an guard with an axe? No way!");
					},
					pull: function (game) {
						return game.outPutCreateRaw("To an guard with an axe? No way!");
					},
					give: function (game, secondActor) {
						if (!secondActor) return null;
						if (secondActor.id !== "invCoin") return null;
						this.state.removed = true;//guard left
						game.inventoryRemoveItem(secondActor);//coin removed from inventory
						return game.outPutCreateFromAction("giveCoin");
					}
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
				if (direction === "north") {
					if (!game.actorGetFromCurrentRoom("guard").state.removed) {
						return game.outPutCreateFromAction("youShallNotPass");
					}
				}
			}
		},
		Mansion: {
			name: "Mansion",
			descriptions: {
				0: "You are in the hall of a huge mansion. Seems abandoned. This is the end of the demo. Now go and make a great adventure with SCUNM engine!"
			},
			images: { 0: "http://www.ks.uiuc.edu/Training/SumSchool/materials/sources/tutorials/01-vmd-tutorial/vmd-tutorial-pictures/placeholder.gif" },
			exits: {
				north: null,
				east: null,
				south: "A Fountain",
				west: null
			}
		}
	}
};