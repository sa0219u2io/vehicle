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
    console.log('map:'+map_id)
    if (!map_id) {
      transScreen('map')
    }
    if (map_id > 0) {
      //setTimeout(function(){req_change_map(map_id)}, 500)
      req_change_map(map_id)
      //transScreen('select')
    } else {
     transScreen('map')
    }
  }
  setTimeout(checkCurrentMap, 3000)
  setTimeout(function(){setAnnounce('wakeup')}, 500)
  setTimeout(get_destination_list, 1500)

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
