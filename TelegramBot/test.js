var gamesAssets = require("SCUNMGames");
var demoEngine = require("SCUNMEngine")(gamesAssets.Demo);

var res;
//console.log("> Commands: " + Object.keys(verbs).join(", ")); // this will be custom keyboard in telegram chat

console.log("start");
console.log("> " + demoEngine.continue().text);

console.log("look at");
res = demoEngine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + demoEngine.execCommand("look at", "key").text);

console.log("look at bonfire");
console.log("> " + demoEngine.execCommand("look at", "bonfire").text);

console.log("look at");
res = demoEngine.execCommand("look at");
console.log("> " + res.text);
console.dir(res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + demoEngine.execCommand("look at", "key").text);

console.log("pick up");
res = demoEngine.execCommand("pick up");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("pick up bonfire");
console.log("> " + demoEngine.execCommand("pick up", "bonfire").text);

console.log("pick up key");
console.log("> " + demoEngine.execCommand("pick up", "key").text);

console.log("go");
res = demoEngine.execCommand("go");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("go north");
console.log("> " + demoEngine.execCommand("go", "north").text);

console.log("look at fountain");
console.log("> " + demoEngine.execCommand("look at", "fountain").text);

console.log("look at bottle");
console.log("> " + demoEngine.execCommand("look at", "bottle").text);

console.log("pick up bottle");
console.log("> " + demoEngine.execCommand("pick up", "bottle").text);

console.log("inventory");
res = demoEngine.execCommand("inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("inspect invBottle");
console.log("> " + demoEngine.execCommand("inspect", "invBottle").text);

console.log("go south");
console.log("> " + demoEngine.execCommand("go", "south").text);

console.log("go north");
console.log("> " + demoEngine.execCommand("go", "north").text);

console.log("use");
res = demoEngine.execCommand("use");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use fountain");
res = demoEngine.execCommand("use", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use fountain fountain");
res = demoEngine.execCommand("use", "fountain", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use inventory");
res = demoEngine.execCommand("use", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle");
res = demoEngine.execCommand("use", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle inventory");
res = demoEngine.execCommand("use", "invBottle", "inventory");
console.log("> " + res.text); // this will be inline buttons in telegram chat
console.dir(res.selection.list);

console.log("use invBottle invBottle");
res = demoEngine.execCommand("use", "invBottle", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use invBottle fountain");
res = demoEngine.execCommand("use", "invBottle", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use fountain invBottle");
res = demoEngine.execCommand("use", "fountain", "invBottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("go south");
console.log("> " + execCommand(game, "go", "south").text);

console.log("use bottle bonfire");
console.log("> " + execCommand(game, "use", "bottle", "bonfire").text);

console.log("look at bonfire");
console.log("> " + execCommand(game, "look at", "bonfire").text);

console.log("pick up key");
console.log("> " + execCommand(game, "pick up", "key").text);

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);
console.log("pick up bottle");
console.log("> " + game.execCommand("pick_up", "bottle").description);
console.log("go south");
console.log("> " + game.execCommand("go", "south").description);
console.log("go north");
console.log("> " + game.execCommand("go", "north").description);
console.log(game.state.inventory);