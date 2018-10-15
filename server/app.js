const express = require("express");
const app = express();
const path = __dirname + '/app.js';

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = process.env.PORT || 8080;

function guid() {
	function s4() {
	  return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

var game = { id: guid(), white: null, black: null };
var games = [];

io.set('origins', '*:*');
io.on('connection', async (socket) => {
	console.log("Client Successfully Connected");

	socket.on('auth', (auth) => { 

		if (!game.white) {
			game.white = auth.userId;
			io.emit(auth.userId, {type: 'SET_WHITE', game: game.id}); 
		} else if (!game.black) {
			game.black = auth.userId;
			io.emit(auth.userId, {type: 'SET_BLACK', game: game.id, whiteId: game.white }); 
			io.emit(game.white, {move: 'START', blackId: game.black});
			games[game.id] = game;
			game = { id: guid(), white: null, black: null };
		}
		
	})
})

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});