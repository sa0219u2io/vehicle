<?php 
  $basename = basename(__FILE__, ".php");
  $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="stopnow()"><img src="asset/image/pictgram/stopmove_2.png"><p>一時停止</p></div>';
  include('component/template.php');
?>

<script>
  // 起動時スクリプト
  $('.wrapper').addClass('face')
  // 目的地・移動モードの表示
  work = getWork()
  setMainMessage(work.to+'へ移動しています')
  setStatus('move', true)
  setStatus('error', false)
  setStatus('halt', false)
  setStatus('autostart', false)
  setStatus('interval', false)
  setVariable('cutin', false)
  operatedFlg(true)
  setVariable('checkingAvoidance', true)
  setTimeout(checkMessage,timer.system);
  nomenu()

  // 音楽・動画の再生
  playAnnounce('onmove')
  playMusic()
  i = 0;
  setInterval(function onmoveInterval() {
    playAnnounce('moving')
    if (i == 1) {
      setWork('reset',0)
      setWork('ready',false)
    }
    // sendMeMultiple(false)
    // checkMovingAvoidance()
    i++
  }, timer.system)
</script>