<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = '地図を選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
setMaps()
playAnnounce('map')
function changeMap(map_id) {
  loadBall()
  setVariable('current_map_id', map_id)
  writeVariable();
  setTimeout(function() {req_change_map(map_id)}, 1000)
}

//タイマースクリプト
  //setTimeout(function(){}, 1500)

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
