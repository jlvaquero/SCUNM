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
		var game = { globalResources: {}}; //globalResources is mandatory
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
		var game = { globalResources: {verbs: ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"]}};
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
});