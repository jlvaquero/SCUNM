var gamesAssets = require("SCUNMGames");
var demoEngine = require("SCUNMEngine")(gamesAssets.Demo);
var TelegramBot = require('node-telegram-bot-api');
var token = '';
//var port = process.env.OPENSHIFT_NODEJS_PORT;
//var host = process.env.OPENSHIFT_NODEJS_IP;
//var externalUrl = process.env.OPENSHIFT_APP_DNS;
//var token = process.env.TOKEN || token;
var bot = new TelegramBot(token, {
 polling: true
});

bot.setKeyboard = function (verbArray) {
	var verbsKeyboardMarkUp = [];

	var part = 3;
	for (var i = 0; i < verbArray.length; i += part) {
		verbsKeyboardMarkUp.push(verbArray.slice(i, i + part));
	}

	this.verbsKeyboard = {
		keyboard: verbsKeyboardMarkUp,
		resize_keyboard: true,
		one_time_keyboard: false
	};
};

/*var bot = new TelegramBot(token, {
	webHook: {
		port: port,
		host: host
	}
});
bot.setWebHook(externalUrl + ':443/bot' + token);*/

//var Redis = require('ioredis');
//var redis = new Redis(6379, process.env.IP);
/*var redis = new Redis({
	port: process.env.OPENSHIFT_REDIS_DB_PORT, // Redis port
	host: process.env.OPENSHIFT_REDIS_DB_HOST, // Redis host
	password: process.env.OPENSHIFT_REDIS_DB_PASSWORD
});*/

//bot.setKeyboard(demoEngine.verbs);

/*bot.onText(/\/start$/, function (msg, match) {
	var fromId = msg.from.id;
	redis.set(fromId + ':comeFromInline', 'false');
	redis.set(fromId + ':query', '', 'EX', 300);
	bot.sendMessage(fromId, 'Hello ' + msg.from.first_name + '. What do you wish to do?', {
		reply_markup: optionsReplyKeyboard
	});
});*/

var res;

console.log("start");
console.log("> " + demoEngine.continue().text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at");
res = demoEngine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at key");
console.log("> " + demoEngine.execCommand("look at", "key").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at bonfire");
console.log("> " + demoEngine.execCommand("look at", "bonfire").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at");
res = demoEngine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at key");
console.log("> " + demoEngine.execCommand("look at", "key").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("pick up");
res = demoEngine.execCommand("pick up");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("pick up bonfire");
console.log("> " + demoEngine.execCommand("pick up", "bonfire").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("pick up key");
console.log("> " + demoEngine.execCommand("pick up", "key").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("go");
res = demoEngine.execCommand("go");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("go north");
console.log("> " + demoEngine.execCommand("go", "north").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at fountain");
console.log("> " + demoEngine.execCommand("look at", "fountain").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("look at bottle");
console.log("> " + demoEngine.execCommand("look at", "bottle").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("pick up bottle");
console.log("> " + demoEngine.execCommand("pick up", "bottle").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("inventory");
res = demoEngine.execCommand("inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("inspect invBottle");
console.log("> " + demoEngine.execCommand("inspect", "invBottle").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("go south");
console.log("> " + demoEngine.execCommand("go", "south").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("go north");
console.log("> " + demoEngine.execCommand("go", "north").text);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use");
res = demoEngine.execCommand("use");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use fountain");
res = demoEngine.execCommand("use", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use fountain fountain");
res = demoEngine.execCommand("use", "fountain", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use inventory");
res = demoEngine.execCommand("use", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use invBottle");
res = demoEngine.execCommand("use", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use invBottle inventory");
res = demoEngine.execCommand("use", "invBottle", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use invBottle invBottle");
res = demoEngine.execCommand("use", "invBottle", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use invBottle fountain");
res = demoEngine.execCommand("use", "invBottle", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");

console.log("use fountain invBottle");
res = demoEngine.execCommand("use", "fountain", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
if (demoEngine.updatedState) console.log("Save state into redis");