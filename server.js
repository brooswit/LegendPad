const express = require('express');
const app = express();
const dist = express.static('dist'); 
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(dist);

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
