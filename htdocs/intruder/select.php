<?php 
  $content['main_message'] = '';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  tripmode_check('normal')
  text = '(現在地図:['+getVariable('current_map')+'])'+'<br>目的地を選択してください'
  setMainMessage(text)
  // checkMessage()
  viewDestinationList('move')
  get_current_location()
  showTripmode()
  setVariable('onmove', 0)
  setVariable('error', 0)
  setTimeout(function(){playAnnounce('select')}, 1000)
  //ループスクリプト
  function countup() {
    reserveCount()
  }
  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    move_to = getVariable('move_to')
    if (res.data.destination_name == undefined) {
      return
    } else {
      setLog(res.data)
      $('[data="'+res.data.destination_name+'"]').addClass('selected')
      setVariable('current_location', res.data.destination_name)
      if (res.data.destination_name != move_to) {
        $('[data="'+move_to+'"]').addClass('picked')
      }
    }
  }
  setInterval(countup, sytemlooptimer);
</script>