/////////////////////////////////////////////////////////////////////////////////////////
//コールバック関数
/////////////////////////////////////////////////////////////////////////////////////////
//登録MAP確認
function callback_MGD (res) {
  url = res.data.mapimage_filepath
  console.log("登録MAPURL(" + url +")")
  setVariable(url);
  //一回リストを削除
  $("#map").empty();
  $('#map').append('<img src="' + url + '">');
  $('#resetmap').append('<img src="' + url + '">');
}

//障害物センサデータ表示
function callback_GSD (res) {
  //超音波センサ反応を調べる
  console.log(res)
  text = '[胸上]:' +res.data.ids.detection_distance[2] +
  ', [胸下]:'  +res.data.ids.detection_distance[3]+
  '<br> [右壁]:'  +res.data.ids.detection_distance[0]+
  ', [右足元]:'  +res.data.ids.detection_distance[4]+
  ', [正面足元]:'  +res.data.uls.detection_distance+
  ', [左足元]:'  +res.data.ids.detection_distance[5]+
  ', [左壁]:'  +res.data.ids.detection_distance[1]
  //setUnderMessage(text);
  sensordata = JSON.stringify(res)
  sensorlog = getVariable('sensorlog')
  if (sensorlog) {
    sensorlog = sensorlog+','+sensordata
  } else {
    sensorlog = sensordata
  }
  var target = [];
  target[1] =  res.data.ids.detection_existence[2]   //胸上
  target[2] =  res.data.ids.detection_existence[3]   //胸下
  target[3] =  res.data.ids.detection_existence[0]   //右壁
  target[4] =  res.data.ids.detection_existence[4]   //右足元
  target[5] =  res.data.uls.detection_existence      //正面足元
  target[6] =  res.data.ids.detection_existence[5]   //左足元
  target[7] =  res.data.ids.detection_existence[1]   //左壁

  var data = [];
  data[1] =  res.data.ids.detection_distance[2]   //胸上
  data[2] =  res.data.ids.detection_distance[3]   //胸下
  data[3] =  res.data.ids.detection_distance[0]   //右壁
  data[4] =  res.data.ids.detection_distance[4]   //右足元
  data[5] =  res.data.uls.detection_distance      //正面足元
  data[6] =  res.data.ids.detection_distance[5]   //左足元
  data[7] =  res.data.ids.detection_distance[1]   //左壁

  for (var i = 1; i < 8; i++) {
    if (target[i] > 0) {
      $('.halt-sensor-'+i).addClass('halt-show')
      $('.halt-sensor-'+i).text(data[i])
    }
  }

  setVariable('sensorlog', sensorlog)
  setVariable('sensor_target' )
}

//現在地情報取得指示
function callback_GCL (res) {
  current_destination_id = res.data.destination_id
  current_mark_index = res.data.mark_index
  current_mark_id = res.data.mark_id
  if (current_destination_id) {
    console.log("現在地取得受信(" + current_destination_id +")")
    setVariable('current_destination_id', current_destination_id)

    var complete_temp = getVariable('complete_temp')
    if (complete_temp =='1') {
      setLog(1, complete_temp)
      do_complete(current_destination_id);
      setVariable('complete_temp', 0);
      return;
    }

    var select_temp = getVariable('select_temp')
    if (select_temp =='1') {
      setLog(1, select_temp)
      set_destination_list();
      setVariable('select_temp', 0);
    }
  }
  return
}

function callback_GCM (res) {
  map_id = res.data.map_id;
  setVariable('current_map_id', map_id);
}

//目的地情報取得指示
function callback_GDL (res) {
  var current_map_id = getVariable('current_map_id')
  deslist = res.data.map_list
  var obj = new Object;
  var maps = new Object;
  for (var i = 0; i < deslist.length; i++) {
    mid = deslist[i].map_id
    maps[mid] = deslist[i].map_name
    subobj = new Object;
    for (var j = 0; j < deslist[i].destination_list.length; j++) {
      did = deslist[i].destination_list[j].destination_id
      dname = deslist[i].destination_list[j].destination_name
      subobj[did] = dname
    }
    obj[mid] = subobj
  }
  maps = JSON.stringify(maps)
  setVariable('map_list', maps)
  dl_all_array = JSON.stringify(obj)
  setVariable('dl_all_array', dl_all_array)
}

//目的地移動指示
function callback_RM (res) {
  var result_cd =res.data.result_cd;
  //エラーが返ってきたら
  if (result_cd =="1" ) {
    alert("目的地の選択が不正です");
  } else {
    transScreen('onmove')
  }
}

//経路復帰指示
function callback_RRL (res) {
  var result_cd =res.data.result_cd;
  //エラーが返ってきたら
  if (!res.type == 'req_relocate')  {
    console.log('infor_robot_status無視');
    transScreen('onmove')
  }
  if (result_cd =="1" ) {
    alert("目的地の選択が不正です");
  } else {
    transScreen('onmove')
  }
}

//現在地情報取得指示
function callback_GMS(res) {
  var move_status = res.data.move_status

  if (move_status == "-1") { //モータ制御マイコン未接続
    deleteturnaround();
    //window.location.href = "http://localhost/transport/halt.php";
  } else if (move_status == "0") {  //移動待機中→目的到着
    var now = res.data.destination_id
    console.log('停止原因:' + move_status + ' (移動待機中→目的到着)');
    do_complete();

  } else if (move_status == "3") {  //障害物検知停止
    window.location.href = webroot+appname+'/halt.php';
    console.log('停止原因:' + move_status + ' (障害物検知停止)');

  } else if (move_status == "4") {  //動作障害
    deleteturnaround();
    console.log('停止原因:' + move_status + ' (動作障害)');
    transScreen('relocate')

  } else if (move_status == "5") {  //バンパセンサ反応
    deleteturnaround();
    console.log('停止原因:' + move_status + ' (バンパセンサ反応)');
    transScreen('relocate')

  } else if (move_status == "6") {  //マークロスト
    deleteturnaround();
    console.log('停止原因:' + move_status + ' (マークロスト)');
    transScreen('relocate')

  } else if (move_status == "8") {  //非常停止
    deleteturnaround();
    console.log('停止原因:' + move_status + ' (非常停止)');
    transScreen('relocate')

  } else {
    deleteturnaround()
    console.log('停止原因:' + move_status + ' (不明・通信エラー)');
    transScreen('relocate')
  }
  return
}

//地図切替完了
function callback_RCM(res) {
  writeVariable()
  setTimeout(function(){transScreen('select')}, 1500)
}

//汎用USBコマンド送信
function callback_RUC(res) {
  console.debug(res.data)
}
let doorcount;
//汎用USB受信
function callback_RRUC (res) {
  console.log(res.data)
  console.debug(res.data)
}
