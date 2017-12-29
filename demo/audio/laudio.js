window.AudioContext = window.AudioContext || window.webkitAudioContext;
var laudio = {
  audioCtx:new AudioContext(),
  audioBuffer:[],
  /**
   * @type {AudioBufferSourceNode}
   */
  playingSource:{},
  playing:-1,
  length:0,
  hasplay:false,
  addAudio(buffer,index){
    if(!index){
      this.audioBuffer.push(buffer);
    }else{
      this.audioBuffer[index-1] = buffer;
    }
  },
  getNextSource(){
    var source = this.audioCtx.createBufferSource();
    var buffer = this.audioBuffer[this.playing+1];
    if(!buffer) return null;
    source.buffer = buffer; 
    source.connect(this.audioCtx.destination);
    if (!source.start)
      source.start = source.noteOn;
    var that = this;
    source.onended = function(){
      that.playing++;
      var next = that.getNextSource();
      if(next){
          next.playbackRate.value = source.playbackRate.value;
          next.start(0);
      }else{
          console.log('播放结束');
      }
    
    };
    this.playingSource = source;
    return source;
  },
  /**
   * 改变播放速度
   * @param {number} speed 
   */
  changeSpeed(speed){
    this.playingSource.playbackRate.value += speed;
    console.log('改变播放速度',this.playingSource.playbackRate.value);
  },
  /**
   * 暂停播放
   */
  suspend(){
    console.log('暂停播放');
    this.audioCtx.suspend();
  },

  /**
   * 继续播放
   */
  resume(){
    console.log('resume');
    this.audioCtx.resume();
  },

  /**
   * 重新播放
   */
  replay(){
    console.log('replay');
    this.audioCtx.close();
    this.audioCtx = new AudioContext();
    this.playing = -1;
    this.play();
  },

  /**
   * 开始播放
   */
  play(){
    console.log('start play');
    this.hasplay = true;
    if(this.getNextSource()){
      this.getNextSource().start(0);
    }else{
      var that = this;
      setTimeout(function(){
        that.play();
      },100);
    }
  }
};