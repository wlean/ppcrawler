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
  addAudio(buffer){
    this.audioBuffer.push(buffer);
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
    return source;
  },
  /**
   * 暂停播放
   */
  suspend(){
    console.log('暂停播放');
    this.audioContext.suspend();
  },

  /**
   * 继续播放
   */
  resume(){
    console.log('resume');
    this.audioContext.resume();
  },

  /**
   * 重新播放
   */
  replay(){
    console.log('replay');
    this.playSource = 0;
    this.play();
  },

  /**
   * 开始播放
   */
  play(){
    console.log('start play');
    this.hasplay = true;
    this.audioSources[this.playSource].start(0);
  }
};