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

app.use(express.static('build'));

io.set('origins', '*:*');
io.on('connection', async (socket) => {
	app.get('/', function(req, res) {
		res.sendFile(__dirname + "/build/index.html");
	});
	
	app.post('/newgame', function(req, res) {
		let id = guid();
	
		try {
			let game = {id:id, title: req.body.title,  whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time };
			games[id] = game;
	
			socket.broadcast('game');
		} catch(err) {
			return res.status(500).send(err);
		}
	
		console.log(req.body.whitePlayer);
		return res.status(200).json({type: req.body.whitePlayer == undefined || req.body.whitePlayer == null || req.body.whitePlayer == '' ? 'SET_BLACK' : 'SET_WHITE', game: id, title: req.body.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
	});

	app.post('/joingame', function(req, res) {
		let id = guid();

		let game;
		let result; 
	
		try {
			let game = {id:id, title: req.body.title,  whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time };
			games[id] = game;

			game = games[req.body.game];
			delete games[req.body.game];
			socket.broadcast('game');
            
            if (game.whitePlayer == undefined || game.whitePlayer == null || game.whitePlayer == '') {
                result = {type: 'SET_WHITE', game: req.body.game, title: game.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: game.time };
            } else {
                result = {type: 'SET_BLACK', game: req.body.game, title: game.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: game.time };
            }
		} catch(err) {
			return res.status(500).send(err);
		}
	
		console.log(req.body.whitePlayer);
		return res.status(200).json(result);
	});

	app.post('/subscribe', function(req, res) {
		let id = guid();

        try {
			await Game.subscribe(req, [req.body.event]);
		} catch(err) {
			return res.status(500).send(err);
        }

		return res.status(200).send();
	});

	/*socket.on('auth', (player) => { 
		console.log(player);
		if (!game.whitePlayer) {
			console.log('white: ' + player.Id);
			game.whitePlayer = player;
			io.emit(player.Id, {type: 'SET_WHITE', game: game.id, whitePlayer: player, time: game.whitePlayer.Time }); 

			console.log('listening game ' + game.id);
			socket.on(game.id, (message) => {
				console.log('sending to ' + message.to);
				console.log(message);
				io.emit(message.to, message.action);
			});
		} else if (!game.blackPlayer) {
			console.log('black: ' + player.Id);
			game.blackPlayer = player;
			io.emit(player.Id, {type: 'SET_BLACK', game: game.id, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer, time: game.whitePlayer.Time }); 
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
	});*/
});

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});