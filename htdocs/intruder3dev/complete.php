<?php 
  $content['main'] = '<div class="complete_countdown">0</div><div class="complete_stack">-</div><div class="complete_select" onclick="cutin()">割込み<br>指示</div><div class="action_button" onclick="move()"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  get_current_location()
  setStatus('move', false)
  setStatus('error', false)
  setStatus('halt', false)
  setWork('reset',0)

  complete()
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
  function cutin() {
    setVariable('cutin', true)
    transScreen('select')
  }

</script>