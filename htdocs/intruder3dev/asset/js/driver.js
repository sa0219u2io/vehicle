///////////////////////////////////////////////////////////////
//ドライバ関数
///////////////////////////////////////////////////////////////
// API送信処理を共通化
function sendAPI(data) {
  setVariable('api', data.type)
  if (data.type != 'get_system_data') {
    setLog(data);
  }
  //本番環境なら
  if (debug == 'release') {
    systemUI.sendData(data)
    responce = systemUI.receivedData(getResponseObserver)
  //デバッグ環境なら
  } else {
    var url = 'debug/' + data.type + '.json'
    $.getJSON(url, (data) => {
      callback(data)
    })
  }
}
// JSON取得
function readJson(type) {
  var url = asset + 'json/'+type+'.json';
  var res = 'fail_to_get_JSON'
  $.ajaxSetup({async: false});
  $.getJSON(url, (data) => {
  }).done(function(data){
    res = data
  });
  return res
}
//画面遷移関数
function transScreen(string, param="") {
  setLog(string)
  window.location.href = webroot+appname+'/'+ string +'.php'+param;
}
// ログ書込
function setLog(obj) {
  var log = {}
  log[setLog.caller.name] = obj
  console.log(log)
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxLog.php?level=debug',
    data : log,
    dataType: 'JSON'
  });
}
// バッテリ残量チェック
function checkBattery() {
  lowbattery_count = getVariable('lowbattery_count')
  battery = getVariable('battery','obj')
  // setLog(battery)
  if (battery.status) {
    if (battery.status == "2") {
      transScreen('error', '?error=charging')
    }
  }
  if (battery.hasOwnProperty('level')) {
    if (lowbattery_count > 0) {
      if (parseInt(battery.level) <= battery.warning) {
        transScreen('error', '?error=low_battery')
      } else if (parseInt(battery.level) <= battery.alert) {
        setUnderMessage('バッテリー残量'+battery.level+'%です。充電してください')
      }
    } else {
      setVariable('lowbattery_count', 1)
    }

  }
}
// 全ページ共通ログ処理
function page_int() {
  setLog(basename);
  if (!isInArray(basename, ['index','remote','destination'])){
    setTimeout(sendMeMultiple, timer.init)
  }
}
// 内部連携AJAX処理
function ajaxInternal(type, async, data, datatype) {

}
// 外部連携AJAX処理
function ajaxExternal(_type, _url, _data = null, _datatype = null) {
  // type = [gatherMultiple];
  //本番環境なら
  res = false
  if (debug == 'release') {
    if (_type =='gatherMultiple') {
      // 他者情報の収集
      $.ajax({
        type: "GET",
        url: _url,
        timeout: 500
      }).done(function(data){
        res = JSON.parse(data);
      });
      
    } else if (_type =='sendMeMultiple') {
      $.ajax({
      type: "POST",
      url: _url,
      data: _data,
      dataType: 'json',
      contentType: "application/json",
      timeout: 500
      }).done(function(data){
        res = data;
      })
    }

  // デバッグ環境なら
  } else {
    if (_type =='gatherMultiple') {
      var url = webroot+appname+'/debug/multiple.json'
      $.getJSON(url, (data) => {
        res = data;
      })
    } else if (_type =='sendMeMultiple') {
      console.log(_data);
      var url = webroot+appname+'/component/multiple.php'
      $.ajax({
      type: "POST",
      url: url,
      data: _data,
      dataType: 'json',
      contentType: "application/json",
      timeout: 500
      }).done(function(data){
        res = data;
      })
    }
  }
  var f = {'type':_type, 'data': res};
  setLog(f);
  return res;
}

// 単純配列判定
function isInArray(target, array) {
  temp = $.inArray(target, array)
  if (temp >= 0) {
    return true
  } else {
    return false
  }
}

///////////////////////////////////////////////////////////////
// 変数制御
///////////////////////////////////////////////////////////////
// コンソール変数読込
function getVariable(key, type=undefined) {
  temp = sessionStorage.getItem(key);
  if (type == undefined) {
    return temp;
  } else {
    if (temp != undefined) {
      return JSON.parse(sessionStorage.getItem(key));
    } else {
      return undefined;
    }
  }
}
// コンソール変数書込
function setVariable(key, value, type=undefined) {
  if (type == undefined) {
    sessionStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  writeRemoteJson()
}
// キャッシュ変数保存
function writeVariable(current_map) {
  setLog('設定保存開始');
  // 全設定データをsessionstorageから取ってくる。
  var variables = new Object()

  default_setting = readJson('variable')
  setLog(default_setting)
  default_setting.current_map = getVariable('current_map')
  
  Object.keys(default_setting.settings.default).forEach(function(key) {
    if (key == 'undefined') {
      variables[key] = default_setting.settings.default[key]
    } else {
      temp = getVariable(key)
      variables[key] = temp
    }
  });
  default_setting.settings[default_setting.current_map] = variables;

  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxwrite.php?file='+btoa(variablefilename),
    data: default_setting,
    dataType: 'json'
  }).done(function(data){
    setLog('設定保存完了');
    setLog(default_setting);
  });
}
// キャッシュ変数復元
function scanVariable(current_map) {
  // console.trace()
  default_setting = readJson('variable')
  var response = new Object();
  setLog(current_map)
  var res = new Object
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxscan.php?file='+btoa(variablefilename),
    data: response,
    dataType : "json"
  }).done(function _scanVariable(data){
    setLog(data)
    // 既存MAPのsettingを取得
    if (data.settings[current_map] == undefined) {
      // 既存MAPのsettingがない場合
      res = default_setting.settings['default']
    } else {
      // 既存MAPのsettingがある場合
      res = data.settings[current_map]
    }

    //項目はvariablesから引っ張る
    Object.keys(default_setting.settings.default).forEach(function(key) {
      // console.log(key)
      if (res[key] == undefined) {
        var val = default_setting.settings.default[key];
      } else {
        var val = res[key];
      }
      
      // console.log(val)
      if (typeof val == 'object') {val = JSON.stringify(val)}
      setVariable(key, val);
    }, res);
  }).fail(function(jqXHR, textStatus, errorThrown){
    console.log('scanfailed')
    console.log(textStatus)
    console.log(errorThrown)
  });
}
// 変数初期化
function wipeVariable() {
  loadBall()
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxwipe.php?file='+btoa(variablefilename),
    data: '',
    dataType : "json"
  });
  setLog('設定削除')
  transScreen('index')
}
// ステータス変数読込
function getStatus(key) {
  return getVariable('status','obj')[key]
}
// ステータス変数書込
function setStatus(key, value) {
  _status = getVariable('status','obj');
  _status[key] = value
  setVariable('status',_status,'obj')
}
// ステータスクリア
function resetStatus() {
  setLog('ステータス消去')
  setVariable('status',def_status,'obj')
}
// 待機時間取得関数
function getWait(trimode) {
  // console.log(trimode)
  setting = JSON.parse(getVariable(trimode))
  return setting.wait
}
// 待機時間設定関数
function setWait(trimode, wait) {
  console.log(trimode)
  setting = JSON.parse(getVariable(trimode))
  setting.wait = wait
  console.log(setting)
  setVariable(tripmode, JSON.stringify(setting))
  return
}
// 変数全消去
function resetVariable() {
  sessionStorage.clear();
}
// 移動モードに応じて目的地選択画面を切替
function tripmode_check(target) {
  trip_mode = getVariable('trip_mode')
  if (trip_mode == 'sequence') {
    if (target != 'sequence') {
      transScreen('sequence')
      return false
    }
  } else if (trip_mode == 'hub') {
    setStatus('turnaround', 0)
    if (target != 'normal') {
      transScreen('select')
      return false
    }
  } else if (trip_mode == 'senario') {
    if (target != 'senario') {
      transScreen('senario')
      return false
    }
  } else if (trip_mode == 'normal') {
    if (target != 'normal') {
      transScreen('select')
      return false
    }
  } else {
    transScreen('index')
    return false
  }
  showTripmode()
  return true
}


///////////////////////////////////////////////////////////////
// 制御ユーティリティ
///////////////////////////////////////////////////////////////
// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}
//Chunk
function splitByChunk(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)
  for (let i=0, x=0; i < numChunks; ++i, x += size) {
    chunks[i] = str.substr(x, size)
  }
  return chunks
}
//正誤判定
function isFalse(target) {
 if (target == false || target == 'false') {
  return true
 } else {
  return false
 }
}
// 正誤判定
function isTrue(target) {
  if (target == true || target == 'true') {
    return true
   } else {
    return false
   }
}
// オブジェクト判定
function isObject(value) {
  return value !== null && typeof value === 'object'
}

///////////////////////////////////////////////////////////////
// 画面表示ユーティリティ
///////////////////////////////////////////////////////////////
// メインメッセージを表示
function setMainMessage(string) {
  $('.main_message').empty()
  $('.main_message').append(string)
}
// 下部メッセージを表示
function setUnderMessage(string) {
  $('.under_message').empty();
  $('.under_message').append(string);
}
// メインメッセージを表示
function setModalMessage(string) {
  // console.log('ass')
  $('.modal_message').empty()
  $('.modal_message').append(string)
  openModal('modal_message')
}
// メインメッセージを予約
function reserveMainMessage(content) {
  setVariable('reserve_Main', content)
}
// 下部メッセージを予約
function reserveUnderMessage(content) {
  setVariable('reserve_Under', content)
}
// 予約メッセージの表示
function checkMessage() {
  message = getVariable('reserve_Main') 
  if (message != '') {
    setMainMessage(message)
    setVariable('reserve_Main', '')
  }
  message = getVariable('reserve_Under') 
  if (message != '') {
    setUnderMessage(message)
    setVariable('reserve_Under', '')
  }
}
// メインメッセージを表示
function setActionButtonMessage(string) {
  $('.action_button').empty()
  $('.action_button').append(string)
}
// ウェイトボール表示
function loadBall(maxwait = 15000) {
  // console.trace('loadBall')
  $('.loading').removeClass('hid')
  $('#loadingwall').removeClass('hid')
  $("#loadingwall").fadeIn("slow");
  if (maxwait != 0 && debug == "release") {
    setTimeout(function loadBallErorr(){
      setLog('No Reply ERROR');
      transScreen('index')
    }, maxwait)
  }
}
// ウェイトボール削除
function stopBall() {
  $('.loading').addClass('hid')
  $('#loadingwall').addClass('hid')
}
// エラーメッセージを表示
function setMainError(string) {
  $('.error').empty()
  $('.error').append(string)
}
// メインコンテンツを挿入
function setMain(string) {
  $('.main').empty();
  $('.main').append(string);
}
// メインコンテンツを追加
function pushMain(string) {
  $('.main').append(string);
}
// 表示順序初期化
function initDestinationListOrder(current_map) {
  current_dl = getVariable('destination_list','obj')
  tempOrder = getVariable('order','obj')
  deleteList = [];
  addList = [];
  // 最新の目的地リストに応じて表示順を改定
  Object.keys(tempOrder).forEach(function(key) {
    // 目的地リストに含まれなければ削除
    if ($.inArray(tempOrder[key], current_dl) < 0) {
      deleteList.push(key);
    }
  });
  Object.keys(current_dl).forEach(function(key) {
    // 目的地リストに含まれなければ削除
    if ($.inArray(current_dl[key], tempOrder) < 0) {
      addList.push(current_dl[key]);
    }
  });
  Object.keys(deleteList).forEach(function(key) {
    tempOrder.splice(key, 1); 
  });
  $.merge(tempOrder, addList);
  setVariable('order',tempOrder,'obj')
}
// 許容誤差初期化
function initDestinationListTorelance() {
  tolerance = getVariable('tolerance','obj')
  tempTolerance = tolerance.destination_settings
  current_dl = getVariable('destination_list','obj')
  addList = {};

  // 最新の許容誤差地リストに応じて表示順を改定
  if (tempTolerance != null) {
    Object.keys(tempTolerance).forEach(function(key) {
      // 目的地リストに含まれなければ削除
      if ($.inArray(key, current_dl) < 0) {
        delete tempTolerance[key]
      }
    });

    Object.keys(current_dl).forEach(function(key) {
      // 目的地リストに含まれなければ追加
      if (!tempTolerance.hasOwnProperty(current_dl[key])) {
        addList[current_dl[key]] = tolerance.default;
      }
    });
    console.log(addList)

  } else {
    tempTolerance = {};
    Object.keys(current_dl).forEach(function(key) {
      addList[current_dl[key]] = tolerance.default;
    });
  }

  $.extend(tempTolerance, addList);
  setLog(tempTolerance)
  tolerance.destination_settings = tempTolerance
  
  setVariable('tolerance',tolerance,'obj')
}

function nomenu() {
  $('.modal-opener').addClass('no-menu')
  console.log('nomenu')
}
///////////////////////////////////////////////////////////////
// メディア制御
///////////////////////////////////////////////////////////////
let music
//移動時音楽再生
function playMusic(current_music = null) {
  musiclist = readJson('music');
  if (current_music == null) {
    current_music = getVariable('music');
  }
  TempMusic = musiclist[current_music].audio

  setVariable('TempMusic', TempMusic);
  music = new Audio(TempMusic);
  music.loop = true;
  vol = getVariable('music_volume')/100
  music.volume = vol;
  music.play();
}
function playUrlMusic(url) {
  TempMusic = url

  setVariable('TempMusic', TempMusic);
  music = new Audio(TempMusic);
  music.loop = true;
  vol = getVariable('music_volume')/100
  music.volume = vol;
  music.play();
}
//移動時音楽停止
function stopMusic() {
  if (music) {
    music.pause();
  }
}
//アナウンス設定
function playAnnounce(type) {
  var announce = JSON.parse(getVariable('announce'))
  var num = announce[type]
  data = readJson('announce');
  audiodata = data[type][num]
  if (audiodata.audio != "") {
    url = asset +'announce/'+audiodata.audio
    setLog(url);
    var announce = new Audio(url);
    vol = getVariable('announce_volume')/100
    announce.volume = vol;
    announce.play();
  }
}
//アナウンスの再生を設定する
function setAnnounce(type, number) {
  var announce = JSON.parse(getVariable('announce'))
  announce[type] = number;
  setVariable('announce', JSON.stringify(announce))
  playAnnounce(type)
  closeModal()
}

///////////////////////////////////////////////////////////////
// リモート系制御
///////////////////////////////////////////////////////////////
// コンソール変数読込
function readRemoteJson() {
  data = {}
  url= webroot+appname+'/component/scanRemote.php'
  var res = 'fail_to_get_JSON'
  $.ajaxSetup({async: false});
  $.getJSON(url, (data) => {
  }).done(function(data){
    res = data
  });
  return res
}
// コンソール変数読込
function writeRemoteJson() {
  let remote = {}
  for (let i = 0; i < sessionStorage.length; i++) {
    remote[sessionStorage.key(i)] = sessionStorage.getItem(sessionStorage.key(i))
  }
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/writeRemote.php',
    data: remote,
    dataType: 'json'
  })
}
// コンソール変数全削除
function wipeRemoteJson() {
  // loadBall()
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/wipeRemote.php',
    data: '',
    dataType : "json"
  })
} 

// リモート指示読取
function readMoveJson() {
  data = {}
  url= webroot+appname+'/component/scanMove.php'
  var res = 'fail_to_get_JSON'
  $.ajaxSetup({async: false});
  $.getJSON(url, (data) => {
  }).done(function(data){
    res = data
  });
  return res
}
// リモート指示書込
function writeMoveJson(destination, force='normal') {
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/writeMove.php',
    data: {'destination': destination, 'force': force},
    dataType: 'json'
  })
}
// リモート指示全削除
function wipeMoveJson() {
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/wipeMove.php',
    data: '',
    dataType : "json"
  })
  writeMoveJson("")
} 
// リモート予約確認
function checkRemote() {
  remote = readMoveJson()
  if (remote.destination != '') {
    setLog(remote)
    if (remote.force =="force") {
      getVariable('cutin', true)
      makeWork(remote.destination)
    } else {
      pushWorkList(remote.destination)
      setWork('ready',true)
    }
    wipeMoveJson()
  }
}

///////////////////////////////////////////////////////////////
// 移動スタック系
///////////////////////////////////////////////////////////////
// 移動変数読込
function getWork(key = false) {
  if (key) {
    return getVariable('work','obj')[key]
  } else {
    return getVariable('work','obj')
  }
}
// 移動変数書込
function setWork(key, value) {
  _work = getVariable('work','obj');
  _work[key] = value
  setVariable('work',_work,'obj')
}
// 移動変数書込
function setWorkALL(_work) {
  setVariable('work',_work,'obj')
  setLog(work)
}
// 移動クリア
function resetWork() {
  setLog('ステータス消去')
  setVariable('work',def_work,'obj')
}
// スタックへの追加
function pushWorkList(destination, i = null) {
  work = getWork()
  if (i == null) {
    // 最後に追加
    work.list.push(destination);
    setWork('list', work.list)
    return true
  } else{
    if (i == 'next') {
      i = work.number
    } else if (!$.isNumeric(i)) {
      return false
    }
    console.log(i)
    if (work.list.length > i) {
      work.list.splice(i,0,destination);
      setWork('list', work.list)
      return true
    } else {
      return false
    }
  }
}
// スタックの項目削除
function deleteWorkList(i= null) {
  work = getWork()
  if (i == null) {
    // 最後に追加
    work.list=[];
    setWork('list', work.list)
    setWork('number', 0)
    return true
  } else{
    if (i == 'next') {
      i = work.list.number
    } else if (!$.isNumeric(i)) {
      return false
    }
    // [a,b,c,d,e] i = 1
    if (work.list.length > i) {
      work.list.splice(i,1);
      setWork('list', temp.list)
      return true
    } else {
      return false
    }
  }
}
///////////////////////////////////////////////////////////////
// 複数台制御関連
///////////////////////////////////////////////////////////////
// 操作済みフラグの操作
function operatedFlg(flg = true) {
  setVariable('operated',flg)
  if (isFalse(flg)) {
    initMeMultiple()
  }
  setLog('operatedFlg:'+flg)
}

// 他者のmultiplejsonをリフレッシュする
function sendMeMultiple() {
  if (isTrue(getVariable('multiple_flg')) && isTrue(getVariable('operated'))) {
    work = getWork()
    multiple = getVariable('multiple','obj')
    current_location = ''
    if (isInArray(basename, ['select','sequence','senario','complete'])){
      current_location = getVariable('current_location')
    }
    _json = {'work':work, 'current_location':current_location, 'mynumber': multiple.mynumber}
    // _json = {'whois':'isbadguy'}
    refreshMultiple(multiple.myip, _json)
    // setLog(_json)
    // 送信処理
    var res = {}
    Object.keys(multiple.iplist).forEach(function _sendMeMultiple(key) {
      var _url = 'http://'+multiple.iplist[key]+'/'+appname+'/component/multiple.php?ip='+btoa(multiple.myip)
      setLog(_url)
      setLog(_json)
      ajaxExternal('sendMeMultiple', _url, _json, 'json')
    })
    return 
  }
}
// 回避時の復帰行動
function checkAvoidance() {
  if (isTrue(getVariable('checkingAvoidance')) && isTrue(getVariable('multiple_flg'))) {
    gatherMultiple()
    multiple = getVariable('multiple','obj')
    multiple_judgement = getMultipleJudgement(multiple)

    if (multiple_judgement.count == 0) {
      setUnderMessage('他のロボットの情報が不明です')
      return
    }
    current_location = getVariable('current_location')
    ar_move = false
    if (getVariable('trip_mode') == 'hub') {
      hub = getVariable('hub','obj')
      if (current_location != hub.hub) {
        if (!isInArray(hub.hub, multiple_judgement.nglist) && multiple_judgement.noMARecovery == false) {
          ar_move = hub.hub
        }
      } else {
        return
      }
    } else {
      if (isInArray(multiple.avoidance, multiple_judgement.nglist) && multiple_judgement.noMARecovery == false) {
        ar_move = multiple.avoidance
      }
    }

    if (!isFalse(ar_move)) {
      // console.log(ar_move)
      multiple.avoidance =false
      setVariable('multiple',multiple,'obj')
      autoMove(ar_move)
      reserveUnderMessage('他のロボットが目的地を離れたため、拠点に向います')
    } else {
      if (multiple_judgement.noMARecovery == false) {
        setUnderMessage('他のロボットが拠点を使用中です')
      } else {
        setUnderMessage('自動復帰適用外拠点に他のロボットが向かっています')
      }

    }
  }
}

// 自分のmultiplejsonを初期化する
function initMeMultiple() {
  var _url = webroot+appname+'/component/initmultiple.php'
  setLog(_url)
  $.ajax({
    type: "GET",
    url: _url
  })
}

// 位置情報を自分のmultiplejsonに書き込む
function refreshMultiple(ip = null, _json = null) {
  if (isTrue(getVariable('multiple_flg'))) {
    if (ip == null) {
      work = getWork()
      multiple = getVariable('multiple','obj')
  
      current_location = ''
      if ($.inArray(basename, ['select','sequence','senario','complete']) >= 0){
        current_location = getVariable('current_location')
      }   
      _json = {'work':work, 'current_location':current_location, 'mynumber': multiple.mynumber}
      ip = multiple.myip
    }
    var _url = webroot+appname+'/component/multiple.php?ip='+btoa(ip)

    setLog(ip)
    setLog(_url)
    $.ajax({
      type: "POST",
      url: _url,
      data: JSON.stringify(_json),
      dataType: 'json',
      contentType: "application/json"
    }).done(function _refreshMultiple(data){
      setLog(data)
    })
  }
}

// 他者のmultiplejsonを取得する
function gatherMultiple() {
  if (isTrue(getVariable('multiple_flg'))) {
    work = getWork()
    multiple = getVariable('multiple','obj')
    res = {};
    Object.keys(multiple.iplist).forEach(function _gatherMultiple(key) {
      buddy = 'http://'+multiple.iplist[key]+'/'
      var _url = buddy+appname+'/component/multiple.php?ip='+btoa(multiple.myip)
      temp = ajaxExternal('gatherMultiple', _url);
      setLog(multiple.iplist[key]);
      setLog(temp[multiple.iplist[key]]);
      refreshMultiple(multiple.iplist[key], temp[multiple.iplist[key]])
    })
    
    multiple = getVariable('multiple','obj')
    // setLog(multiple.iplist)
    return multiple
  }
}

// 自身のmultiplejsonを取得
function getMeMultiple() {
  multiple_status = readJson('multiple')
  setVariable('multiple_status', multiple_status, 'obj')
  return multiple_status
}

// NGLIST生成・自動復帰適用外拠点判定
function getMultipleJudgement(multiple) {
  // console.log(multiple)
  multiple_status = getMeMultiple()
  destination_list = getVariable('destination_list','obj')
  multiple_judgement = {'nglist':[], 'noMARecovery':false, 'count':0}

  Object.keys(multiple_status).forEach(function(key) {
    if (isInArray(key, multiple.iplist)){
      // IPリストに登録の誰かが占有していたら
      if (!isObject(multiple_status[key])) {
        multiple_status[key] = JSON.parse(multiple_status[key])
      }
      if (multiple_status[key] != null) {
        // →自動復帰適用外or自動復帰適用外にいる場合は自動復帰移動させない
        if (isInArray(multiple_status[key].work.to, multiple.exceptionlist) || isInArray(multiple_status[key].current_location, multiple.exceptionlist)) {
          multiple_judgement.noMARecovery = true;
        }
        if (multiple_status[key] != null) {
          multiple_judgement.nglist.push(multiple_status[key].work.to)
          multiple_judgement.nglist.push(multiple_status[key].current_location)
        }
        multiple_judgement.count++;
      }
    }
  });
  setLog(multiple_judgement)
  return multiple_judgement
}

function autoMove(target) {
  work = def_work
  work.from = getVariable('current_location')
  work.to = target
  work.ready = false
  setWorkALL(work)
  pushWorkList(target)
  setVariable('checkingAvoidance', false)
  $('.wrapper').append('<div class="action_button" onclick="cancelAutoMove()">自動移動キャンセル</div>')

  setTimeout(_autoMove, timer.remote)
}

function _autoMove() {
  $('.action_button').addClass('hid')
  move()
}

function cancelAutoMove() {
  reserveUnderMessage('一時的に複数台稼働自動復帰がキャンセルされています')
  transScreen('select')
}

// 移動中の目的地把握回避
// function checkMovingAvoidance() {
//   if (isTrue(getVariable('multiple_flg'))) {
//     multiple_status = readJson('multiple')
//     setVariable('multiple_status',multiple_status,'obj')
//     nglist = [];
//     Object.keys(multiple_status).forEach(function(key) {
//       if ($.inArray(key, multiple.iplist) != -1){
//         // IPリストに登録の誰かが占有していたら
//         nglist.push(multiple_status[key].work.to)
//         nglist.push(multiple_status[key].current_location)
//       }
//     });
//     work = getVariable('eork','obj') 
//     if ($.inArray(wotk.to, nglist) > -1) {
//       multiple = getVariable('multiple','obj')
//       multiple.avoidance =wotk.to
//       setVariable('multiple',multiple,'obj')
//       req_stop_move()
//     }
//   }
// }

// 全ページ共通初期化処理
