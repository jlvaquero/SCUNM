![logo](logo.png)              
# SCUNM
 
![badge](https://cdn4.iconfinder.com/data/icons/competition-soft/512/second_medal-128.png) Second prize winner in Spaghetti Code Fest at [ETSIS University](https://coredumped.es/2018/spaghetti-code-fest-resumen-premios/)

This is Script Creation Utility for Nodejs Maniacs; a text adventure game engine and Telegram bot as host, writen in node.js. The engine aims to be easily consumed by a Telegram ChatBot through standarized output that allows text, images (even animated gifs) and interactive selection although, thanks to the low coupling design, different hosts and UI are possible.

Instead of free text input, the UI will show custom keyboard for verbs and inline buttons for interactive things that the user will use to send commands to the game engine.

The engine keeps in memory shared game assets for all players and allows the host to load and unload the game state for each player on request. This is perfect for host the engine on server and use it through stateless protocols (i.e. HTTP ) in a multiuser enviroment.

Game assets are defined using plain javascript object initializer with embedded game custom scrips and images will be URL references from any host (your host site, google drive, dropbox, ms onedrive, etc should work).

Keep in mind that the priority is to easy the content creation for game designers; so a lot of concessions was made (read: technical debt and low resilence) to reach to a minimum viable product in its current state.

Game editor has just been born. Electron-React-Redux makes things easy ;)

It is in Alpha state. You can fork it and pull request.

# Runing in your machine

Create your bot with https://t.me/BotFather.

Change "var botTokenAuth = "399277036:AAHmfEFe3LcfDkvejKaz_RPxcNHhkQRvf2E"" in Application\app.js with the token botfather provides you.

Visual Studio 2017:
Open SCUNM.sln in VS. Restore Nuget packages for Redis. Restore NPM dependecies. Run Application\start.bat.

Other:
Restore NPM dependecies. Run redis server. Modify Application\app.js with redis connection config. Run "npm start".

You should be able to play Demo in your bot like in this video:

[![SCUNM Engine Video](http://img.youtube.com/vi/DKBtBOK7imI/0.jpg)](https://www.youtube.com/watch?v=DKBtBOK7imI "SCUNM Engine demo")






