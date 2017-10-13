var assert = require('assert');
var rewire = require("rewire");
var engine = rewire("SCUNMEngine");

describe('Engine API injection', function () {
	var game = {};
	var injectGameAPI = engine.__get__('injectGameAPI');
	injectGameAPI(game);
	it('Should create roomGetCurrent function', function () {
		assert.ok(game.roomGetCurrent);
	});
	it('Should create roomSetCurrent function', function () {
		assert.ok(game.roomSetCurrent);
	});
	it('Should create roomGet function', function () {
		assert.ok(game.roomGet);
	});
	it('Should create actorGetFromCurrentRoom function', function () {
		assert.ok(game.actorGetFromCurrentRoom);
	});
	it('Should create actorGetFromRoom function', function () {
		assert.ok(game.actorGetFromRoom);
	});
	it('Should create actorGetFromInventory function', function () {
		assert.ok(game.actorGetFromInventory);
	});
	it('Should create actorGetFromGlobal function', function () {
		assert.ok(game.actorGetFromGlobal);
	});
	it('Should create outPutCreateRaw function', function () {
		assert.ok(game.outPutCreateRaw);
	});
	it('Should create outPutCreateFromRoom function', function () {
		assert.ok(game.outPutCreateFromRoom);
	});
	it('Should create outPutCreateFromCurrentRoom function', function () {
		assert.ok(game.outPutCreateFromCurrentRoom);
	});
	it('Should create outPutCreateFromActor function', function () {
		assert.ok(game.outPutCreateFromActor);
	});
	it('Should create outPutCreateFromRoomActors function', function () {
		assert.ok(game.outPutCreateFromRoomActors);
	});
	it('Should create outPutCreateFromInventory function', function () {
		assert.ok(game.outPutCreateFromInventory);
	});
	it('Should create outPutCreateFromRoomExits function', function () {
		assert.ok(game.outPutCreateFromRoomExits);
	});
	it('Should create outPutCreateFromAction function', function () {
		assert.ok(game.outPutCreateFromAction);
	});
	it('Should create inventoryAddItem function', function () {
		assert.ok(game.inventoryAddItem);
	});
	it('Should create inventoryRemoveItem function', function () {
		assert.ok(game.inventoryRemoveItem);
	});
});

describe('Verbs Handler initialization', function () {
	var initVerbsHandlers = engine.__get__('initVerbsHandlers');

	describe('initAllDefaultVerbsHandler (game.globalResources.verbs does not exist)', function () {
		var game = { globalResources: {} }; //globalResources is mandatory
		initVerbsHandlers(game);
		it('Should create go function', function () {
			assert.ok(game.globalCommands.go);
		});
		it('Should create inspect function', function () {
			assert.ok(game.globalCommands.inspect);
		});
		it('Should create inventory function', function () {
			assert.ok(game.globalCommands.inventory);
		});
		it('Should create give function', function () {
			assert.ok(game.globalCommands.give);
		});
		it('Should create look at function', function () {
			assert.ok(game.globalCommands["look at"]);
		});
		it('Should create talk to function', function () {
			assert.ok(game.globalCommands["talk to"]);
		});
		it('Should create open function', function () {
			assert.ok(game.globalCommands.open);
		});
		it('Should create close function', function () {
			assert.ok(game.globalCommands.close);
		});
		it('Should create push function', function () {
			assert.ok(game.globalCommands.push);
		});
		it('Should create pick up function', function () {
			assert.ok(game.globalCommands["pick up"]);
		});
	});

	describe('initDefaultVerbsHandler (game.globalResources.verbs with all default verbs)', function () {
		var game = { globalResources: { verbs: ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"] } };
		initVerbsHandlers(game);
		it('Should create go function', function () {
			assert.ok(game.globalCommands.go);
		});
		it('Should create inspect function', function () {
			assert.ok(game.globalCommands.inspect);
		});
		it('Should create inventory function', function () {
			assert.ok(game.globalCommands.inventory);
		});
		it('Should create give function', function () {
			assert.ok(game.globalCommands.give);
		});
		it('Should create look at function', function () {
			assert.ok(game.globalCommands["look at"]);
		});
		it('Should create talk to function', function () {
			assert.ok(game.globalCommands["talk to"]);
		});
		it('Should create open function', function () {
			assert.ok(game.globalCommands.open);
		});
		it('Should create close function', function () {
			assert.ok(game.globalCommands.close);
		});
		it('Should create push function', function () {
			assert.ok(game.globalCommands.push);
		});
		it('Should create pick up function', function () {
			assert.ok(game.globalCommands["pick up"]);
		});
	});

	describe('overrideDefaultVerbs (game.globalComads.go is defined in assets to be overriden)', function () {
		var game = { globalResources: {}, globalCommands: { go: function () { return "go overridden"; } } };
		initVerbsHandlers(game);
		it('Should create go function', function () {
			assert.ok(game.globalCommands.go);
		});
		it('Go function should return "go overridden" message', function () {
			assert.equal(game.globalCommands.go(), "go overridden");
		});
	});

	describe('create custom verb (jump)', function () {
		var game = { globalResources: { verbs: ["jump"] }, globalCommands: { jump: function () { return "fence jumped"; } } };
		initVerbsHandlers(game);
		it('Should create jump function', function () {
			assert.ok(game.globalCommands.jump);
		});
		it('jump function should return "fence jumped" message', function () {
			assert.equal(game.globalCommands.jump(), "fence jumped");
		});
	});
});

describe('Actors and Rooms ID initialization', function () {
	var initIDs = engine.__get__('initIDs');
	var game = {
		globalResources: {
			actors: {
				invCoin: {}
			}
		},
		rooms: {
			testRoom: {
				actors: {
					bonfire: {}
				}
			}
		}
	};
	initIDs(game);
	it('Should create game.globalResources.actors.invCoin.id', function () {
		assert.ok(game.globalResources.actors.invCoin.id);
	});
	it('game.globalResources.actors.invCoin.id should be invCoin', function () {
		assert.equal(game.globalResources.actors.invCoin.id, 'invCoin');
	});
	it('Should create game.rooms.testRoom.id', function () {
		assert.ok(game.rooms.testRoom.id);
	});
	it('game.rooms.testRoom.id should be testRoom', function () {
		assert.equal(game.rooms.testRoom.id, "testRoom");
	});
	it('Should create game.rooms.testRoom.actors.bonfire.id', function () {
		assert.ok(game.rooms.testRoom.actors.bonfire.id);
	});
	it('game.rooms.testRoom.actors.bonfire.id should be bonfire', function () {
		assert.equal(game.rooms.testRoom.actors.bonfire.id, "bonfire");
	});
});

describe('Actors and Rooms state initialization', function () {
	var initState = engine.__get__('initState');
	describe('init all default game state', function () {
		var defaultActorState = {
			descriptionIndex: 0,
			imageIndex: 0,
			visible: true,
			collectible: false,
			removed: false
		};
		var defaultRoomState = {
			descriptionIndex: 0,
			imageIndex: 0
		};
		var game = {
			state: {},
			globalResources: {
				actors: {
					invCoin: {}
				}
			},
			rooms: {
				testRoom: {
					actors: {
						bonfire: {}
					}
				}
			}
		};
		initState(game);
		it('should create empty inventory', function () {
			assert.ok(game.state.inventory);
		});
		it('should create game.state.actors', function () {
			assert.ok(game.state.actors);
		});
		it('should create game.state.actors.invCoin', function () {
			assert.ok(game.state.actors.invCoin);
		});
		it('should game.state.actors.invCoin be default state', function () {
			assert.deepEqual(game.state.actors.invCoin, defaultActorState);
		});
		it('should create game.state.rooms state', function () {
			assert.ok(game.state.rooms);
		});
		it('should create game.state.rooms.testRoom', function () {
			assert.ok(game.state.rooms.testRoom);
		});
		it('should game.state.rooms.testRoom be default state', function () {
			assert.deepEqual(game.state.rooms.testRoom, defaultRoomState);
		});
		it('should create game.state.actors.bonfire', function () {
			assert.ok(game.state.actors.bonfire);
		});
		it('should game.state.actors.bonfire be default state', function () {
			assert.deepEqual(game.state.actors.bonfire, defaultActorState);
		});
	});
	describe('override default game state', function () {
		var overridenActorState = {
			descriptionIndex: 1,
			imageIndex: 1,
			visible: false,
			collectible: true,
			removed: true
		};
		var overridenRoomState = {
			descriptionIndex: 1,
			imageIndex: 1
		};
		var game = {
			state: {
				actors: {
					invCoin: overridenActorState,
					bonfire: overridenActorState
				},
				rooms: {
					testRoom: overridenRoomState
				}
			},
			globalResources: {
				actors: {
					invCoin: {}
				}
			},
			rooms: {
				testRoom: {
					actors: {
						bonfire: {}
					}
				}
			}
		};
		initState(game);
		it('should override global actor state (game.state.actors.invCoin)', function () {
			assert.deepEqual(game.state.actors.invCoin, overridenActorState);
		});
		it('should override room state (game.state.rooms.testRoom)', function () {
			assert.deepEqual(game.state.rooms.testRoom, overridenRoomState);
		});
		it('should override local room actor (game.state.actors.bonfire)', function () {
			assert.deepEqual(game.state.actors.bonfire, overridenActorState);
		});
	});
	describe('keep custom game state', function () {
		var game = {
			state: {
				player: {brokenleg: false}
			},
			globalResources: {
				actors: {
					invCoin: {}
				}
			},
			rooms: {
				testRoom: {
					actors: {
						bonfire: {}
					}
				}
			}
		};
		initState(game);
		it('should override global actor state (game.state.actors.invCoin)', function () {
			assert.deepEqual(game.state.actors.invCoin, overridenActorState);
		});
		it('should override room state (game.state.rooms.testRoom)', function () {
			assert.deepEqual(game.state.rooms.testRoom, overridenRoomState);
		});
		it('should override local room actor (game.state.actors.bonfire)', function () {
			assert.deepEqual(game.state.actors.bonfire, overridenActorState);
		});
	});

});

describe('Initial state creation', function () {
	var CreateInitialState = engine.__get__('CreateInitialState');
	var game = {
		state: {
			actors: {
				invCoin: {
					descriptionIndex: 1,
					imageIndex: 1,
					visible: false,
					collectible: true,
					removed: true
				},
				bonfire: {
					descriptionIndex: 1,
					imageIndex: 1,
					visible: false,
					collectible: true,
					removed: true
				}
			},
			rooms: {
				testRoom: {
					descriptionIndex: 1,
					imageIndex: 1
				}
			}
		},
		globalResources: {
			actors: {
				invCoin: {}
			}
		},
		rooms: {
			testRoom: {
				actors: {
					bonfire: {}
				}
			}
		}
	};
	var expectedState = game.state;
	var outputState = CreateInitialState(game);
	it('states should be equal', function () {
		assert.deepEqual(expectedState,outputState);
	});
	it('should not be a object reference', function () {
		outputState.actors.invCoin.visible = true;
		assert.notDeepEqual(expectedState,outputState);
	});
});