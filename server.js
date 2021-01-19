const express = require('express');
const app = express();
const static = express.static('static'); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(static);

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
