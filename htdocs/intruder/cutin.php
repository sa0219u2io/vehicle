<?php 
  $content['main_message'] = '目的地を選択してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  // tripmode_check('normal')
  viewDestinationList('move')
  senario_i = getVariable('senario_i')
  senario_i = senario_i -1 
  setVariable('senario_i', senario_i)
  $('.main').append('<div class="cutin_button" onclick="transScreen(\'complete\')">予約行動に戻る</div>')

  // get_current_location()
  // showTripmode()
  // setVariable('onmove', 0)
  setVariable('error', 0)
  setTimeout(function(){playAnnounce('select')}, 1000)
  //ループスクリプト
  function countup() {
    reserveCount()
  }
  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    if (res.data.destination_name == undefined) {
  //     return
  //   } else {
  //     setLog(res.data)
  //     $('[data="'+res.data.destination_name+'"]').addClass('selected')
      setVariable('current_location', res.data.destination_name)
    }
  }
  setInterval(countup, sytemlooptimer);
</script>