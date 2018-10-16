const express = require("express");
const app = express();
const path = __dirname + '/app.js';

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = process.env.PORT || 8081;

function guid() {
	function s4() {
	  return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

var game = { id: guid(), whiteId: null, blackId: null };
var games = [];

io.set('origins', '*:*');
io.on('connection', async (socket) => {
	socket.on('auth', (auth) => { 

		if (!game.whiteId) {
			console.log('white: ' + auth.userId);
			game.whiteId = auth.userId;
			io.emit(auth.userId, {type: 'SET_WHITE', game: game.id, whiteId: game.whiteId }); 

			console.log('listening game ' + game.id);
			socket.on(game.id, (message) => {
				console.log('sending to ' + message.to);
				console.log(message);
				io.emit(message.to, message.action);
			});
		} else if (!game.blackId) {
			console.log('black: ' + auth.userId);
			game.blackId = auth.userId;
			io.emit(auth.userId, {type: 'SET_BLACK', game: game.id, whiteId: game.whiteId, blackId: game.blackId }); 
			io.emit(game.whiteId, {type: 'START', blackId: game.blackId});

			console.log('listening game ' + game.id);
			socket.on(game.id, (message) => {
				console.log('sending to ' + message.to);
				console.log(message);
				io.emit(message.to, message.action);
			});
			
			games[game.id] = game;
			game = { id: guid(), whiteId: null, blackId: null };
		}
	});
})

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});