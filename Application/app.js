var redis = require("redis");
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var store = redis.createClient({ host: "127.0.0.1", port: 6379 });

var gamesAssets = require("SCUNM-demo-game");
var demoEngine = require("SCUNMEngine")(gamesAssets.Demo);
var SCUNMBot = require("scunmBot");

var options = { polling: true };

var myGameBot = new SCUNMBot("399277036:AAHcs_4T6RBK2IjJEwSMKMWH69P2QmBjhOE", options, demoEngine, store);

