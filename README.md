# SCUNM

This is Script Creation Utility for Nodejs Maniacs; a text adventure game engine and Telegram bot as host, writen in node.js. The engine aims to be easily consumed by a Telegram ChatBot through standarized output that allows text, images (even animated gifs) and interactive selection although different hosts and UI are possible.

Instead of free text input, the UI will show custom keyboard for verbs and inline buttons for interactive things that the user will use to send commands to the game engine.

The engine keeps in memory shared game assets for all players and allows the host to load and unload the game state for each player on request. This is perfect for host the engine on server and use it through stateless protocols (i.e. HTTP ).

Game assets are defined using plain javascript object initializer with embedded game custom scrips and images will be http references from any host (your host site, google drive, dropbox, ms onedrive, etc should work).

It is in Alpha state. You can fork it and pull request.