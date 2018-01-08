'use strict';
const laudio = require('./socket/server/laudio_service');

let test = {
  a(){
    laudio.a = 3;
    console.log('a have set value is 3');
  }
};

module.exports = test;