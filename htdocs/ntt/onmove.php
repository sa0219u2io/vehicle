<?php $main = '<div class="onmovestop" onclick="stopnow()"><p>一時停止</p></div>'?>
<?php $mainmessage = ''?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  $('.wrapper').addClass('onmove')
  playAnnounce('onmove')
  playOnmoveAudio()
  setVariable('onmove', 1)

  function callback_GCL(res) {
    point_x = res.data.point.point_x
    point_y = res.data.point.point_y
    point_w = res.data.stop_angle.point_w
    setVariable('point_x', point_x)
    setVariable('point_y', point_y)
    setVariable('point_w', point_w)
  }
  
  var array = []
  array[0] = '通常走行'
  array[1] = '連続走行'
  array[2] = '拠点走行'
  array[3] = '巡回走行'
  var text = array[getVariable('trip_mode')]
  if (getVariable('turnaround') >0) {
    text = text+'(往復)'
  }
  setMainMessage(text+'移動中です')
  function stopnow() {
    //一時停止
    req_stop_move(0)
    setVariable('stopnow', 1)
    loadBall()
  }
//タイマースクリプト
  var countup = function(){
    get_current_location()
  }
  setInterval(countup, 5000);
</script>
