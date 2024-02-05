///////////////////////////////////////////////////////////////
//ドライバ関数
///////////////////////////////////////////////////////////////
//API送信処理を共通化
function sendAPI(data) {
  setVariable('api', data.type)
  setLog(data, 'api');
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
//JSON取得
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
  // console.log('basename:'+basename)
  // if (basename != string || string == 'index' || string == 'select') {
    setLog(string)
    window.location.href = webroot+appname+'/'+ string +'.php'+param;
  // } 
}
//変数全消去
function resetVariable() {
  sessionStorage.clear();
}
//その他変数初期化
function resetTemp() {
  setVariable('move_from', '')
  setVariable('move_to', '')
  setVariable('current_location', '')
  setVariable('api', '')
  setVariable('onmoverest', 0)
  setVariable('onmove', 0)
  setVariable('error', 0)

  setVariable('senario_i', 0)
  setVariable('sequence_i', 0)
  setVariable('turnaround_i', 0)

  setVariable('forcemove', 0)
}

function clearMoveStatus() {
  setVariable('senario_i', 0)
  setVariable('sequence_i', 0)
  setVariable('turnaround_i', 0)
}
//変数読込
function getVariable(key) {
  return sessionStorage.getItem(key);
}
//変数書込
function setVariable(key, value) {
  sessionStorage.setItem(key, value);
  writeRemoteJson()
}
//変数保存
function writeVariable(current_map) {
  setLog('設定保存開始');
  // 全設定データをsessionstorageから取ってくる。
  // variable.jsonにある項目のみを保存する。
  var variables = new Object()

  default_setting = readJson('variable')
  console.trace()
  setLog(default_setting)
  default_setting.current_map = getVariable('current_map')
  
  Object.keys(default_setting.settings.default).forEach(function(key) {
    if (key == 'undefined') {
      variables[key] = default_setting.settings.default[key]
    } else {
      temp = getVariable(key)
      variables[key] = temp
    }
    // console.log(key)
    // console.log(variables[key])
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
//変数復元
function scanVariable(current_map) {
  // console.trace()
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
      res = data.settings['default']
    } else {
      // 既存MAPのsettingがある場合
      res = data.settings[current_map]
    }

    Object.keys(res).forEach(function(key) {
      // console.log(key)
      var val = this[key];
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
//変数初期化
function wipeVariable() {
  loadBall()
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxwipe.php?file='+btoa(variablefilename),
    data: '',
    dataType : "json"
  }).done(function _wipeVariable(){
    setLog('設定削除')
    transScreen('index')
  });
  setLog('設定削除')
  transScreen('index')
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

let music
//移動時音楽再生
function playMusic() {
  var musiclist = readJson('music');
  current_music = getVariable('music');
  setVariable('TempMusic', musiclist[current_music].audio);
  music = new Audio(musiclist[current_music].audio);
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
//到着時画面設定を実行
function playMessage(res) {
  if (!res) {
    res.name = "設定なし";
    res.audio = webroot+appname+'/asset/complete/message/normal.mp3'
  };
  var music = new Audio(res.audio);
    music.play();
  $('#comp_img').append('<img src="'+ res.pict+'">');
  setVariable('mestime', res.time)
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

//下部メッセージを表示
function setUnderMessage(string) {
  $('.under_message').empty();
  $('.under_message').append(string);
}
//メインメッセージを表示
function setMainMessage(string) {
  $('.main_message').empty()
  $('.main_message').append(string)
}
//エラーメッセージを表示
function setMainError(string) {
  $('.error').empty()
  $('.error').append(string)
}
//メインコンテンツを挿入
function setMain(string) {
  $('.main').empty();
  $('.main').append(string);
}
//メインコンテンツを追加
function pushMain(string) {
  $('.main').append(string);
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
//ログを書く
function setLog(obj, level='info') {
  caller = setLog.caller.name
  var log = {}
  // level :: info, warning, error, 
  log[caller] = obj
  switch(level) {
    case 'info':
      console.log(log);
      break;
    case 'api':
      console.debug(log);
      break;
    default:
      console.debug(log);
      break;
  }
  
}
// ウェイトボール
function loadBall(mode = 0) {
  $('.loading').removeClass('hid')
  $('#loadingwall').removeClass('hid')
  $("#loadingwall").fadeIn("slow");
  if (mode == 0) {
    setTimeout(function(){
      setLog('No Reply ERROR');
      transScreen('index')
    }, 15000)
  }
}
// ウェイトボール
function stopBall() {
  $('.loading').addClass('hid')
  $("#loadingwall").fadeOut("slow",function(){
    $('#loadingwall').addClass('hid')
  });
}
// バッテリ残量チェック
function checkBattery() {
  obj = {battery_level:'', battery_status:''}
  obj.battery_status = getVariable('battery_status')
  obj.battery_level = getVariable('battery_level')
  setLog(obj)
  if (obj.battery_level )
  if (obj.battery_status) {
    if (obj.battery_status == "2") {
      transScreen('error', '?error=battery_charging')
    }
  }
  if (obj.battery_level) {
    if (parseInt(obj.battery_level) == 0) {

    } else if (parseInt(obj.battery_level) < 10) {
      transScreen('error', '?error=charge_battery')
    } else if (parseInt(obj.battery_level) < 20) {
      setUnderMessage('電池残量'+obj.battery_level+'%です。<br>充電してください')
    }
  }
}

// remote用状態読取
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

// remote用状態書込
function writeRemoteJson() {
  let remote = {}
  for (let i = 0; i < sessionStorage.length; i++) {
    remote[sessionStorage.key(i)] = sessionStorage.getItem(sessionStorage.key(i))
  }
  // console.log('remote:')
  // console.log(remote)
  // console.log(payload)
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/writeRemote.php',
    data: remote,
    dataType: 'json'
  }).done(function _writeRemoteJson(data){
    // setLog('Remote設定保存完了');
    // setLog(data);
  });
}

function wipeRemoteJson() {
  // loadBall()
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/wipeRemote.php',
    data: '',
    dataType : "json"
  }).done(function _wipeRemoteJson(){
    // setLog('設定削除')
    // transScreen('index')
  });
  // setLog('設定削除')
  // transScreen('index')
} 

// remote用状態読取
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

// remote用状態書込
function writeMoveJson(destination, force='normal') {
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/writeMove.php',
    data: {'destination': destination, 'force': force},
    dataType: 'json'
  }).done(function _writeRemoteJson(data){
    // setLog('Remote設定保存完了');
    // setLog(data);
  });
}

function wipeMoveJson() {
  // loadBall()
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/wipeMove.php',
    data: '',
    dataType : "json"
  }).done(function _wipeMoveJson(){
    // setLog('設定削除')
    // transScreen('index')
  });
  // setLog('設定削除')
  // transScreen('index')
  writeMoveJson("")
} 

// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}