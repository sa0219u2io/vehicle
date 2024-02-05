<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = 'どこかの目的地にセットし、その目的地を指定してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  get_current_location()
  playAnnounce('relocate')
  setVariable('onmove', 2)

  function callback_GCL(res) {
    current_map = getVariable('current_map')
    destination_list = getVariable('destination_list')
    point_x = res.data.point.point_x
    point_y = res.data.point.point_y
    point_w = res.data.stop_angle.point_w
    setVariable('point_x', point_x)
    setVariable('point_y', point_y)
    setVariable('point_w', point_w)
    if (res.data.map_name == current_map) {
      if ($.inArray(res.data.destination_name, destination_list) < 0) {
        current_location = res.data.destination_name
        setLog(current_location)
        setVariable('current_location', current_location)
        viewSelectDestination()
      }
    } else {
      transScreen('error', '?e=map_setting_false')
    }
  }

  function relocate(destination) {
    loadBall();
    req_call_relocated ()
    req_set_location(destination)
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

    let destination_list_q=[];
    destination_list_q['wp010001'] = '待機場所';
    destination_list_q['wp010002'] = '洗い場手前（目的地）';
    destination_list_q['wp010003'] = 'A地点';
    destination_list_q['wp010004'] = 'B地点';
    destination_list_q['wp010005'] = 'C地点';
    destination_list_q['wp010006'] = 'D地点';
    destination_list_q['wp010007'] = 'Zone1の端点1';
    destination_list_q['wp010008'] = 'Zone1の端点2';
    destination_list_q['wp010009'] = 'Zone2の端点1';
    destination_list_q['wp010010'] = 'Zone2の端点2';
    destination_list_q['wp010011'] = '11';
    destination_list_q['wp010014'] = '14';

    Object.keys(destination_list).forEach(function (key) {
      $('#selectcontaier').append('<div class="select float" onclick="relocate(\''+ destination_list[key] +'\')">'+ destination_list_q[destination_list[key]] +'</div>')
    });
  }

//タイマースクリプト
  var countup = function(){

  }
  // setInterval(countup, timespan);
</script>
