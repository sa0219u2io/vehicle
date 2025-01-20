<?php 
  $basename = basename(__FILE__, ".php");
  $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="stopnow()"><img src="asset/image/pictgram/stopmove_2.png"><p>一時停止</p></div><div class="onmovelock" id="video"></div>';
  include('component/template.php');
?>
<script>
  // 起動時スクリプト
  $('.wrapper').addClass('face')
  // 目的地・移動モードの表示
  string = getVariable('move_to')+'へ移動しています'
  setMainMessage(string)
  localStorage.setItem('remoteAutorun', 'false');
  setVariable('autostart', 'false')
  showTripmode()
  setVariable('onmove', 1)
  setVariable('error', 0)
  // 音楽・動画の再生
  playAnnounce('onmove')
  if (onmovemovie == 'true') {
    playOnmoveMovie()
  } else {
    playMusic('onmove')
  }
  
  i = 0;
  setInterval(() => {
    file = '20240204_001.wav'
    url = 'asset/announce/'+file
    setLog(url);
    var onmovese = new Audio(url);
    vol = 1
    onmovese.volume = vol;
    onmovese.play();
    if (i == 1) {
      setVariable('onmoverest', 0);
    }
    i++
  }, sytemlooptimer);

  function playOnmoveMovie() {
    // stopOnmoveAudio()
    file = 'onmove.mp4'
    url = 'asset/movie/'+file
    $('#video').addClass('video-show');
    var video = document.createElement('video');
    video.autoplay = true;
    video.loop = false;
    video.playsinline = true;
    video.src = url;
    video.addEventListener("ended", function()
    {
      console.log('addEventListener')
      nextVideoSetting()
    }, false);
    try {
      $('#video').append(video);
      console.log(video)
    } catch {
      playMusic('onmove')
    }

  }

  function nextVideoSetting() {
    $('#video').empty();
    // playMusic('onmove')
    setTimeout(setOnmoveMovie, 10000)
    // console.log('wait10000')
  }
</script>