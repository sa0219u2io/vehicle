<?php $main = '<div id="sequencecontainer"></div>
<div id="sequencepannel"></div>
<div id="sequencego"></div>'
?>
<?php $mainmessage = 'シナリオ走行します'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  setVariable('sequencei', 0)
//起動時スクリプト
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
