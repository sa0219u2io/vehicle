///////////////////////////////////////////////////////////////
//初期設定variablefilename
///////////////////////////////////////////////////////////////
//vehicleフォルダ内にて
//zip -r ../intruder-2-6-10.zip *
//debug 0: 本番, 1: デバッグ
const debug = localStorage.getItem('debug')?'debug':'release';
const webroot = 'http://localhost/'
const variablefilename = 'intruder_variable.json'
const defaultlooptimer = 1000;
const remotetimer = 3000;
const sytemlooptimer = 10000;
const facelooptimer = 20000;
const completetimer = 6000;

// systemUIなしでデバッグしたいときは、d3bug関数系を呼び出し
if (debug == 'release')  {
  var systemUI = window.parent.SystemUI
} else {
  var systemUI = window
}
const broadcast = new BroadcastChannel('System')
const mainversion = appname + '2.6.10' + '('+debug+')' + 'IP={'+myip+'}'
const asset = webroot+appname+'/asset/'

///////////////////////////////////////////////////////////////
//共通イニシャル処理
///////////////////////////////////////////////////////////////
//変数の初期化
function init() {
  loadBall()
  setLog(mainversion)
  resetVariable()
  resetTemp()
  setVariable('mode', 'normal')
  get_map_list()
  wipeRemoteJson()
  wipeMoveJson()
  // scanVariable()
  // resetTemp()
  setTimeout(init_map_check, 8000)
}
// 全ページ共通処理
function beforehandler() {
  if (basename != 'error' && basename != 'index' && basename != 'remote') {
    checkBattery()
    get_system_data()
    // setLog('CheckBattery')
  }
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
///////////////////////////////////////////////////////////////
//コールバック関数
///////////////////////////////////////////////////////////////
function callback(res) {
  res.type
  switch(res.type) {
    case "get_current_map" :
      callback_GCM(res)
      break;
    case "get_map_list" :
      callback_GML(res)
      break;
    case "get_current_location" : 
      callback_GCL(res)
      // callback_GCLはページごとに挙動が異なるので、各ページで規定する
      break;
    case "get_system_data" : 
      callback_GSD(res);
      break;
  }
}
// 現在マップデータ取得
function callback_GCM(res) {
  if (res.result.result_cd == "1") {
    transScreen('error', '?error=no_map')
  }
  current_map = res.data.map_name
  setVariable('current_map', current_map)
}
// 全マップデータ取得
function callback_GML(res) {
  map_list = JSON.stringify(res.data.map_list)
  setVariable("map_list", map_list)
  current_map_object = res.data.map_list.filter(function (value) {
    return value.current_map_flg === 1;
  })
  current_map = current_map_object[0].map_name
  setVariable('current_map', current_map)
  scanVariable(current_map)
  destination_list = [];
  current_map_object[0].destination_list.forEach(element => destination_list.push(element.destination_name));
  setVariable('destination_list', JSON.stringify(destination_list))
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

///////////////////////////////////////////////////////////////
//メイン関数
///////////////////////////////////////////////////////////////
// 移動開始
function move(destination_name) {
  var movesetting = {'move_from': getVariable('current_location'), 'move_to' : destination_name}

  if (movesetting.move_from) {
    setVariable('move_from', movesetting.move_from)
  }
  setVariable('move_to', movesetting.move_to)
  setLog(movesetting)
  req_move(destination_name);
  loadBall();
}
// 再設置
function relocate(destination_name) {
  loadBall()
  req_set_location(destination_name)
}
// 一時停止
function stopnow() {
  req_stop_move(0)
  loadBall()
}
// 移動完了
function complete() {
  current_location = getVariable('current_location')
  move_to = getVariable('move_to')
  move_from = getVariable('move_from')

  trip_mode = getVariable('trip_mode')
  turnaround = getVariable('turnaround')
  if (turnaround == 'true') {
    turnaround_i = getVariable('turnaround_i')
    turnaround_num = getVariable('number-turnaround')
    turnaround_comp = (turnaround_i >= turnaround_num*2)?1:0
    turnaround_wait = getVariable('turnaround_wait')
  } else {
    turnaround_comp = 1
    turnaround_i = 0
    turnaround_num = 0
  }

  // get_current_locationの不具合対応
  if (move_to != current_location) {
    current_location = move_to
  }
  
  console.log('current_location: '+current_location)
  console.log('move_to: '+move_to)
  console.log('move_from: '+move_from)
  console.log('trip_mode: '+trip_mode)
  console.log('turnaround: '+turnaround)
  console.log('turnaround_comp: '+turnaround_comp)
  console.log('turnaround_i: '+turnaround_i)
  console.log('turnaround_num: '+turnaround_num)

  remote = checkRemoteMove()
  console.log('remote:'+remote)

  if (trip_mode == 'normal') {
    if (turnaround == 'true' && ((turnaround_num * 2) > turnaround_i)) {
      // 通常走行[往復]往復中
      if (remote == 'force') {
        // 割り込み指令アリの場合
        console.log('割り込み')
        setTimeout(function(){forceRemote(move_from)}, turnaround_wait * 1000)
        return
      }
      playAnnounce('turnaround')
      turnaround_i++
      string = turnaround_i / 2 +'/' +turnaround_num+'往復'
      setUnderMessage(string)
      setVariable('turnaround_i', turnaround_i)
      _autostart(move_from, turnaround_wait);
      return;
    } else {
      // 通常走行 OR 通常走行[往復]往復完了
      playAnnounce('complete')
      _complete()
    }
  } else if (trip_mode == 'hub') {
    hub = JSON.parse(getVariable('hub'))
    // console.log(hub)
    if (current_location == hub.hub || $.inArray(current_location, hub.destination_list) >= 0) {
      // 拠点走行[拠点・適用外]
      _complete()
    } else {
      // 拠点走行[一般]
      if (remote == 'force') {
        // 割り込み指令アリの場合
        forceRemote(hub.hub)
        console.log('割り込み')
        return
      }
      playAnnounce('autostart')
      _autostart(hub.hub, hub.wait);
    }
  } else if (trip_mode == 'sequence') {
    sequence_array = JSON.parse(getVariable('sequence_array'))
    sequence = JSON.parse(getVariable('sequence'))
    sequence_i = getVariable('sequence_i')
    if (remote == 'force') {
      // 割り込み指令アリの場合
      if (sequence_array.length > sequence_i) {
        setTimeout(function(){forceRemote(sequence_array[sequence_i+1])}, sequence.wait * 1000)
      } else {
        setTimeout(function(){forceRemote(sequence_array[0])}, sequence.wait * 1000)
      }
      console.log('割り込み')
      return
    }
    sequence_i++
    setVariable('sequence_i', sequence_i)
    console.log(sequence)
    if (sequence_array.length > sequence_i) {
      // 連続走行[一般]継続中
      playAnnounce('autostart')
      _autostart(sequence_array[sequence_i], sequence.wait);
    } else {
      if (turnaround == 'true') {
        if (turnaround_i >= turnaround_num) {
          // 連続走行[一般]完了・[往復]往復完了
          playAnnounce('complete')
          setVariable('sequence_array', '')
          setVariable('sequence_i', 0)
          setVariable('turnaround_i', 0)
          _complete();
        } else {
          // 連続走行[一般]完了・[往復]往復中
          playAnnounce('turnaround')
          turnaround_i++
          string = turnaround_i +'/' +turnaround_num+'往復'
          setUnderMessage(string)
          setVariable('sequence_i', 0)
          setVariable('turnaround_i', turnaround_i)
          _autostart(sequence_array[0], turnaround_wait);
        }
      } else {
        // 連続走行[一般]完了
        playAnnounce('complete')
        setVariable('sequence_array', '')
        setVariable('sequence_i', 0)
        _complete();
      }
    }
  } else if (trip_mode == 'senario') {
    senario = JSON.parse(getVariable('senario'))
    senario_i = getVariable('senario_i')
    current_senario = senario[getVariable('current_senario')]
    if (remote == 'force') {
      // 割り込み指令アリの場合
      if (current_senario.destination_list.length > senario_i) {
        setTimeout(function(){forceRemote(current_senario.destination_list[senario_i+1])}, 10 * 1000)
        setUnderMessage('割込み指示が入りました。'+ 10 +'秒後に発進します')
      }
      console.log('割り込み')
      return
    }

    senario_i++
    setVariable('senario_i', senario_i)

    if (current_location == "滅菌室2") {
      console.log("滅菌室2WAIT:".current_location)
      current_senario.wait = 60
    }

    if (current_senario.destination_list.length > senario_i) {
      // 連続走行[一般]継続中
      playAnnounce('autostart')
      _autostart(current_senario.destination_list[senario_i], current_senario.wait);
    } else {
      if (turnaround == 'true') {
        if (turnaround_i >= turnaround_num) {
          // 連続走行[一般]完了・[往復]往復完了
          playAnnounce('complete')
          setVariable('senario_i', 0)
          setVariable('turnaround_i', 0)
          _complete();
        } else {
          // 連続走行[一般]完了・[往復]往復中
          playAnnounce('turnaround')
          turnaround_i++
          string = turnaround_i +'/' +turnaround_num+'往復'
          setUnderMessage(string)
          setVariable('sequence_i', 0)
          setVariable('turnaround_i', turnaround_i)
          _autostart(current_senario.destination_list[0], turnaround_wait);
        }
      } else {
        // 連続走行[一般]完了
        playAnnounce('complete')
        setVariable('senario_i', 0)
        _complete();
      }
    }
  }

  // 移動完了
  function _complete() {
    // if (move_to == current_location || current_location == '') {
      setMainMessage('目的地に到着しました')
      playAnnounce('complete')
      comp = {'move_from': move_from, 'move_to': move_to, 'trip_mode': trip_mode, 'turnaround': turnaround}
      setLog(comp)
      clearMoveStatus();
      setTimeout(function(){transScreen('select')}, completetimer)
      
    // } else {
    //  transScreen('error', '?error=wrongdestination')
    // }
  }

  // 自動発進
  function _autostart (_destination_name, _wait) {
    console.log('自動発進')
    stopBall()
    wait = _wait
    destination_name = _destination_name
    // 画面に[～へ送る]ボタンを表示
    // メッセージを選択
    message = JSON.parse(getVariable('message'))
    message_json = readJson('message');
    console.log(message_json)
    if (message_json.autostart[message.autostart] != null) {
      temp = message_json.autostart[message.autostart] 
    } else {
      temp = message_json.autostart[0] 
    }
    if (temp.prefix == "destination_name") {
      temp.name = _destination_name + temp.name
    }

    $('.main').empty()
    $('.main').append('<div class="autostart_button" onclick="move(\''+_destination_name+'\')">'+temp.name+'</div>')
    // 画面で[自動発進]をカウントダウン
 
    // シナリオモードなら
    trip_mode = getVariable('trip_mode')
    if (trip_mode == 'senario') {
      $('.main').append('<div class="autostart_button" onclick="transScreen(\'cutin\')">割込指示をする</div>')
    }

    count = 0;
    temp = 0;
    setInterval(_autostart_countup, defaultlooptimer)
  }

  //ループスクリプト
  function _autostart_countup() {
    if (temp == 0) {
      if (count >= wait) {
        now = wait - count;
        setMainMessage(now+'秒後に自動で発進します')
        move(destination_name)
        temp = 1;
      } else {
        now = wait - count;
        setMainMessage(now+'秒後に自動で発進します')
        count++;
      }
    }
  }
}

// 予約移動開始
function reserveCount() {
  reserve = JSON.parse(getVariable('reserve'))
  reserve_judge = [];
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var time = zeroPadding(hour,2)+zeroPadding(minute,2)
  console.log('時刻:'+time)

  Object.keys(reserve).forEach(function(key) {
    if (key > 0) {
      if (reserve[key].enable == true) {
        if (time == reserve[key].time) {
          // 自動実行
          senario_name = reserve[key].senario_name
          setVariable('trip_mode' ,'senario')
          senario = JSON.parse(getVariable('senario'))
          senario_i = 0;
          Object.keys(senario).forEach(function(subkey) {
            if (senario_name == senario[subkey].name) {
              setVariable('current_senario', subkey)
              move(senario[subkey].destination_list[0])
            }
            return
          });
        }
      }
    } 
  });
  doRemoteMove()
}

function doRemoteMove() {
  movejson = readMoveJson()
  console.log(movejson)
  destination_list = JSON.parse(getVariable('destination_list'))
  if ($.inArray(movejson.destination, destination_list) >= 0) {
    move(movejson.destination)
    wipeMoveJson()
    setVariable('trip_mode' ,'normal')
  }
}

function checkRemoteMove() {
  movejson = readMoveJson()
  // console.log(movejson)
  // destination_list = JSON.parse(getVariable('destination_list'))
  res = 'na'
  if (movejson) res = 'normal'
  if (movejson.force) res = movejson.force
  return res
}

function forceRemote(next) {
  setVariable('forcemove', next)
  movejson = readMoveJson()
  destination_list = JSON.parse(getVariable('destination_list'))
  if ($.inArray(movejson.destination, destination_list) >= 0) {
    req_move(movejson.destination)
    wipeMoveJson()
  }
}