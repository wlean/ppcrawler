/**
 * Copyright (c) 2014-2017, BeiJing MingZhiYuYin Technology Inc. All rights reserved.
 */

'use strict';

const RATE = 8000;
const BYTRES_PRE_SEC = 16000;
const HEAD_SIZE = 44;

const DEF_EMPTY_DATA_SIZE = 1024 * 240;
const DEF_TIME = 30; // s
const DEF_EX_TIME = 15; // s


/**
 * 持续读取缓存
 * @param {*} getBuffer 
 * @param {*} writeBuffer 
 * @param {*} finished 
 */
function readBuffer (getBuffer, writeBuffer, finished) {
  
  // 尝试获取音频缓存
  let firstDataBuffer = getBuffer();
  if (!firstDataBuffer || firstDataBuffer.length <= 0) return null;

  // 写入空音频部分
  let wav = makeEmptyWav();
  let ok = writeBuffer(wav.buffer);
  if (!ok) return null;

  // 持续写入音频
  let lastOffset = 0;
  let limitCount = 2;

  let timer = setInterval(() => {
    if (limitCount === 0) {
      clearInterval(timer);
      finished();
    }

    let dataBuffer = getBuffer();
    if (dataBuffer && dataBuffer.byteLength > lastOffset) {
      let byteSize = dataBuffer.byteLength;
      let buf = dataBuffer.slice(lastOffset, byteSize);
      let wav = new Wav(buf, true);
      let ok = writeBuffer(wav.data);
      if (!ok) { limitCount = 0; return; }
      
      lastOffset = byteSize;
    } else limitCount--;
  }, 500);

  return timer;
}

function makeEmptyWav (emptyDataSize=DEF_EMPTY_DATA_SIZE) {
  let mainBuffer = Buffer.alloc(HEAD_SIZE + emptyDataSize);
  let wav = new Wav(mainBuffer, true);
  wav.setRiffSize((DEF_TIME + DEF_EX_TIME) * BYTRES_PRE_SEC);
  return wav;
}

class Wav {
  
  /**
   * Creates an instance of Wav.
   * @param {NodeBuffer} buffer 
   * @memberof Wav
   */
  constructor (buffer, no_head=false, { 
    sample_rate=RATE, bytes_per_second=BYTRES_PRE_SEC, block_align=4, bits_per_sample=16
  }={}) {
    let head_len = no_head ? 0 : HEAD_SIZE;
    let data_len = buffer.length - head_len;
    let newBuffer = new Uint8Array(new ArrayBuffer(data_len + HEAD_SIZE));

    let bit = 8;
    let byte2Number = (pre=0, cur=0, i=0) => pre + (cur << (bit * i));
    let byte2String = (pre=0, cur=0, i=0) => pre + Buffer.from([cur]).toString();
    let buffer2Number = (start=0, end=0) => newBuffer.slice(start, end + 1).reduce(byte2Number, 0);
    let buffer2String = (start=0, end=0) => newBuffer.slice(start, end + 1).reduce(byte2String, '');

    let number2Buffer = (number=0, start=0, end=0) => {
      for (let i=0; (start+i)<(end+1); i++) newBuffer[start + i] = (number >> (bit * i));
      return newBuffer.slice(start, end + 1);
    };

    let string2Buffer = (str='', start=0, end=0) => {
      let str_buf = Buffer.from(str);
      for (let i=0; (start+i)<(end+1); i++) newBuffer[start + i] = str_buf[i];
      return str_buf;
    };

    if (no_head) {
      // 4byte, 资源交换文件标志:RIFF 0-3s
      this._riff_name = string2Buffer('RIFF', 0, 3);
      // 4byte, 从下个地址到文件结尾的总字节数 4-7
      this._riff_size = number2Buffer(HEAD_SIZE - 8 + data_len, 4, 7);

      // 4byte,wav文件标志:WAVE 8-11
      this._wav_flag = string2Buffer('WAVE', 8, 11);
      // 4byte,波形文件标志:fmt(最后一位空格符) 12-15
      this._fmt_flag = string2Buffer('fmt ', 12, 15);
      // 4byte,音频属性所占字节数 16-19 // (compressionCode,numChannels,sampleRate,bytesPerSecond,blockAlign,bitsPerSample)
      this._format_size = number2Buffer(16, 16, 19);

      // 2byte,格式种类(1-线性pcm-WAVE_FORMAT_PCM,WAVEFORMAT_ADPCM) 20-21
      this._compression_code = number2Buffer(1, 20, 21);
      // 2byte,通道数 22-23
      this._num_channels = number2Buffer(1, 22, 23);
      
      // 4byte,采样率 24-27
      this._sample_rate = number2Buffer(sample_rate, 24, 27);
      // 4byte,传输速率 28-31
      this._bytes_per_second = number2Buffer(bytes_per_second, 28, 31);
      
      // 2byte,DATA数据块长度 32-33
      this._block_align = number2Buffer(block_align, 32, 33);
      // 2byte,采样精度-PCM位宽 34-35
      this._bits_per_sample = number2Buffer(bits_per_sample, 34, 35);

      // 4byte,数据标志:data 36-39
      this._data_type = string2Buffer('data', 36, 39);

      // 4byte,从下个地址到文件结尾的总字节数 40-43 // 即除了wav header以外的pcm data length
      this._data_size = number2Buffer(data_len, 40, 43);
    } else {
      for (let i=0; i<HEAD_SIZE; i++) {
        newBuffer[i] = buffer[i];
      }
    }

    for (let i=HEAD_SIZE,j=head_len; i<data_len+head_len; i++,j++) {
      newBuffer[i] = buffer[j];
      // if (i < 5000 && i > HEAD_SIZE) newBuffer[i] = 0;
    }
    this.head = Buffer.from(newBuffer.slice(0, HEAD_SIZE));
    this.data = Buffer.from(newBuffer.slice(HEAD_SIZE));
    this.buffer = Buffer.from(newBuffer.buffer);    

    // 4byte, 资源交换文件标志:RIFF 0-3s
    this.riff_name = buffer2String(0, 3);
    // 4byte, 从下个地址到文件结尾的总字节数 4-7
    this.riff_size = buffer2Number(4, 7);
    
    // 4byte,wav文件标志:WAVE 8-11
    this.wav_flag = buffer2String(8, 11);
    // 4byte,波形文件标志:FMT(最后一位空格符) 12-15
    this.fmt_flag = buffer2String(12, 15);
    // 4byte,音频属性所占字节数 16-19 // (compressionCode,numChannels,sampleRate,bytesPerSecond,blockAlign,bitsPerSample)
    this.format_size = buffer2Number(16, 19);

    // 2byte,格式种类(1-线性pcm-WAVE_FORMAT_PCM,WAVEFORMAT_ADPCM) 20-21
    this.compression_code = buffer2Number(20, 21);
    // 2byte,通道数 22-23
    this.num_channels = buffer2Number(22, 23);
    
    // 4byte,采样率 24-27
    this.sample_rate = buffer2Number(24, 27);
    // 4byte,传输速率 28-31
    this.bytes_per_second = buffer2Number(28, 31);
    
    // 2byte,DATA数据块长度 32-33
    this.block_align = buffer2Number(32, 33);
    // 2byte,采样精度-PCM位宽 34-35
    this.bits_per_sample = buffer2Number(34, 35);

    // 4byte,数据标志:data 36-39
    this.data_type = buffer2String(36, 39);

    // 4byte,从下个地址到文件结尾的总字节数 40-43 // 即除了wav header以外的pcm data length
    this.data_size = buffer2Number(40, 43);
    

    // 设置比特率
    this.setByteRate = (number=0) => {
      number2Buffer(number, 28, 31);
      this.bytes_per_second = buffer2Number(28, 31);
    };

    // 设置Riff大小
    this.setRiffSize = (number=0) => {
      number2Buffer(number, 4, 7);
      this.data_size = buffer2Number(4, 7);

      // data
      number2Buffer((number - 36), 40, 43);
      this.data_size = buffer2Number(40, 43);
    };
    
  }
}

exports = module.exports = { readBuffer, Wav };
