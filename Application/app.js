var Redis = require('ioredis');
var store = new Redis();
var gamesAssets = require("SCUNMGames");
var demoEngine = require("SCUNMEngine")(gamesAssets.Demo);
var SCUNMBot = require('scunmBot');

var options = { polling: true };

var myGameBot = new SCUNMBot('tokenbot', options, demoEngine, store);
