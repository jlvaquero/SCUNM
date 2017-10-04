var assert = require('assert');
var rewire = require("rewire");
var engine = rewire("SCUNMBot");

describe('Engine API injection', function () {
	
	var createKeyboard = engine.__get__('createKeyboard');
	var input = ["give", "pick up", "use", "open", "look at", "push", "close", "talk to", "pull", "go", "inventory"];
	var expectedOutPut = {
		keyboard: verbsKeyboardMarkUp,
		resize_keyboard: true,
		one_time_keyboard: false
	};

	it('Should return telegram keyboard markup', function () {
		assert.deepEqual(createKeyboard(input), expectedOutPut);
	});

});