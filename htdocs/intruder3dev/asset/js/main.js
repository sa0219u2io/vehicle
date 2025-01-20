///////////////////////////////////////////////////////////////
//初期設定variablefilename
///////////////////////////////////////////////////////////////
//vehicleフォルダ内にて
//zip -r ../intruder3-3-9.zip *
//debug 0: 本番, 1: デバッグ
const debug = localStorage.getItem('debug')?'debug':'release';
const webroot = 'http://localhost/'
const variablefilename = 'intruder3_variable.json'

// systemUIなしでデバッグしたいときは、d3bug関数系を呼び出し
if (debug == 'release')  {
  var systemUI = window.parent.SystemUI
} else {
  var systemUI = window
}
const broadcast = new BroadcastChannel('System')
// const mainversion = appname+'.'+'1.22'+'('+debug+')'
const mainversion = appname+'.'+'3.9'+'('+debug+')'
const asset = webroot+appname+'/asset/'

const def_status = {
  "move": false,
  "error": false,
  "halt": false,
  "autostart" : false,
  "interval" : false,
}
const def_work = {
  "list" : [],
  "number" : 0,
  "from" : null,
  "to" : null,
  "reset": 0,
  "ready": false,
}
const timer = {
  "init": 5000,
  "default": 1000,
  "system": 10000,
  "complete": 6000,
  "remote": 3000,
  "ramdom": 15000,
}


///////////////////////////////////////////////////////////////
//共通イニシャル処理
///////////////////////////////////////////////////////////////
//変数の初期化
function init() {
  loadBall()
  setLog(mainversion)
  setUnderMessage(mainversion)

  resetVariable()
  resetStatus()
  resetWork()
  get_map_list()
  wipeRemoteJson()
  wipeMoveJson()
  setVariable('next_reserve', 0)
  setVariable('reserve_Main', '')
  setVariable('reserve_Under', '')
  setVariable('cutin', false)
  setVariable('senario_edit', false)
  setVariable('checkingAvoidance', false)

  setTimeout(function(){playAnnounce('wakeup')}, timer.default)
  setTimeout(init_map_check, timer.init)
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
// 全マップデータ取得
function callback_GML(res) {
  map_list = Array.from(res.data.map_list);
  // console.log(map_list)
  setVariable("map_list",map_list,'obj')
  current_map_object = map_list.filter(function (value) {
    return value.current_map_flg === 1;
  })
  current_map = current_map_object[0].map_name
  setVariable('current_map', current_map)
  scanVariable(current_map)
  destination_list = [];
  current_map_object[0].destination_list.forEach(element => destination_list.push(element.destination_name));
  setVariable('destination_list',destination_list,'obj')
}
// システムデータ取得
function callback_GSD(res) {
  battery = getVariable('battery','obj')
  if (res.data) {
    battery.status = res.data.battery_status
    if (res.data.battery_remain > 0 ) {
      battery.level = res.data.battery_remain
    }
    setVariable('battery', battery,'obj')
  }
}
// 現在地取得指示の戻り関数
function callback_GCL(res) {
  if (res.data.destination_name == undefined) {
    return
  }
  setVariable('current_location', res.data.destination_name)
  sendMeMultiple()
}

///////////////////////////////////////////////////////////////
//メイン関数
///////////////////////////////////////////////////////////////
// 移動スタック生成
async function makeWork(target=null) {
  cutin =getVariable('cutin')
  setLog({'cutin':cutin})
  if (isTrue(cutin)) {
    // 割り込み指令の時は
    pushWorkList(target,'next')
    setWork('ready',true)
    return
  }
  trip_mode = getVariable('trip_mode')
  work = getWork()
  turnaround = getVariable('turnaround','obj')
  loadBall();
  if (turnaround.number == 0) {
    if (trip_mode == 'normal') {
      pushWorkList(target) 
    } else if (trip_mode == 'hub') {
      hub = getVariable('hub','obj')
      if (hub.hub != null) {
        if (isTrue(getVariable('checkingAvoidance')) && isTrue(getVariable('multiple_flg'))) {
          pushWorkList(target)
          if (!isInArray(target, hub.destination_settings)) {         
            multiple = getVariable('multiple','obj')
            if (Array.isArray(multiple.hublist) && multiple.hublist.length > 0 && !isInArray(target, multiple.exceptionlist)) {
              pushWorkList(multiple.hublist[0])
            } else {
              pushWorkList(hub.hub)
            }
          }
        } else {
          pushWorkList(target)
          if (!isInArray(target, hub.destination_settings)) {         
            pushWorkList(hub.hub)
          }
        }
      } else {
        setModalMessage('戻り先の拠点を選択し直してください')
        return
      }
  
    } else if (trip_mode == 'sequence') {
      sequence = getVariable('sequence','obj')
      Object.keys(sequence.destination_settings).forEach(function(key) {
        pushWorkList(sequence.destination_settings[key])
      });
    } else if (trip_mode == 'senario') {
      senario = getVariable('senario','obj')
      Object.keys(senario[target].destination_settings).forEach(function(key) {
        pushWorkList(senario[target].destination_settings[key])
      });
    }
  } else {
    current_location = getVariable('current_location')
    destination_list = getVariable('destination_list','obj')
    if ($.inArray(current_location, destination_list) >= 0) {
      if (trip_mode == 'normal') {
        array = [target, current_location]
        await pushWorkStack(turnaround.number, array)
      } else if (trip_mode == 'hub') {
        setModalMessage('現在このモードは使用できません<br>往復モードを解除します')
        turnaround.number = 0
        setVariable('turnaround',turnaround,'obj')
        return 
      } else if (trip_mode == 'sequence') {
        sequence = getVariable('sequence','obj')
        await pushWorkStack(turnaround.number, sequence.destination_settings)
      } else if (trip_mode == 'senario') {
        setModalMessage('現在このモードは使用できません<br>往復モードを解除します')
        turnaround.number = 0
        setVariable('turnaround',turnaround,'obj')
        return 
      }
    } else {
      setModalMessage('現在地不明・往復運転ができません<br>再設置が必要です')
      return
    }
  }
  setTimeout(function() {
    setWork('ready',true)
  }, 500);
}

function pushWorkStack(number, array) {
  for (let index = 0; index < number; index++) {
    array.forEach((element) => {
      pushWorkList(element)
    });
  }
}

// 予約実行
function reserveWork(time) {
  reserve = getVariable('reserve','obj')
  next_reserve = getVariable('next_reserve')

  Object.keys(reserve).forEach(function _makeWork(key) {
    if (key > 0) {
      time = parseInt(time)
      reservetime = parseInt(reserve[key].time)
      advance = parseInt(time) + 1
      if (advance == reservetime) {
        setModalMessage('まもなく'+reserve[key].senario_name+'シナリオを実行します')
      }else if (time == reservetime && next_reserve != key) {
        if (reserve[key].enable == true) {
        // 自動実行
        setVariable('trip_mode','senario')
        makeWork(reserve[key].senario_number)
        setLog('senario:'+reserve[key].senario_name+'['+time+']')
        setVariable('next_reserve', key)
        return
        }
      }
    } 
  });
}
// 移動開始
function move(work = null) {
  current_location = getVariable('current_location')
  if (work == null) { work = getWork()}
  work.from = current_location
  work.to = work.list[work.number]
  work.reset = 0

  // 複数台運用の場合
  if (isTrue(getVariable('multiple_flg'))) {
    multiple = getVariable('multiple','obj')
    multiple_judgement = getMultipleJudgement(multiple)

    // 拠点モードの場合
    if (getVariable('trip_mode') == 'hub') {
      hub = getVariable('hub','obj')
      // 行先が拠点でない場合はとにかく行かせて、目的地近辺で待機
      if (work.to != hub.hub) {
        setWorkALL(work)
        req_move(work.to);
        loadBall();
        return
      } else {
        if (isInArray(hub.hub, multiple_judgement.nglist)) {
          // 行先が拠点で、かつ、NGリストに入ってる場合、退避場所に硫黄先を変更
          // 退避場所リストの頭から、NGリストに入ってない場所を探していかせる
          Object.keys(multiple.hublist).forEach(function(key) {
            if (!isInArray(multiple.hublist[key], multiple_judgement.nglist)) {
              multiple.avoidance = work.to
              work.to = multiple.hublist[key]
              setVariable('multiple',multiple,'obj')
              setWorkALL(work)
              req_move(work.to);
              loadBall();
              reserveUnderMessage('他のロボットが目的地を使用しているため、行き先を変更しました')
              return;
            }
          })
          if (isFalse(multiple.avoidance)) {
            setModalMessage('他のロボットが全ての候補地を占有していますので移動開始できません')
            return;
          }
        } else {
          // 行先が拠点で、かつ、NGリストに入っない場合、普通に移動開始
          setWorkALL(work)
          req_move(work.to);
          loadBall();
          return
        }
      }
    // 拠点モード以外の場合
    } else {
      // とにかく行かせて、目的地近辺で待機
      setWorkALL(work)
      req_move(work.to);
      loadBall();
    }
  }

  setWorkALL(work)
  req_move(work.to);
  loadBall();
}
// 再設置
function relocate(destination_name) {
  loadBall()
  req_set_location(destination_name)
}
// 一時停止
function stopnow() {
  req_stop_move()
  setVariable('operated',false)
  loadBall()
}
// 移動完了
function def_complete() {
  current_location = getVariable('current_location')
  move_to = getVariable('move_to')
  move_from = getVariable('move_from')
  autoReturnlock = 1;

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
        forceRemoteNoNext(hub.hub)
        console.log('割り込み')
        return
      }
      playAnnounce('autostart')
      setInterval(function(){playAnnounce('autostart')}, 10000)
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
    localStorage.setItem('remoteAutorun', 'false');
    localStorage.setItem('waitingDestination', _destination_name);
    setVariable('autostart', 'true')

    wait = _wait
    destination_name = _destination_name
    // 画面に[～へ送る]ボタンを表示
    // メッセージを選択
    message = JSON.parse(getVariable('message'))
    message_json =readJson('message')
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
    aftercount=0;
    temp = 0;

    // basewait = getVariable('auto_return_camera_basewait')
    afterwait = getVariable('auto_return_camera_afterwait')
    aftercount = 0;

    setInterval(_autostart_countup, defaultlooptimer)

    // auto_return_camera = (getVariable(auto_return_camera))?1:0;
    if (getVariable('auto_return_camera') == 1) {    
      setInterval(_checkQrCamera, defaultlooptimer)
    }
  }

  //ループスクリプト
  function _autostart_countup() {
    movejson = readMoveJson()
    console.debug(movejson)
    if (movejson.force == 'force') {
      // 割り込み指令アリの場合
      forceRemoteNoNext()
      return
    }

    if (temp == 0) {
      remoteAutoRun = localStorage.getItem('remoteAutorun');

      if (count >= wait) {
        now = wait - count;
        setMainMessage('自動で発進します'+'['+remoteAutoRun+']')
        localStorage.setItem('remoteAutorun', 'false');
        temp = 1;
        move(destination_name)

      } else if (remoteAutoRun == 'true') {
        setLog('HereWeGO:'.aftercount)
        if (aftercount >= afterwait) {
          // after_wait 経過時
          setMainMessage('自動で発進します'+'['+remoteAutoRun+']')
          localStorage.setItem('remoteAutorun', 'false');
          temp = 1;
          move(destination_name)
        } else {
          now = afterwait - aftercount;
          setMainMessage(now+'秒後に自動で発進します'+'['+remoteAutoRun+']')
        }
        setLog(aftercount+'/'+afterwait,0)
        aftercount++;
        count++;
      // 条件が全て未成就
      } else {
        aftercount = 0;
        if (autoReturnlock == 0) {
          move(destination_name)
        } else {
          now = wait - count;
          setMainMessage(now+'秒後に自動で発進します'+'['+remoteAutoRun+']')
          count++;
        }
      }
    }
  }

  // 自動帰宅カメラ
  function _checkQrCamera() {
    if (temp == 0) {
      data = readAutoReturnJson()
      setLog(data)
      countNotReady = 0;
      all_count = 0;
      true_count = 0;

      Object.keys(data.camera).forEach(function(key) {
        all_count++;
        if (data.camera[key] == true || data.camera[key] == 'true') {
          true_count++;
        }
      });

      if (true_count >= all_count) {
        localStorage.setItem('remoteAutorun', 'true');
      } else {
        localStorage.setItem('remoteAutorun', 'false');
      }
    }
  }
}
// 移動完了
function complete() {
  work = getWork()
  setLog(work)

  if ((parseInt(work.number)+1) >= work.list.length) {
    //全ての行動完了
    loadBall()
    _complete()    
  } else {
    trip_mode = getVariable('trip_mode')
    if (trip_mode == 'normal') {
      _turnaround(work)
    } else if (trip_mode == 'hub') {
      _hub(work)
    } else if (trip_mode == 'sequence') {
      _sequence(work)
    } else if (trip_mode == 'senario') {
      _senario(work)
    }
  }
}
// 移動完全完了の結果関数
function _complete() {
  resetWork()
  playAnnounce('complete')
  message = readJson('message');
  number = getVariable('message','obj').complete
  setModalMessage(message.complete[number].name)
  setTimeout(function __complete() {transScreen('select')}, timer.complete)
}
// 往復移動の結果関数
function _turnaround(work) {
  work.number++
  setWorkALL(work)

  playAnnounce('turnaround')
  message = readJson('message');
  number = getVariable('message','obj').complete
  setMainMessage(message.turnaround[number].name)
  autostart(getVariable('turnaround','obj').wait)
}
// 拠点移動の結果関数
function _hub(work) {
  work.number++
  setWorkALL(work)
  _hub_announce()
  setInterval(_hub_announce, timer.ramdom);

  message = readJson('message');
  number = getVariable('message','obj').hub
  setMainMessage(message.hub[number].name)
  autostart(getVariable('hub','obj').wait)

  function _hub_announce() {
    playAnnounce('autostart')
  }
}
// 連続移動の結果関数
function _sequence(work) {
  work.number++
  setWorkALL(work)

  playAnnounce('autostart')
  message = readJson('message');
  number = getVariable('message','obj').sequence
  setMainMessage(message.sequence[number].name)
  autostart(getVariable('sequence','obj').wait)
}
// シナリオ移動の結果関数
function _senario(work) {
  work.number++
  setWorkALL(work)

  playAnnounce('autostart')
  message = readJson('message');
  number = getVariable('message','obj').senario
  setMainMessage(message.senario[number].name)
  autostart(getVariable('sequence','obj').wait)
}
  // スタックによる自動発進
function autostart(wait) {
  stopBall()
  setStatus('autostart', true)
  number = getVariable('message','obj').autostart
  message = readJson('message').autostart[number];
  work = getWork()
  if (message.prefix != "") {
    message.prefix = work.list[work.number]
  }
  setActionButtonMessage(message.prefix+message.name+message.suffix)

  var stack =''
  var count = 0;
  for (let index = work.number; index < work.list.length; index++) {
    if (count > 2) {break}
    stack = stack + work.list[index]+' > '
    count++;
  }
  $('.complete_stack').empty()
  $('.complete_stack').append(stack)
  counter = wait
  send = true
  showCountup()
  setInterval(showCountup, timer.default)

  function showCountup() {
    $('.complete_countdown').empty()
    $('.complete_countdown').append(counter)
    counter--;
    if (counter <= 1 && isTrue(send)) {
      send = false
      setStatus('autostart', false)
      move()
    }
  }
}
