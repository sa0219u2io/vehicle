<?php $main = '<div class="onmoveicon" id="modal-stopnow-open" onclick="stopnow()"><img src="asset/image/pictgram/stopmove_2.png"><p>一時停止</p></div><div id="video"></div>'?>
<?php $mainmessage = ''?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  $('.wrapper').addClass('onmove')
  //setAnnounce('onmove')
  //連続走行なら、自動でムービー再生
  if (getVariable('current_map_id')==26) {
    setOnmoveMovie()
  } else {
    setOnmoveAudio()
  }
  set_current_destination()
  var array = []
  array[0] = '通常走行'
  array[1] = '連続走行'
  array[2] = '拠点走行'
  array[3] = '巡回走行'
  var text = array[getVariable('trip_mode')]
  if (getVariable('turnaround') >0) {
    text = text+'(往復)'
  }
  setUnderMessage(text)

  setTimeout(writeVariable, 200)

  function stopnow() {
    //一時停止
    req_stop_move(0)
    setVariable('stopnow', 1)
    loadBall()
  }
//タイマースクリプト
  var countup = function(){
  }
  //setInterval(countup, defaultlooptimer);
</script>
