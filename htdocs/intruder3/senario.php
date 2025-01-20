<?php 
  $content['main_message'] = '走行シナリオを選択してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  if (tripmode_check('senario')) {
    viewSenario('makeWork')
    get_current_location()
    resetStatus()
    deleteWorkList()
  }
  // setTimeout(function(){playAnnounce('select')}, 1000)
  //ループスクリプト
  function countup() {

  }
  // setInterval(countup, timer.system);
</script>