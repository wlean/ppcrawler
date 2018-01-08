const connect = require('connect');
const servestatic = require('serve-static');
const https = require('https');
const config = require('./config.json');
const fs = require('fs');
const url = require('url');
const qs = require('querystring'); 
const server = connect();
const laudio = require('./socket/server/laudio_service');
const index2 = require('./index2');

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
laudio.on('newAudio',(id)=>{
  console.log('new audio id is :',id);
});

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
  console.log();
  laudio.emitEvent('newAudio',123);
  res.end();
});

server.use('/dirList',function(req,res){
  fs.readdir('./',(err,files)=>{
    res.write(files.toString());
    res.end();
  });
});

server.use(servestatic('./',options));


const options2 = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};
https.createServer(options2,server).listen(12345);