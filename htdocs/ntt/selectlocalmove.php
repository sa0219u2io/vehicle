<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = '目的地を選択してください::ローカルで動きます'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  get_current_location()
  setVariable('onmove', 0)

  // transScreen('face')

  mode = getVariable('trip_mode')
  if (mode == 1) {
    transScreen('sequence')
  }
  playAnnounce('select')
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

  function viewSelectDestination () {
    // destination_list = getVariable('destination_list')
    // destination_list = destination_list.split(',');
    let destination_list_q=[];
    destination_list_q['wp010001'] = '待機場所';
    destination_list_q['wp010017'] = '洗い場１';
    destination_list_q['wp010002'] = '洗い場２';
    destination_list_q['wp010003'] = 'A地点';
    destination_list_q['wp010004'] = 'B地点';
    destination_list_q['wp010005'] = 'C地点';
    destination_list_q['wp010006'] = 'D地点';
    destination_list_q['wp010007'] = 'Zone1の端点1';
    destination_list_q['wp010008'] = 'Zone1の端点2';
    destination_list_q['wp010009'] = 'Zone2の端点1';
    destination_list_q['wp010010'] = 'Zone2の端点2';
    destination_list_q['wp010011'] = 'Zone2の端点3';
    destination_list_q['wp010012'] = 'スロープ上';
    destination_list_q['wp010013'] = 'スロープ下';
    destination_list_q['wp010014'] = 'むさし野中継地点';
    destination_list_q['wp010015'] = 'デシャップ洋';
    destination_list_q['wp010016'] = 'ブッフェ';
    destination_list_q['wp010017'] = '洗い場２';
    destination_list_q['wp010018'] = 'C地点２';
    destination_list_q['wp010019'] = '充電場所';

    // console.log(destination_list);

    setLog(destination_list_q)

    $("#selectcontaier").empty();
    var current_destination = getVariable('current_destination')
    mode = getVariable('trip_mode')

    //再設置画面なら
    if (getVariable('onrelocate')==1) {
      current_destination = "";
    }

    Object.keys(destination_list_q).forEach(function (key,value) {
      console.log(key+':'+value)
      if (key == current_destination) {
        if (key == 'wp010001'||key == 'wp010002'||key == 'wp010017') {
          $('#selectcontaier').append('<div class="bigselect float" id="current_location onclick="req_move(\''+ key +'\')">'+ destination_list_q[key] +'</div>')
        } else {
          $('#selectcontaier').append('<div class="select float" id="current_location onclick="req_move(\''+ key +'\')">'+ destination_list_q[key] +'</div>')
        }
        
      } else {
        if (key == 'wp010001'||key == 'wp010002'||key == 'wp010017') {
          $('#selectcontaier').append('<div class="bigselect float" onclick="req_move(\''+ key +'\')">'+ destination_list_q[key] +'</div>')
        } else {
          $('#selectcontaier').append('<div class="select float" onclick="req_move(\''+ key +'\')">'+ destination_list_q[key] +'</div>')
        }
        
      }
    });
  }

  function callback_GCL(res) {
    current_map = getVariable('current_map')
    destination_liststr = getVariable('destination_list')
    point_x = res.data.point.point_x
    point_y = res.data.point.point_y
    point_w = res.data.stop_angle.point_w
    setVariable('point_x', point_x)
    setVariable('point_y', point_y)
    setVariable('point_w', point_w)
      destination_list = destination_liststr.split(',');
      setLog(res.data)
      setLog(current_map)
      if (res.data.map_name == current_map) {
        setLog(res.data.destination_name)
        setLog(destination_list)
        state = $.inArray(res.data.destination_name, destination_list)
        console.log(state)
        // if ($.inArray(res.data.destination_name, destination_list) >= 0) {
          current_location = res.data.destination_name
          setLog(current_location)
          setVariable('current_location', current_location)
          viewSelectDestination()
        // } else {
          // transScreen('error', '?e=map_setting_false')
        // }
      } else {
        transScreen('error', '?e=map_setting_false')
      }
  }

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
