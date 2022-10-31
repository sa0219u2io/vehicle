<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = '目的地を選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  //松月堂特別対応
  id = getVariable('current_map_id');
  array = ['25', '26','62'];
  console.log(id)
  console.log(array)
  result = $.inArray(id,array)
  console.log(result)

  if (result >= 0 ) {
    setVariable('trip_mode', 1)
    transScreen('sequence')
  }
  setVariable('complete_temp', 0);
  setVariable('select_temp', 1);
  if (getVariable('stopnow') == 1) {
    setVariable('stopnow', 0)
    set_destination_list()
  } else {
    get_current_location()
  }

  mode = getVariable('trip_mode')
  if (mode == 1) {
    transScreen('sequence')
  } else {
    setTimeout(set_destination_list,500)
  }
  setAnnounce('select')
  var array = []
  array[0] = '通常走行'
  array[1] = '連続走行'
  array[2] = '拠点走行'
  array[3] = '巡回走行'
  var text = array[getVariable('trip_mode')]
  if (getVariable('turnaround') >0) {
    text = text+'(往復)'
  }
  setUnderMessage(text)

//タイマースクリプト
  //setTimeout(function(){}, 1500)

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
