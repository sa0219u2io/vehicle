<?php 
  $basename = basename(__FILE__, ".php");
  $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="stopnow()"><img src="asset/image/pictgram/stopmove_2.png"><p>一時停止</p></div>';
  include('component/template.php');
?>
<script>
  // 起動時スクリプト
  $('.wrapper').addClass('face')
  // 目的地・移動モードの表示
  string = getVariable('move_to')+'へ移動しています'
  setMainMessage(string)
  showTripmode()
  setVariable('onmove', 1)
  setVariable('error', 0)
  // 音楽・動画の再生
  playAnnounce('onmove')
  playMusic('onmove')
</script>