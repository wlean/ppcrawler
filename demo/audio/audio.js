var LAudio = {
  /**
   * @type {AudioContext}
   */
  audioContext:{},
  /**
   * @type {Array<AudioBufferSourceNode>}
   */
  audioSources:[],
  playSource:0,
  length:0,
  hasplay:false,
  init(){
    console.log('init LAudio');
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
  },
  
  /**
   * @returns {AudioBufferSourceNode}
   */
  getNextSource(){
    return this.audioSources[this.playSource+1];
  },
  
  /**
   * 改变播放速度
   * @param {number} speed 
   */
  changeSpeed(speed){
    this.audioSources[this.playSource].playbackRate.value += speed;
    console.log('改变播放速度',this.audioSources[this.playSource].playbackRate.value);
  },

  /**
   * 添加音频
   * @param {AudioBuffer} buffer 
   */
  addAudio(buffer){
    console.log('新添了一个音频等待播放');
    var source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    if (!source.start)
      source.start = source.noteOn;
    var that = this;
    source.onended = function(){
      var next = that.getNextSource();
      that.playSource++;
      if(next){
        next.playbackRate.value = source.playbackRate.value;
        next.start(0);
      }else{
        console.log('播放结束');
      }
      
    };
    this.audioSources.push(source);
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