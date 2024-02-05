<?php 
  $content['main_message'] = '目的地を順に選択し発進させてください';
  $content['main'] = '<div class="boxlist" id="sequencelist"></div><div class="sequence_destination_list"></div><div class="button_tr clear" onclick="clearSequence()">クリア</div><div class="gobutton"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  tripmode_check('sequence')
  viewDestinationList('putSequence', 'sequencebox')
  get_current_location()
  showSequence()
  setVariable('sequence_i', 0)
  showTripmode()
  setVariable('onmove', 0)
  setVariable('error', 0)
  //ループスクリプト
  function countup() {

  }
  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    if (res.data.destination_name == undefined) {
      return
    } else {
      setLog(res.data)
      $('[data="'+res.data.destination_name+'"]').addClass('selected')
      setVariable('current_location', res.data.destination_name)
    }
  }
  //setInterval(countup, defaultlooptimer);
</script>