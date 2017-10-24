var assert = require('assert');
var rewire = require("rewire");
var engine = rewire("SCUNMBot");

describe('Telegram UI output', function () {
	it('Should return telegram keyboard markup', function () {
		var createKeyboard = engine.__get__('createKeyboard');
		var input = ["give", "pick up", "use", "open"];
		var expectedOutPut = {
			keyboard: [[{ text: "give" }, { text: "pick up" }, { text: "use" }], [{ text: "open" }]],
			resize_keyboard: true,
			one_time_keyboard: false
		};
		assert.deepEqual(createKeyboard(input), expectedOutPut);
	});
	it('Should return telegram keyboard markup', function () {
		var createInlineButtons = engine.__get__('createInlineButtons');
		var input = {
			command: "look at",
			list: [{ name: "bottle", id: "bottle" }, { name: "coin", id: "coin" }, { name: "guard", id: "guard" }]
		};
		var expectedOutPut = {
			inline_keyboard: [
				[{ text: "bottle", callback_data: "look at bottle" }, { text: "coin", callback_data: "look at coin" }],
				[{ text: "guard", callback_data: "look at guard" }]
			]
		};
		assert.deepEqual(createInlineButtons(input), expectedOutPut);
	});
});

describe('Parse user input data', function () {
	it('Should parse input underscore "_" and return command array (form "verb cd ci" to ["verb", "cd","ci"])', function () {
		var parseQueryData = engine.__get__('parseQueryData');
		var input = "pick_up silver_coin";
		var expectedOutPut = ["pick up", "silver coin"];
		assert.deepEqual(parseQueryData(input), expectedOutPut);
	});
});