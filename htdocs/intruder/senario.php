<?php 
  $content['main_message'] = '走行シナリオを選択してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  tripmode_check('senario')
  viewSenario('move')
  get_current_location()
  showTripmode()
  setVariable('onmove', 0)
  setVariable('error', 0)
  // setTimeout(function(){playAnnounce('select')}, 1000)
  //ループスクリプト
  function countup() {
    reserveCount()
  }
  setInterval(countup, sytemlooptimer);
  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    // if (res.data.destination_name == undefined) {
    //   return
    // } else {
    //   setLog(res.data)
    //   $('[data="'+res.data.destination_name+'"]').addClass('selected')
    //   setVariable('current_location', res.data.destination_name)
    // }
  }

  // シナリオ走行開始
  function senario_move (key) {
    senario = JSON.parse(getVariable('senario'))
    setVariable('current_senario', key)
    move(senario[key].destination_list[0])
  }
</script>