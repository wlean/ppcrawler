const connect = require('connect');
const servestatic = require('serve-static');
const http = require('http');
const config = require('./config.json');
const fs = require('fs');
const url = require('url');
const qs = require('querystring'); 
const server = connect();

let options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','ogg','mp3','wav','js'],
  index: ['index.html'],
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.setHeader('x-timestamp', Date.now());
  }
};

server.use(servestatic('./error',options));
server.use(servestatic('./horse',options));
server.use(servestatic('./audioContext',options));
server.use(servestatic('./mp3/error',options));
  
server.use('/sendmsg',function(req,res){
  console.log(url.parse(req.url,true).query);
  res.end();
});

server.use('/weixin',function(req,res){
  console.log('获得登录二维码');
  res.end(qUrl);
});

server.use('/loginUser',function(req,res){
  console.log(username);
    res.end(username);
});

server.use(servestatic('./',options));

http.createServer(server).listen(12345);