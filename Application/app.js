var redis = require("redis");
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var store = redis.createClient({ host: "127.0.0.1", port: 6379 });

var gamesAssets = require("SCUNM-demo-game");//load games assets
var Engine = require("SCUNMEngine");
var demoEngine = new Engine(gamesAssets.Demo);//create a engine for every game asset
var SCUNMBot = require("scunmBot");
var myGameBot = new SCUNMBot("399277036:AAGDd4oe5Y44XTebBXznX_4oxHdYEiI6OHA", { polling: true }, demoEngine, store);