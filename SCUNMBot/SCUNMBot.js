﻿module.exports = function (token, options, engine, store) {
	var TelegramBot = require("node-telegram-bot-api");
	var verbsKeyboard = createKeyboard(engine.verbs);

	bot = new TelegramBot(token, options);
	engine.on("stateChanged", (state) => {
		store.set(state.key, state);//handle game state changes
	});
	setEvents(bot, engine, store, verbsKeyboard);

  /*bot.setWebHook(options.webHook.url + "/bot" + token, {
    certificate: options.webHook.cert,
    max_connections: options.webHook.maxconn,
    allowed_updates: ["message", "callback_query"]
  });*/

	return bot;
};

function createKeyboard(verbArray) {
	var verbsKeyboardMarkUp = [];

	var part = 3;
	for (var i = 0; i < verbArray.length; i += part) { //create keyboard layout
		verbsKeyboardMarkUp.push(verbArray.slice(i, i + part).map(function (verb) { return { text: verb }; }));
	}

	return {
		keyboard: verbsKeyboardMarkUp,
		resize_keyboard: true,
		one_time_keyboard: false
	};
}

function createInlineButtons(selection) {
	if (!selection || !selection.list) return null;
	var actorsKeyboardMarkUp = [];

	var part = 2;
	for (var i = 0; i < selection.list.length; i += part) {  //create inlinebuttons layout
		actorsKeyboardMarkUp.push(selection.list.slice(i, i + part).map(function (actor) { return { text: actor.name, callback_data: selection.command + " " + actor.id }; }));
	}

	return {
		inline_keyboard: actorsKeyboardMarkUp
	};
}

function parseQueryData(data) {
	var cmndLst = data.split(" ");
	cmndLst.forEach(function (value, indx) {
		cmndLst[indx] = cmndLst[indx].replace("_", " "); //from "pick_up silver_coin" to ["pick up", "silver coin" ]
	});
	return cmndLst;
}

//need refactor share too much commmon code

function setEvents(bot, engine, store, verbsKeyboard) {
	bot.onText(/^\/start$/, async function (msg, match) {
		var userId = msg.from.id;
		var storeKey = userId + ":" + engine.name();
		var gameState = JSON.parse(await store.get(storeKey));
		if (!gameState) {
			store.set(storeKey, JSON.stringify(engine.initialState));
			gameState = engine.initialState;
		}
		engine.setState(gameState);
		var outPut = engine.continue();
		if (outPut.imgURL) {
			await bot.sendDocument(userId, outPut.imgURL);  //await to always send img first
		}
		await bot.sendMessage(userId, outPut.text, {
			reply_markup: verbsKeyboard
		});
	});

	bot.onText(/^\/restart$/, async function (msg) {
		var userId = msg.from.id;
		var storeKey = userId + ":" + engine.name();
		engine.reset();
		store.set(storeKey, JSON.stringify(engine.getState()));
		var outPut = engine.continue();
		if (outPut.imgURL) {
			await bot.sendDocument(userId, outPut.imgURL);  //await to always send img first
		}
		await bot.sendMessage(userId, outPut.text, {
			reply_markup: verbsKeyboard
		});
	});

	engine.verbs.forEach(function (verb) {  //handler for every verb
		bot.onText(new RegExp("^" + verb + "$"), async function (msg) {
			var userId = msg.from.id;
			var storeKey = userId + ":" + engine.name();
			var gameState = JSON.parse(await store.get(storeKey));
			gameState.key = storeKey;
			engine.setState(gameState);
			var outPut = engine.execCommand(verb);
			var inlineButtons = createInlineButtons(outPut.selection);
			if (outPut.imgURL) {
				await bot.sendDocument(userId, outPut.imgURL);
			}
			await bot.sendMessage(userId, outPut.text, {
				reply_markup: inlineButtons
			});
		});
	});

	bot.on("callback_query", async function (msg) { //handle inline buttons callbacks
		var userId = msg.from.id;
		var storeKey = userId + ":" + engine.name();
		var gameState = JSON.parse(await store.get(storeKey));
		gameState.key = storeKey;
		engine.setState(gameState);
		var clientQuery = parseQueryData(msg.data);
		var outPut = engine.execCommand.apply(engine, clientQuery);
		var inlineButtons = createInlineButtons(outPut.selection);
		if (outPut.imgURL) {
			await bot.sendDocument(userId, outPut.imgURL);
		}
		await bot.sendMessage(userId, outPut.text, {
			reply_markup: inlineButtons
		});
		bot.answerCallbackQuery(msg.id);
	});
}