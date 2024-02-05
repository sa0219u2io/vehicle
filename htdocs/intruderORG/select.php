<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = '目的地を選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  get_current_location()

  function init_select() {
    mode = getVariable('trip_mode')
    if (mode == 1) {
      transScreen('sequence')
    }
    current_map = getVariable('current_map')
    playAnnounce('select')
    var array = []
    array[0] = '通常走行'
    array[1] = '連続走行'
    array[2] = '拠点走行'
    array[3] = '巡回走行'
    var text = current_map+':'+array[getVariable('trip_mode')]
    if (getVariable('turnaround') >0) {
      text = text+'(往復)'
    }
    setUnderMessage(text)
  }

  function viewSelectDestination () {
    destination_list = getVariable('destination_list')
    destination_list = destination_list.split(',');
    setLog(destination_list)

    $("#selectcontaier").empty();
    var current_destination = getVariable('current_destination')
    mode = getVariable('trip_mode')

    //再設置画面なら
    if (getVariable('onrelocate')==1) {
      current_destination = "";
    }

    Object.keys(destination_list).forEach(function (key) {
      if (key == current_destination) {
        $('#selectcontaier').append('<div class="select float" id="current_location onclick="move(\''+ destination_list[key] +'\')">'+ destination_list[key] +'</div>')
      } else {
        $('#selectcontaier').append('<div class="select float" onclick="move(\''+ destination_list[key] +'\')">'+ destination_list[key] +'</div>')
      }
    });

    init_select()
  }

  function callback_GCL(res) {
    current_map = getVariable('current_map')
    set_map_setting(current_map) 
    destination_liststr = getVariable('destination_list')
    point_x = res.data.point.point_x
    point_y = res.data.point.point_y
    point_w = res.data.stop_angle.point_w
    setVariable('point_x', point_x)
    setVariable('point_y', point_y)
    setVariable('point_w', point_w)
    destination_list = destination_liststr.split(',');
    // setLog(res.data)
    // setLog(current_map)
    if (res.data.map_name == current_map) {
      // setLog(res.data.destination_name)
      // setLog(destination_list)
      current_location = res.data.destination_name
      // setLog(current_location)
      setVariable('current_location', current_location)
      viewSelectDestination()
    } else {
      transScreen('error', '?e=map_setting_false')
    }
  }

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
