const express = require('express');
const app = express();
const static = express.static('static'); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(static);

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});