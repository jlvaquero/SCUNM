module.exports = function (token, options, engine, store) {

	var TelegramBot = require("node-telegram-bot-api");
	var verbsKeyboard = createKeyboard(engine.verbs);

	var bot = new TelegramBot(token, options);
	setEvents(bot, engine.verbs, verbsKeyboard);
	if (!options.polling) bot.setWebHook(options.url + "/bot" + token);

}

function createKeyboard(verbArray) {
	var verbsKeyboardMarkUp = [];

	var part = 3;
	for (var i = 0; i < verbArray.length; i += part) {
		verbsKeyboardMarkUp.push(verbArray.slice(i, i + part).map(function (verb) { return {text : verb}}));
	}

	return {
		keyboard: verbsKeyboardMarkUp,
		resize_keyboard: true,
		one_time_keyboard: false
	};
}

function createInlineButtons(selection) {
	var actorsKeyboardMarkUp = [];

	var part = 3;
	for (var i = 0; i < selection.list.length; i += part) {
		actorsKeyboardMarkUp.push(selection.list.slice(i, i + part).map(function (actor) { return { text: actor.name, callback_data: selection.execCommand+ " " + actor.id } }));
	}

	return {
		inline_keyboard: actorsKeyboardMarkUp,
		resize_keyboard: true,
		one_time_keyboard: false
	};
}

function setEvents(bot, verbArray, verbsKeyboard) {

	bot.onText(/^\/start$/, function (msg, match) {
		var userId = msg.from.id;
		var storeKey = userId + ":" + engine.name;
		var gameState = await store.get(storeKey);
		if (!gameState) {
			store.set(storeKey, JSON.stringify(engine.initialState));
			gameState = engine.initialState;
		}
		engine.setState(gameState);
		var outPut = engine.continue();
		if (outPut.imgURL) {
			await bot.sendDocument(userId, outPut.imgURL);
		}
		await bot.sendMessage(userId, outPut.text, {
			reply_markup: verbsKeyboard
		});
	});

	bot.onText(/^\/restart$/, function (msg, match) {
		var userId = msg.from.id;
		var storeKey = userId + ":" + engine.name;
		engine.reset();
		store.set(storeKey, JSON.stringify(engine.getState));
		var outPut = engine.continue();
		if (outPut.imgURL) {
			await bot.sendDocument(userId, outPut.imgURL);
		}
		await bot.sendMessage(userId, outPut.text, {
			reply_markup: verbsKeyboard
		});
	});

	verbArray.forEach(function (verb) {
		bot.onText(new RegExp("^" + verb + "$"), function (msg, match) {
			var userId = msg.from.id;
			var storeKey = userId + ":" + demoEngine.name;
			var gameState = await store.get(storeKey);
			demoEngine.setState(gameState);
			var outPut = demoEngine.execCommand(verb);
			if (demoEngine.updatedState) { store.set(storeKey, JSON.stringify(engine.getState))}
			var inlineButtons = createOnlineButtons(outPut.selection);
			if (outPut.imgURL) {
				await bot.sendDocument(userId, outPut.imgURL);
			}
			await bot.sendMessage(userId, outPut.text, {
				reply_markup: inlineButtons
			});
		});

		bot.onText(new RegExp("^" + verb + "\s([\S]+)$"), function (msg, match) {
			var userId = msg.from.id;
			var storeKey = userId + ":" + demoEngine.name;
			var gameState = await store.get(storeKey);
			demoEngine.setState(gameState);
			var outPut = demoEngine.execCommand(verb, match[1]);
			var inlineButtons = createOnlineButtons(outPut.selection);
			if (outPut.imgURL) {
				await bot.sendDocument(userId, outPut.imgURL);
			}
			await bot.sendMessage(userId, outPut.text, {
				reply_markup: inlineButtons
			});
		});

		bot.onText(new RegExp("^" + verb + "\s([\S]+)\s([\S]+)$"), function (msg, match) {
			var userId = msg.from.id;
			var storeKey = userId + ":" + demoEngine.name;
			var gameState = await store.get(storeKey);
			demoEngine.setState(gameState);
			var outPut = demoEngine.execCommand(verb, match[1], match[2]);
			var inlineButtons = createOnlineButtons(outPut.selection);
			if (outPut.imgURL) {
				await bot.sendDocument(userId, outPut.imgURL);
			}
			await bot.sendMessage(userId, outPut.text, {
				reply_markup: inlineButtons
			});
		});
	});
}