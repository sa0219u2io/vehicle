/////////////////////////////////////////////////////////////////////////////////////////
//ドライバ関数
/////////////////////////////////////////////////////////////////////////////////////////
//API送信処理を共通化
function sendAPI(data) {
  setVariable('api', data.type)
  //本番環境なら
  if (debug == 0) {
    setLog(0, 'sendAPI('+data.type+'):');
    systemUI.sendData(data)
    responce = systemUI.receivedData(getResponseObserver)
  //デバッグ環境なら
  } else {
    setLog(1, data);
    readDebug(data);
  }
}

//クエリを取得
function getParam(type) {
  var queryString = window.location.search;
  var queryObject = new Object();
  if(queryString){
    queryString = queryString.substring(1);
    var parameters = queryString.split('&');

    for (var i = 0; i < parameters.length; i++) {
      var element = parameters[i].split('=');
      var paramName = decodeURIComponent(element[0]);
      var paramValue = decodeURIComponent(element[1]);
      queryObject[paramName] = paramValue;
    }
    var res = parseInt(queryObject[type])
    console.log("パラメータ取得(" + type + "):" + res)
    return(res);
  }
}

//JSON取得
function readJson(type, number) {
  if (type == "music") {
    var url=webroot+appname+'/asset/json/music.json';
  } else {
    var url=webroot+appname+'/asset/json/announce.json';
  }
  $.getJSON(url, (data) => {
    if (number === "99") {
      var arr = [];
      if (type == "music") {
        for (i=0; i<data.length; i++) {
          arr[i] = data[i].name;
        }
        viewMusicCallback(arr);
      } else {
        array = data[type]
        console.log(array)
        for (i=0; i < array.length; i++) {
          arr[i] = array[i].name;
        }
        viewAnnounce(type, arr)
      }
    } else {
      if (type == "music") {
        setOnmoveAudioCallback(data[number]);
      } else {
        playAnnounceCallback(data[type][number]);
      }
    }
  });
}

//画面遷移関数
function transScreen(string) {
  setLog(0, string)
  window.location.href = webroot+appname+'/'+ string +'.php';
}

//変数全消去
function resetVariable() {
  sessionStorage.clear();
}

//変数復元
function scanVariable() {
  var response = new Object();
  $.ajax({
    type: "POST",
    url: webroot+appname+'/component/ajaxscan.php?file='+btoa(variablefilename),
    data: response,
    dataType : "json"
  }).done(function(data){
    setLog(0,'設定読込');
    setLog(1, data);
    Object.keys(data).forEach(function(key) {
      var val = this[key];
      if (typeof val == 'object') {val = JSON.stringify(val)}
      setVariable(key, val);
    }, data);
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
function writeVariable() {
  //全設定データをlocalstorageから取ってくる。
  var response = new Object();
  var url=webroot+appname+'/asset/json/variable.json'
  setLog(0,'設定保存開始');
  $.getJSON(url, (data) => {
    console.log(data)
    Object.keys(data).forEach(function(key) {
      if (key == 'wait'|| key == 'announce') {
        console.log(key)
        array_var =  data[key]
        array_temp = JSON.parse(getVariable(key))
        console.log(array_var)
        console.log(array_temp)
        Object.keys(array_var).forEach(function(sub) {
          if (array_temp[sub]>0) {
            array_var[sub] = array_temp[sub];
          } else {
            array_temp[sub] = array_var[sub];
          }
        });
        response[key] = JSON.stringify(array_var);
        setVariable(key, response[key])
        console.log(response[key])
      } else {
        if (getVariable(key) == 'undefined') {
          response[key] = data[key];
          setVariable(key, response[key])
          console.log(key)
          console.log(response[key])
        } else {
          response[key] = getVariable(key);
          console.log(key)
          console.log(response[key])
        }
        //console.log(response[key])
      }
    }, data);
    $.ajax({
      type: "POST",
      url: webroot+appname+'/component/ajaxwrite.php?file='+btoa(variablefilename),
      data: response,
      dataType : "json"
    }).done(function(data){
      setLog(0,'設定保存');
      setLog(1,data);
    });
  })
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

//移動時音楽設定
function setOnmoveAudio() {
  readJson('music', getVariable('music'));
}
let music
//移動時音楽再生
function setOnmoveAudioCallback(data) {
  setLog(0,data.audio);
  setVariable('TempMusic', data.audio);
  music = new Audio(data.audio);
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
  //console.log(music);
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

//アナウンス設定
function playAnnounce(type) {
  var announce = JSON.parse(getVariable('announce'))
  var num = announce[type];
  readJson(type, num);
}

//アナウンス再生
function playAnnounceCallback(data) {
  if (data.audio != "") {
    url = webroot+appname+'/asset/announce/'+data.audio
    setLog(0,url);
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
function setLog(type, obj) {
  //type 0: コンソールログ, 1: コンソールデバッグ, 2:コンソールトレース
  var objtype =0;
  if (typeof obj == 'object') objtype = 1;
  name = setLog.caller.name
  switch(type) {
    case 0:
      if (objtype == 0) {
        console.log(name, ':', obj)
      } else {
        console.log(name, ':',JSON.stringify(obj));
      }
      break;
    case 1:
      console.debug(name, ':', obj)
      break;
    case 2:
      console.trace()
      break;
  }
}

function loadBall() {
  setLog(0,'ローディング')
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
