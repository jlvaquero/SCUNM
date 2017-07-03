var redis = require("ioredis");
var store = redis.createClient({ host: "127.0.0.1", port: 6379 });

var gamesAssets = require("SCUNM-demo-game");//load games assets
var Engine = require("SCUNMEngine");
var demoEngine = new Engine(gamesAssets.Demo);//create a engine for every game asset
var SCUNMBot = require("scunmBot");
var myGameBot = new SCUNMBot("399277036:AAHmfEFe3LcfDkvejKaz_RPxcNHhkQRvf2E", { polling: true }, demoEngine, store);