/**
 * Copyright (c) 2016-2017, BeiJing MingZhiYuYin Technology Inc. All rights reserved.
 */
'use strict';

const socketio = require('socket.io');
const events = require('events');
const connect = require('connect');
const server = connect();
const fs = require('fs');
const options2 = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};
const https = require('https').createServer(options2,server);
const io = socketio(https);
const { readBuffer, Wav } = require('./audioUtil');

class laudio{};

laudio.emitter=new events.EventEmitter(this);

laudio.on=function(eventName,callback){
	laudio.emitter.on(eventName,callback);
}

laudio.emitEvent=function(eventName,arg){
	laudio.emitter.emit(eventName,arg);
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
  socket.on('addAudio', function(data){
    laudio.emitEvent('newAudio',data.id);
    if(data.stream){
      let a = new Wav(data.stream);
      console.log(a.buffer);
      io.emit('sendAudio',a.buffer);
    }
  });
});

https.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = laudio;