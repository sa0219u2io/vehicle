<?php 
  $content['main_message'] = '運搬モードを起動します';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  setTimeout(init,2000)
  setUnderMessage(mainversion)
  setTimeout(function(){playAnnounce('wakeup')}, 1000)
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>