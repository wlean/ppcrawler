/**
 * Copyright (c) 2016-2017, BeiJing MingZhiYuYin Technology Inc. All rights reserved.
 */

(function(window){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  
  function Raix(socket,audioId){
    let self = this;
    let _audioCtx = new AudioContext();
    /**
     * @type {AudioBufferSourceNode}
     */
    let _buffers = [];

    /**
     * @type {number} index of _buffers which is playing
     */
    let _playing = 0;

    /**
     * @type {AudioBufferSourceNode} playing AudioBufferSourceNode
     */
    let _playingSource = {};

    /**
     * @type {boolean} 
     */
    let _hasplay = false;

    /**
     * this audio is finished playing or not
     * @type {boolean}
     */
    self.isFinish = false;

    /**
     * get number of audio slices
     */
    self.length = function(){
      return _buffers.length;
    };
    
    /**
     * add audio slices to _buffers
     * @param {Buffer} buffer 
     * @param {number} index 
     */
    self.addAudio = function(buffer,index){
      _audioCtx.decodeAudioData(buffer,(decodedBuffer)=>{
        if(!index){
          _buffers.push(decodedBuffer);
        }else{
          _buffers[index-1] = decodedBuffer;
        }
        self.length++;
      },(e)=>{
        console.log(e.name+':'+e.message);
      });
    };

    /**
     * get the AudioBufferSourceNode that will play
     */
    self.getNextSource = function(){
      let source = _audioCtx.createBufferSource();
      let buffer = _buffers[_playing];
      if(!buffer) return null;
      self.isFinish = false;
      source.buffer = buffer; 
      source.connect(_audioCtx.destination);
      if (!source.start)
        source.start = source.noteOn;
      source.onended = function(){
        console.log('end one');
        _playing++;
        let next = self.getNextSource();
        if(next){
            next.playbackRate.value = source.playbackRate.value;
            next.start(0);
        }else{
            self.isFinish = true;
            self.emit('finish');
        }
      
      };
      _playingSource = source;
      return source;
    };

    self.play = function(){
      if(self.getNextSource()){
        self.getNextSource().start(0);
        self.emit('start');
        self.hasplay = true;
      }else{
        setTimeout(function(){
          self.play();
        },200);
      }
    };

    self.replay = function(){
      console.log('replay');
      _audioCtx.close();
      _audioCtx = new AudioContext();
      _playing = 0;
      self.play();
    };

    self.suspend = function(){
      _audioCtx.suspend();
    };

    self.resume = function(){
      _audioCtx.resume();
    };

    self.forward = function(){

    };

    self.rewind = function(){

    };

    self.changeSpeed = function(speed){
      _playingSource.playbackRate.value = speed;
    };

    self.events = {};
    self.on = function(eventName,callback){
      if(!eventName || !callback || typeof callback != 'function')
        console.log('监听参数不正确');
      else{
        if(self.events[eventName])
          self.events[eventName].push(callback);
        else 
          self.events[eventName] = [];
          self.events[eventName].push(callback);
      }
    };
    
    self.emit = function(eventName,data){
      if(!self.events[eventName]) return;
      for(let i in self.events[eventName]){
        self.events[eventName][i](data);
      }
    };

    /**
     * 重新加载音频，返回一个raix对象实例
     * @param {socket.io} socket 
     * @param {string} audioId 
     */
    self.reload = function(socket,audioId){
      _audioCtx.close();
      _audioCtx = new AudioContext();
      _buffers = [];
      _playing = -1;
      _playingSource = {};
      _hasplay = false;
      socket.emit('audio.request',{id:audioId});
      socket.on('audio.data'+audioId,function(data){
        if(data.code == 200){
          self.addAudio(data.buffer,data.index);
          if(!data.index)
            self.emit('ready',data.index);
          if(data.isFinish)
            self.emit('loaded');
        }else
          console.log('获取buffer失败');
      });
      return self;
    }
    
    /**
     * 加载音频，返回一个raix对象实例
     * @param {socket.io} socket 
     * @param {string} audioId 
     */
    self.load = function(socket,audioId){
      socket.emit('audio.request',{id:audioId});
      socket.on('audio.data'+audioId,function(data){
        if(data.code == 200){
          self.addAudio(data.buffer,data.index);
          if(!data.index)
            self.emit('ready',data.index);
          if(data.isFinish)
            self.emit('loaded');
        }else
          console.log('获取buffer失败');
      });
      return self;
    }

    return self.load(socket,audioId);
  }

  window.Raix = Raix;
 })(window);