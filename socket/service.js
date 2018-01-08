const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');


app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        if (io.sockets.connected[socket.id]) {
          io.sockets.connected[socket.id].emit('chat message',{msg:'me'});
        }
        socket.emit('chat message',{msg:'me2'})
        io.emit('chat message', {msg:msg});
        if(msg=='mp3'){

          io.emit('chat message', {audio:fs.readFileSync('1.wav')});
        }
    });
  });
      

http.listen(3000, function(){
  console.log('listening on *:3000');
});