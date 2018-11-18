const express = require("express");
const app = express();
const path = __dirname + '/app.js';

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');

function guid() {
	function s4() {
	  return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

var game = { id: guid(), whitePlayer: null, blackPlayer: null };
var games = {};

app.disable('etag');
app.use(bodyParser.json());

app.get('/game', function(req, res) {
  console.log(games);
  res.json(games);
});

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
  
      console.log(games);
      socket.broadcast.emit('game');
		} catch(err) {
      console.log(err);
			return res.status(500).send(err);
		}
	
		console.log(req.body.whitePlayer);
		return res.status(200).json({type: req.body.whitePlayer == undefined || req.body.whitePlayer == null || req.body.whitePlayer == '' ? 'SET_BLACK' : 'SET_WHITE', game: id, title: req.body.title, whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer, time: req.body.time });
	});

	app.post('/joingame', function(req, res) {
		let result; 
		let opposite;
	
		try {
      var id = req.body.game;
			let game = Object.assign({}, games[id], {whitePlayer: req.body.whitePlayer, blackPlayer: req.body.blackPlayer});      
      delete games[id];
      
			socket.broadcast.emit('game');
            
      if (game.whitePlayer == undefined || game.whitePlayer == null || game.whitePlayer == '') {
					result = {type: 'SET_WHITE', game: id, title: game.title, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer, time: game.time };
					opposite = {type: 'SET_BLACK', game: id, title: game.title, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer, time: game.time };
      } else {
					result = {type: 'SET_BLACK', game: id, title: game.title, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer, time: game.time };
					opposite = {type: 'SET_WHITE', game: id, title: game.title, whitePlayer: game.whitePlayer, blackPlayer: game.blackPlayer, time: game.time };
      }
		} catch(err) {
			return res.status(500).send(err);
		}

		socket.broadcast.emit(id, opposite);
		return res.status(200).json(result);
	});	

	app.post('/execute', function(req, res) {
		console.log(req.body.game);
		console.log(req.body.action);
		try {
			socket.emit(req.body.game, req.body.action);
			socket.broadcast.emit(req.body.game, req.body.action);
		} catch(err) {
			return res.status(500).send(err);
		}

		return res.status(200).send();
	});	
});

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});