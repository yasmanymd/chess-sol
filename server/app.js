const express = require("express");
const app = express();
const path = __dirname + '/app.js';
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port = process.env.PORT || 8080;

io.set('origins', '*:*');
io.on('connection', async (socket) => {
	console.log("Client Successfully Connected");

	io.emit('chat', "hello world1");
})

server.listen(port, () => {
	console.log("Backend Server is running on http://localhost:" + port);
});