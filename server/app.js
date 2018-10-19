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

var game = { id: guid(), whitePlayer: null, blackPlayer: null };
var games = [];

io.set('origins', '*:*');
io.on('connection', async (socket) => {
	socket.on('auth', (player) => { 
		console.log(player);
		if (!game.whitePlayer) {
			console.log('white: ' + player.Id);
			game.whitePlayer = player;
			io.emit(player.Id, {type: 'SET_WHITE', game: game.id, whitePlayer: player }); 

			console.log('listening game ' + game.id);
			socket.on(game.id, (message) => {
				console.log('sending to ' + message.to);
				console.log(message);
				io.emit(message.to, message.action);
			});
		} else if (!game.blackPlayer) {
			console.log('black: ' + player.Id);
			game.blackPlayer = player;
			io.emit(player.Id, {type: 'SET_BLACK', game: game.id, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer }); 
			io.emit(game.whitePlayer.Id, {type: 'START', blackPlayer: game.blackPlayer});

			console.log('listening game ' + game.id);
			socket.on(game.id, (message) => {
				console.log('sending to ' + message.to);
				console.log(message);
				io.emit(message.to, message.action);
			});
			
			games[game.id] = game;
			game = { id: guid(), whitePlayer: null, blackPlayer: null };
		}
	});
});

app.use(express.static('build'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/build/index.html");
});

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});