<?php
  $basename = basename(__FILE__, ".php");
  $content['main'] = '<div class="haltdata"></div><div class="onmoveicon" id="modal-stopnow-open" onclick="stopnow()"><img src="asset/image/pictgram/stopmove_2.png"><p>一時停止</p></div></div>';
  include('component/template.php');  
?>
<script>
  // 起動時スクリプト
  $('.wrapper').addClass('face')
  $('.wrapper').addClass('halt')
  setVariable('onmove', 0)
  setVariable('error', 'halt')
  // 目的地・移動モードの表示
  string = '障害物検知のため移動を中断しました<br>障害物がなくなると自動で復帰します'
  setMainMessage(string)
  showTripmode()
  // 音楽・動画の再生
  setTimeout(function(){playAnnounce('halt')}, 200)
</script>


