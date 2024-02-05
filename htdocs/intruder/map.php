<?php 
  $content['main_message'] = '地図を選択してください';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  get_map_list()
  loadBall()
  setTimeout(viewMapList(), 15000)
  setTimeout(function(){playAnnounce('map')}, 1000)
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>