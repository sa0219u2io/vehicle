///////////////////////////////////////////////////////////////
//API呼出し関数
///////////////////////////////////////////////////////////////
// 取得・設定
// マップ一覧取得
function get_map_list() {
  data = {
    "type":"get_map_list"
  }
  sendAPI(data)
}
// マップ情報取得
function get_current_map() {
  data = {
    "type":"get_current_map"
  }
  sendAPI(data)
}
// 現在地取得
function get_current_location() {
  data = {
    "type":"get_current_location"
  }
  sendAPI(data)
}
// センサ計測結果
function get_sensor_data() {
  data = {
    "type":"get_sensor_data"
  }
  sendAPI(data)
}
// メッセージサーバ設定
function set_message_destination() {
  data = {
    "type":"set_message_destination"
  }
  sendAPI(data)
}

// 指示
// マップ切り替え指示
function req_change_map(map) {
  data = {
    "type":"req_change_map",
    "data": {
      "map_name":map
    }
  }
  sendAPI(data)
}
// 現在地指定指示
function req_set_location(destination) {
  data = {
    "type":"req_set_location",
    "data": {
      "destination_name":destination
    }
  }
  sendAPI(data)
}
// 移動指示
function req_move(destination) {
  velocity = getVariable('velocity')
  data = {
    "type":"req_move",
    "data": {
      "destination_name":destination,
      "speed_rate": velocity,
    }
  }
  sendAPI(data)
}
// 移動停止指示
function req_stop_move() {
  data = {
    "type":"req_stop_move"
  }
  sendAPI(data)
}
// USB機器電文送信指示
function req_usb_command(type, param) {
  data = {
    "type":"req_usb_command"
  }
  sendAPI(data)
}
// 汎用USBデータ取得指示
function req_read_usb_cache() {
  data = {
    "type":"req_read_usb_cache"
  }
  sendAPI(data)
}

// システムデータ取得
function get_system_data() {
  data = {	
    "type":"get_system_data"
  }	  
  sendAPI(data)
}





///////////////////////////////////////////////////////////////
//ドライバ関数
///////////////////////////////////////////////////////////////
//API送信処理を共通化
function sendAPI(data) {
  setVariable('api', data.type)
  setLog(data);
  //本番環境なら
  if (debug == 0) {
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
  setLog(string)
  window.location.href = webroot+appname+'/'+ string +'.php'+param;
}

//変数全消去
function resetVariable() {
  sessionStorage.clear();
}

//その他変数初期化
function resetTemp() {
  setVariable('move_from', 0)
  setVariable('move_to', 0)
  setVariable('current_destination', "")
  setVariable('turnaround', 0)
  setVariable('turnaround_count', 0)
  setVariable('api', "")
  setVariable('sequencearray', "")
  setVariable('roundarray', "")
  setVariable('sequencei', 1)
  setVariable('roundi', 1)
  setVariable('onrelocate', 0)
}

//変数復元
function scanVariable(current_map) {
  var response = new Object();
  setLog(current_map)
  var res = 'fail_to_scan'
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxscan.php?file='+btoa(variablefilename),
    data: response,
    dataType : "json"
  }).done(function(data){
    // 既存MAPのsettingを取得
    if ($.inArray(current_map, data.setting) < 0) {
      // 既存MAPのsettingがない場合
      res = data.settings['default']
      res.current_map = current_map
    } else {
      // 既存MAPのsettingがある場合
      res = data.settings[current_map]
      res.current_map = current_map
    }

    Object.keys(res).forEach(function(key) {
      var val = this[key];
      if (typeof val == 'object') {val = JSON.stringify(val)}
      setVariable(key, val);
    }, res);

  });
  

}

//変数読込
function getVariable(key) {
  return sessionStorage.getItem(key);
}

//変数書込
function setVariable(key, value) {
  sessionStorage.setItem(key, value);
}

//変数保存
function writeVariable(current_map) {
  //全設定データをsessionstorageから取ってくる。
  setLog('設定保存開始');
  return

  var variables = new Object()
  var url=asset+'json/variable.json'
  // setLog(url);
  $.getJSON(url, (data) => {
  })
  .done(function(data){
    setLog(data)
    variables['current_map'] = current_map
    variables[current_map] = new Object();
    var response = new Object();
    Object.keys(data.settings.default).forEach(function(key) {
      setLog(key)
      if (key == 'wait'|| key == 'announce') {
        array_var =  data.settings.default[key]
        array_temp = JSON.parse(getVariable(key))
        Object.keys(array_var).forEach(function(sub) {
          if (array_temp[sub]>0) {
            array_var[sub] = array_temp[sub];
          } else {
            array_temp[sub] = array_var[sub];
          }
        });
        response[key] = array_var;
        setVariable(key, JSON.stringify(array_var))
      } else {
        if (getVariable(key) == 'undefined') {
          response[key] = data.settings.default[key];
          setVariable(key, response[key])
        } else {
          response[key] = getVariable(key);
        }
      }
    }, data);
    variables[current_map] = response
    string = JSON.stringify(variables);
    setLog(string)
    $.ajax({
      type: "POST",
      url: webroot+appname+'/component/ajaxwrite.php?file='+btoa(variablefilename),
      data: variables,
      dataType: 'json'
    }).done(function(data){
      setLog('設定保存');
      setLog(variables);
    });
  });
}

//変数初期化
function wipeVariable() {
  loadBall()
  var response = new Object();
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxwipe.php?file='+btoa(variablefilename),
    data: '',
    dataType : "json"
  }).done(function(data){
    setLog(0,'設定削除')
    transScreen('index')
  });
  transScreen('index')
}

let music
//移動時音楽再生
function playOnmoveAudio() {
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
function stopOnmoveAudio() {
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

//下部メッセージを表示
function setUnderMessage(string) {
  $('.undermessage').empty();
  $('.undermessage').append(string);
}

//メインメッセージを表示
function setMainMessage(string) {
  $('.mainmessage').empty()
  $('.mainmessage').append(string)
}

//メインメッセージを表示
function setMainError(string) {
  $('.error').empty()
  $('.error').append(string)
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
  writeVariable()
  playAnnounce(type)
  closeModal()
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

//メインコンテンツを挿入
function setMain(string) {
  $('.main').empty();
  $('.main').append(string);
}

//メインコンテンツを追加
function pushMain(string) {
  $('.main').append(string);
}

//地図リストを表示
function setMaps() {
  maps = JSON.parse(getVariable('map_list'))
  current_map_id = getVariable('current_map_id')
  Object.keys(maps).forEach(function (key) {
    if (key == current_map_id) {
      $('#selectcontaier').append('<div class="select float" onclick="changeMap('+ key+')">'+ maps[key] +'</div>')
    } else {
      $('#selectcontaier').append('<div class="select float" onclick="changeMap('+ key+')">'+ maps[key] +'</div>')
    }

  });
}

//ログを書く
function setLog(obj) {
  caller = setLog.caller.name
  objtype = typeof(obj)
  var log = {}
  log[caller] = obj
  console.log(log);
}

function loadBall() {
  $('.loading').removeClass('hid')
}

function getWait(string) {
  var waits = JSON.parse(getVariable('wait'))
  return waits[string]
}

function setWait(string, num) {
  var waits = JSON.parse(getVariable('wait'))
  waits[string] = num
  setVariable('wait', JSON.stringify(waits))
}


//NTT様特別対応
function req_message_server () {
  url = "http://localhost/ntt/message_server.php"
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(data){
    console.log(data);
  });
}

function req_call_relocated () {
  url = "http://localhost/ntt/relocate_call.php"
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(data){
    console.log(data);
  });
}


function qbit_done () {
  url = "http://localhost/ntt/qbit_done.php"
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(data){
    console.log(data);
  });
}

function req_move_qbit (destination) {
  console.log('req_move_qbit:'+destination);
  url = "http://localhost/ntt/req_move_qbit.php"
  $.ajax({
    type: "POST",
    url: url,
    data: {'destination':destination},
    dataType: 'json'
  }).done(function(data){
    console.log(data);
  });
}