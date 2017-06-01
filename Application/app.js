//var Redis = require('ioredis');
//var store = new Redis();
var gamesAssets = require("SCUNM-demo-game");
var demoEngine = require("SCUNMEngine")(gamesAssets.Demo);
var SCUNMBot = require('scunmBot');

var options = { polling: true };

var myGameBot = new SCUNMBot('399277036:AAHcs_4T6RBK2IjJEwSMKMWH69P2QmBjhOE', options, demoEngine, null);
//var outPut;
//outPut = demoEngine.continue();
//console.dir(outPut);

