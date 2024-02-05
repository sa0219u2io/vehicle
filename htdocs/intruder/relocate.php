<?php 
  $content['main_message'] = '最寄りの目的地にロボットを移動し、<br>その位置を指定してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  viewDestinationList('relocate')
  setVariable('onmove', 0)
  setVariable('error', 'relocate')
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>