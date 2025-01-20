<?php 
  $content['main_message'] = '目的地を選択してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  if (getVariable('cutin')=='true') {
    setMainMessage('割り込ませる目的地を選択してください')
    // get_current_location()
    viewDestinationList()
    playAnnounce('select')
  } else {
    if (tripmode_check('normal')) {
      setMainMessage('目的地を選択してください')
      get_current_location()
      viewDestinationList()
      
      resetStatus()
      deleteWorkList()
      playAnnounce('select')
      checkMessage()
    }
  }
</script>