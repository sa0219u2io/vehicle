///////////////////////////////////////////////////////////////
//初期設定variablefilename
///////////////////////////////////////////////////////////////
//vehicleフォルダ内にて
//zip -r ../intruder-1-1-9.zip *
//debug 0: 本番, 1: デバッグ
const debug = localStorage.getItem('debug')?1:0;
const webroot = 'http://localhost/'
const variablefilename = 'intruder_variable.json'
const defaultlooptimer = 1000;
const sytemlooptimer = 10000;

//systemUIなしでデバッグしたいとき
if (debug == 0)  {
  var systemUI = window.parent.SystemUI
} else {
  var systemUI = window
}
const broadcast = new BroadcastChannel('System')
const mainversion = appname + '1.2.1' + '('+debug+')'
const asset = webroot+appname+'/asset/'


///////////////////////////////////////////////////////////////
//共通イニシャル処理
///////////////////////////////////////////////////////////////
//変数の初期化
function init() {
  loadBall()
  setLog(mainversion)
  resetVariable()
  //get_current_map();
  get_map_list();
  resetTemp()
  // setTimeout(, 3000)
}

///////////////////////////////////////////////////////////////
//処理関数
///////////////////////////////////////////////////////////////
//移動指示
function move(destination) {
  if (destination == '') {
    alert("目的地が設定されていません");
    return false;
  }
  current_location = getVariable('current_location')
  setVariable('move_from', current_location)
  setVariable('move_to', destination)
  setLog('目的地移動指示:'+ destination)
  // req_move(destination);
  setTimeout(function(){req_move(destination)}, 500)
  loadBall()
}

//移動完了時処理
function do_complete(current_location) {
  //ログに蓄積
  var logs = getVariable('log')
  current_goal_name = current_location
  logs = logs + ',' + current_location;
  setVariable('log', logs)
  turnaround = getVariable('turnaround');

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
          setLog('往復走行モード：目的地到着');
          time = getWait('complete')*1000
          playAnnounce('complete');
          setVariable('turnaround_count', 1)
          setTimeout(function(){transScreen('select')}, time)
        } else {
          setLog('往復走行モード：往復中');
          turnaround_count++
          setVariable('turnaround_count', turnaround_count)
          time = getWait('complete')
          setMainMessage(time + '秒後に折返し移動を開始します');
          playAnnounce('turnaround');
          time = time*1000
          setTimeout(function(){move(getVariable('move_from'))}, time)
        }
      } else {
        setLog('通常走行モード：目的地到着');
        time = getWait('complete')*1000
        playAnnounce('complete');
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

//目的地一覧を表示
function set_destination_list_sequence() {
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

  clearSequenceArray();
  putSequenceArray(current_destination_id);
}

///////////////////////////////////////////////////////////////
//API戻値取得関数
///////////////////////////////////////////////////////////////
function getResponseObserver(res) {
  //登録したobserverを解除にする
  systemUI.observerOff(getResponseObserver.name)
  var call = getVariable("api")
  //コールバック振分け処理
  callback(res)
}

// コールバック関数群
function callback(res) {
  res.type
  setLog(res);
  switch(res.type) {
    case "get_current_map" :
      if (res.result.result_cd == "1") {
        transScreen('error', '?e=no_map')
      }
      current_map = res.data.map_name
      
      break;
    case "get_map_list" :
      map_list = JSON.stringify(res.data.map_list)
      setVariable("map_list", map_list)
      //current_map = getVariable('current_map')
      current_map_object = res.data.map_list.filter(function (value) {
        return value.current_map_flg === 1;
      })
      current_map = current_map_object[0].map_name
      setVariable('current_map', current_map)
      scanVariable(current_map)
      destination_list = [];
      current_map_object[0].destination_list.forEach(element => destination_list.push(element.destination_name));
      
      setLog(destination_list)
      setVariable('destination_list', destination_list)
      // setTimeout(function(){transScreen('select', 6000)})
      break;
    case "get_current_location" : 
      callback_GCL(res)
      break;
    case "get_system_data" : 
      callback_GSD(res);
      break;
  }
}

// システムデータ取得
function callback_GSD(res) {
  // ただ、格納するだけ
  if(res.data.battery_status == 2) {
    setVariable('battery_charge', 1)
  } else {
    setVariable('battery_charge', 0)
  }
  setVariable('battery_level', res.data.battery_remain)
  setVariable('battery_status', res.data.battery_status)
}

// マップ設定の器の作成
function set_map_setting (map_id) {
  map_settings =JSON.parse(getVariable('map_settings'))
  // console.log(map_settings)
  if (map_settings.hasOwnProperty(map_id)) {
    current_map_settings = map_settings[map_id]
  } else {
    current_map_settings = map_settings['default']
  }
  // console.log(current_map_settings)
  setVariable('current_map_settings', JSON.stringify(current_map_settings))
  map_settings[map_id] = current_map_settings
  setVariable('map_settings', JSON.stringify(map_settings))
}