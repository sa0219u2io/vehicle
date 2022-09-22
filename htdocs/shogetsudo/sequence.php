<?php $main = '<div id="sequencecontainer"></div>
<div id="sequencepannel"></div>
<div id="sequencego"></div>
<div id="sequenceclear" onclick="set_destination_list_sequence(1)">削除</div>'?>
<?php $mainmessage = '目的地を順番に選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  if (getVariable('current_map_id') == 18) {
    setVariable('trip_mode', 0)
    transScreen('select')
  } else if (getVariable('current_map_id') == 19) {
    setVariable('trip_mode', 2)
    transScreen('select')
  } else {
  }
  //get_current_location()
  mode = getVariable('trip_mode')
  if (mode == 0) {
    transScreen('select')
  }
  setTimeout(function(){set_destination_list_sequence(0)},100)
//タイマースクリプト
  setTimeout(function(){setAnnounce('sequence')}, 200)
//ループスクリプト
  var countup = function(){
  }
  //setInterval(countup, defaultlooptimer);
</script>
