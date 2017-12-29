const connect = require('connect');
const servestatic = require('serve-static');
const http = require('http');
const config = require('./config.json');
const fs = require('fs');
const url = require('url');
const wc = require('wechaty');
const qs = require('querystring'); 
const Wechaty = wc.Wechaty;
const Contact = wc.Contact;

const bot = Wechaty.instance();
const server = connect();

let options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','ogg','mp3','wav'],
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

let qUrl = '';
let username = '';
bot.on('scan',(url,code)=>{
  console.log(`二维码地址为 ${url}`)
  qUrl = url;
});
bot.on('login',user=>{
  username = user.name();
});
// bot.start();

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