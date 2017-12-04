const connect = require('connect');
const servestatic = require('serve-static');
const http = require('http');

const server = connect();

let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: ['index.html'],
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.setHeader('x-timestamp', Date.now());
    }
  };
server.use(servestatic('./',options));

http.createServer(server).listen(12345);