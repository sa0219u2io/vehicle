<?php $main = '<div id="sequencecontainer"></div>
<div id="sequencepannel"></div>
<div id="sequencego"></div>'?>
<?php $mainmessage = '目的地を順番に選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  get_current_location()
  mode = getVariable('trip_mode')
  if (mode == 0) {
    transScreen('select')
  }
  setTimeout(set_destination_list_sequence,100)
//タイマースクリプト
  setTimeout(function(){playAnnounce('sequence')}, 200)
//ループスクリプト
  var countup = function(){
  }
  //setInterval(countup, defaultlooptimer);
</script>
