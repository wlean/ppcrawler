var dogBarkingBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function playSound(buffer, time,o,d) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.playbackRate.value = 1;
  if (!source.start)
    source.start = source.noteOn;
  source.start(time,o,d);
  console.log('context currentTime',context.currentTime);
  console.log(source.playbackRate);
}

function onError(){
  console.log('错了');
}

function loadDogSound(url,time,o,d) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dogBarkingBuffer = buffer;
      playSound(dogBarkingBuffer,time,o,d);
    }, onError);
  }
  request.send();
}