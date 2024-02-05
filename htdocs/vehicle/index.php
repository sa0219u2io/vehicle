<?php $main = ''?>
<?php $mainmessage = '運搬モードを起動します'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  init()
  setUnderMessage(mainversion)

//タイマースクリプト
  function checkCurrentMap() {
    map_id = parseInt(getVariable('current_map_id'))
    if (map_id > 0) {
     transScreen('map')
    } else {
     transScreen('map')
    }
  }
  setTimeout(checkCurrentMap, 3000)
  setTimeout(function(){playAnnounce('wakeup')}, 500)
  setTimeout(get_destination_list, 1500)

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
