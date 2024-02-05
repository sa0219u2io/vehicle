/////////////////////////////////////////////////////////////////////////////////////////
//初期設定
/////////////////////////////////////////////////////////////////////////////////////////
//vehicleフォルダ内にて
//zip -r ../shogetsudo1-4-3.zip *
//debug 0: 本番, 1: デバッグ
const debug = localStorage.getItem('debug')?1:0;
const webroot = 'http://localhost/'
const variablefilename = 'shogetsudo.json'
const defaultlooptimer = 1000;

//systemUIなしでデバッグしたいとき
if (debug == 0)  {
  var systemUI = window.parent.SystemUI
} else {
  var systemUI = window
}
const broadcast = new BroadcastChannel('System')
const mainversion = appname + '1.4.3' + '('+debug+')'

/////////////////////////////////////////////////////////////////////////////////////////
//共通イニシャル処理
/////////////////////////////////////////////////////////////////////////////////////////
//変数の初期化
function init() {
  loadBall()
  setLog(0, mainversion)
  resetVariable()
  scanVariable()
  resetTemp()
  setVariable('log', '再起動');
}

/////////////////////////////////////////////////////////////////////////////////////////
//処理関数
/////////////////////////////////////////////////////////////////////////////////////////
//移動指示
function move(destid) {
  if (destid == '') {
    alert("不正な地図です。管理者に連絡してください");
    return false;
  }
  current_location = getVariable('current_destination_id')
  setVariable('move_from', current_location)
  setVariable('move_to', destid)
  angle = getParam('angle');

  //再設置なら
  if (getVariable('onrelocate')==0) {
   setLog(0,'目的地移動指示:'+ destid)
   req_move(destid);

  //方向がセットされていれば、再設置
  } else {
   var return_type = "1"  //新規経路指示
   setLog(0,'経路復帰指示:'+ destid)
   req_relocate(destid);
  }
}

//トレースモード開始指示
function do_trace() {
  let start = getVariable('tracestart');
  let goal = getVariable('tracegoal');

  if (start!=-1) {
    if (goal!=-1) {
      req_section_route_trace(start, goal);
      return;
    }
  } else {
    if (goal !=-1) {
      setUnderMessage('区間設定が不正のためトレースを中止しました');
      return;//トレースさせない
    }
  }
  console.debug(start)
  console.debug(goal)
  req_route_trace()
}

//移動完了時処理
function do_complete(current_destination_id) {
  //ログに蓄積
  var logs = getVariable('log')
  //var current_destination_id = getVariable('current_destination_id')
  deslist = JSON.parse(getVariable('dl_all_array'))[getVariable('current_map_id')]
  setLog(1, deslist)
  current_goal_name = deslist[current_destination_id]
  logs = logs + ',' + current_goal_name;
  setVariable('log', logs)
  turnaround = getVariable('turnaround');
  setVariable('ontrace', 0);

  //走行モードの取得
  trip_mode = getVariable('trip_mode');
  setLog('0', '目的移動完了処理('+trip_mode+')')
  switch (trip_mode) {
    case '0': //通常走行モード
      if (turnaround > 0) {
        move_from = getVariable('move_from')
        move_to = getVariable('move_to')
        turnaround_count = getVariable('turnaround_count')
        max = turnaround*2
        if (turnaround_count >= max) {
          //終了
          setLog(0,'往復走行モード：目的地到着');
          time = getWait('complete')*1000
          setAnnounce('complete');
          setVariable('turnaround_count', 1)
          setTimeout(function(){transScreen('select')}, time)
        } else {
          setLog(0,'往復走行モード：往復中');
          turnaround_count++
          setVariable('turnaround_count', turnaround_count)
          time = getWait('complete')
          setMainMessage(time + '秒後に折返し移動を開始します');
          setAnnounce('turnaround');
          time = time*1000
          setTimeout(function(){req_move(getVariable('move_from'))}, time)
        }
      } else {
        setLog(0,'通常走行モード：目的地到着');
        time = getWait('complete')*1000
        setAnnounce('complete');
        setTimeout(function(){transScreen('select')}, time)
      }
      break;
    case '1': //連続走行モード
      transScreen('autostart')
      break;
    case '2': //拠点走行モード
      transScreen('autostart')
      break;
    case '3': //巡回走行モード
      transScreen('autostart')
      break;
    default:

  }
}

//再設置時・最終目的地自動移動
function resume_move() {
  var destid = getVariable('move_to');
  setLog(0,'最終目的地経路復帰指示='+ destid);
  req_relocate(destid);
}

//目的地一覧を表示
function set_destination_list() {
  res = getVariable('dl_all_array')
  if (res) {
    current_map_id = getVariable('current_map_id')
    deslist = JSON.parse(res)[current_map_id]
    if (typeof(deslist)==null) {
      //目的地リスト取得失敗したらアプリ再起動
      transScreen('index')
    }
  } else {
    //目的地リスト取得失敗したらアプリ再起動
    transScreen('index')
  }

  $("#selectcontaier").empty();
  var current_destination_id = getVariable('current_destination_id')
  mode = getVariable('trip_mode')

  //再設置画面なら
  if (getVariable('onrelocate')==1) {
    current_destination_id = "";
  }

  Object.keys(deslist).forEach(function (key) {
    if (key == current_destination_id) {
      $('#selectcontaier').append('<div class="select float" id="current_location">'+ deslist[key] +'</div>')
    } else {
      $('#selectcontaier').append('<div class="select float" onclick="move(\''+ key+'\')">'+ deslist[key] +'</div>')
    }
  });
}

//目的地一覧を表示
function set_destination_list_sequence(type) {
  res = getVariable('dl_all_array')
  if (res) {
    current_map_id = getVariable('current_map_id')
    deslist = JSON.parse(res)[current_map_id]
    if (typeof(deslist)==null) {
      //目的地リスト取得失敗したらアプリ再起動
      transScreen('index')
    }
  } else {
    //目的地リスト取得失敗したらアプリ再起動
    transScreen('index')
  }

  $("#sequencecontainer").empty();
  var current_destination_id = getVariable('current_destination_id')
  //再設置画面なら
  if (getVariable('onrelocate')==1) {
    current_destination_id = "";
  }

  Object.keys(deslist).forEach(function (key) {
    if (key == current_map_id) {
      $('#sequencecontainer').append('<div class="sequence float" id="current_location">'+ deslist[key] +'</div>')
    } else {
      $('#sequencecontainer').append('<div class="sequence float" onclick="putSequenceArray(\''+ key+'\')">'+ deslist[key] +'</div>')
    }
  });
  //console.log('212:'+current_destination_id)
  if (current_destination_id == '') {
    current_destination_id = getVariable('hub_destination_id')
    //console.log('214:'+current_destination_id)
  }
  map_id = getVariable('current_map_id')
  //console.log(type)
  if (type == '1') {
    clearSequenceArray(map_id);
    $('#sequencepannel').empty()
    $('#sequencego').empty()
    putSequenceArray(current_destination_id);
  } else {
    array = getVariable('sequencearray'+map_id)
    sequencearray_tmp = JSON.parse(array)
    // clearSequenceArray(map_id)

    console.log(sequencearray_tmp)
    currentsenarioname = getVariable('currentsenarioname')
    if (currentsenarioname) {
      setMainMessage('シナリオ走行:'+currentsenarioname)
    }
    // console.log(sequencearray_tmp)
    Object.keys(sequencearray_tmp).forEach(function (key) {
      console.log(key+':'+sequencearray_tmp[key])
      // putSequenceArray(sequencearray_tmp[key]);
      res = getVariable('dl_all_array')
      current_map_id = getVariable('current_map_id')
      deslist = JSON.parse(res)[current_map_id]
      // console.log('deslist')
      // console.log(key)
      // console.log(deslist)
      move_to_name = deslist[sequencearray_tmp[key]]

    
      $('#sequencepannel').append('<div class="sequencepannel">'+move_to_name+'</div>')
      $('#sequencepannel').append('<div class="sequencearrow">▼</div>')
    });

    if (sequencearray_tmp.length >= 2) {
      $('#sequencego').append('<div id="sequencemove" onclick="move(\''+sequencearray_tmp[0]+'\')">移動開始</div>')
    }
  }
  // 松月堂対応・予定シナリオ入力
}

//目的地一覧を表示
function set_destination_list_sequence_making(type) {
  res = getVariable('dl_all_array')
  if (res) {
    current_map_id = getVariable('current_map_id')
    deslist = JSON.parse(res)[current_map_id]
    if (typeof(deslist)==null) {
      //目的地リスト取得失敗したらアプリ再起動
      transScreen('index')
    }
  } else {
    //目的地リスト取得失敗したらアプリ再起動
    transScreen('index')
  }

  $("#sequencecontainer").empty();
  var current_destination_id = getVariable('current_destination_id')
  //再設置画面なら
  if (getVariable('onrelocate')==1) {
    current_destination_id = "";
  }

  Object.keys(deslist).forEach(function (key) {
    if (key == current_map_id) {
      $('#sequencecontainer').append('<div class="sequence float" id="current_location">'+ deslist[key] +'</div>')
    } else {
      $('#sequencecontainer').append('<div class="sequence float" onclick="putSequenceArrayMaking(\''+ key+'\')">'+ deslist[key] +'</div>')
    }
  });
  //console.log('212:'+current_destination_id)
  if (current_destination_id == '') {
    current_destination_id = getVariable('hub_destination_id')
    //console.log('214:'+current_destination_id)
  }
  map_id = getVariable('current_map_id')
  //console.log(type)
  if (type == '1') {
    clearSequenceArray(map_id);
    $('#sequencepannel').empty()
    $('#sequencego').empty()
    // putSequenceArrayMaking(current_destination_id);
  } else {
    array = getVariable('sequencearray'+map_id)
    sequencearray_tmp = JSON.parse(array)
    clearSequenceArray(map_id)
    console.log(sequencearray_tmp)
    Object.keys(sequencearray_tmp).forEach(function (key) {
      console.log(key+':'+sequencearray_tmp[key])
      putSequenceArrayMaking(sequencearray_tmp[key]);
    });
  }
  // 松月堂対応・予定シナリオ入力
}

//現在の目的地を表示
function set_current_destination() {
  ontrace = getVariable('ontrace')
  if (ontrace==1) {
    $('.mainmessage').append('<p>トレースモード</p>')
    return
  }
  deslist = JSON.parse(getVariable('dl_all_array'))[getVariable('current_map_id')]
  move_to = getVariable('move_to')
  move_to_name = deslist[move_to]
  $('.mainmessage').append('<p>'+move_to_name+'へ移動中です</p>')
}


/////////////////////////////////////////////////////////////////////////////////////////
//一時変数操作
/////////////////////////////////////////////////////////////////////////////////////////
//その他変数初期化
function resetTemp() {
  setVariable('move_from', 0)
  setVariable('move_to', 0)
  setVariable('ontrace', 0)
  setVariable('current_destination_id', "")
  setVariable('turnaround', 0)
  setVariable('turnaround_count', 0)
  setVariable('api', "")
  setVariable('sequencearray', "")
  setVariable('roundarray', "")
  setVariable('sequencei', 0)
  setVariable('roundi', 1)
  setVariable('sensor_target', "")
  setVariable('onrelocate', 0)
  setVariable('complete_temp', 0);
  setVariable('select_temp', 0);
  setVariable('stopnow', 0);
}

//一次変数消去
function clearMoveStatus() {
  setVariable('ontrace', 0)
  setVariable('turnaround', 0)
  setVariable('turnaround_count', 0)
  setVariable('sequencei', 0)
  setVariable('roundi', 1)
  setVariable('complete_temp', 0);
  setVariable('select_temp', 0);
  setVariable('stopnow', 0);
}
