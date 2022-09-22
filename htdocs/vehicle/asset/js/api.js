/////////////////////////////////////////////////////////////////////////////////////////
//API呼出し関数
/////////////////////////////////////////////////////////////////////////////////////////
//現在地取得
function get_current_location() {
  data = {
    "type":"get_current_location"
  }
  sendAPI(data)
}

//目的地一覧取得
function get_destination_list() {
  data = {
    "type": "get_destination_list"
  }
  sendAPI(data)
}

//移動開始
function req_move(destid) {
  velocity = parseInt(getVariable("velocity"));
  another_route = parseInt(getVariable("another_route"));
  data = {
    "type": "req_move",
    "data": {
      "speech_text":"",
      "audio_dataid":"",
      "notice":"",
      "goal_destination_id":destid,
      "speed_rate": velocity,
      "another_route": another_route
    }
  }
  setVariable("move_from", getVariable("current_destination_id"))
  setVariable("move_to", destid)
  sendAPI(data)
}

//移動開始
function req_relocate(destid) {
  another_route = parseInt(getVariable("another_route"));
  var return_type = "1"  //新規経路指示
  data = {
    "type": "req_relocate",
    "data": {
      "return_type":return_type,
      "goal_markid":destid,
      "speech_text":"",
      "audio_dataid":"",
      "notice":"OFF",
      "angle":"",  //数値
      "another_route": another_route
     }
   }
  setVariable("onrelocate", 0)
  sendAPI(data)
}

//地図切替
function req_change_map(map_id) {
  data = {
  	"type":"req_change_map",
  	"data": {
  		"map_id": map_id
  	}
  }
　sendAPI(data);
}

//地図画像取得
function req_route_image() {
  data = {
  	"type":"req_route_image",
  	"data": {
  		"map_id":""
  	}
  }
  sendAPI(data);
}

//走行状態リセット
function req_move_status_reset() {
  data = {
    "type": "req_move_status_reset"
  }
  sendAPI(data);
}

//どのセンサが反応したか問い合わせる
function get_sensor_data() {
  data = {
  	"type":"get_sensor_data",
  }
　sendAPI(data);
}

//全トレース
function req_route_trace() {
  data = {
  	"type":"req_route_trace",
  }
　sendAPI(data);
  setVariable("ontrace", "1")
}

//区間トレース
function req_section_route_trace(start, goal) {
  data = {
    "type": "req_section_route_trace",
    "data": {
      "start_destination_id":start,
      "goal_destination_id":goal
     }
  }
　sendAPI(data);
  setVariable("ontrace", "1")
}

//一時停止
function req_stop_move(type) {
  data = {
  	"type":"req_stop_move",
  	"data":{
  		"stop_type": String(type)
  	}
  }
　sendAPI(data);
}

//汎用USB送信
function req_usb_command(pretype, param0, param1) {
  //コマンド内容を決定
  setLog(debug, "("+pretype + ", " + param0 + ", " + param1 + ")")
  var response
  var url=webroot+appname+'/asset/json/usbcommand/'+ pretype +'.json'
  var zigbee = JSON.parse(getVariable('zigbee'))
  //console.log(url)
  $.getJSON(url, (res) => {
    //console.log(res)

    //扉解放のパラメータ設定
    if (pretype == 300) {
      res[3].value = param0;
      res[4].value = param1;
    }
    //扉閉鎖のパラメータ設定
    if (pretype == 400) {
      param = zigbee
      //console.log(param[param0])
      res[3].value = param[param0][0];
      res[4].value = param[param0][1];
      res[5].value = param[param0][2];
      res[6].value = param[param0][3];
      res[7].value = param1;
    }
    data = {
      'type': 'req_usb_command',
      'data': res
    }
    setVariable("api", "req_usb_command");
    sendAPI(data)
  });
}

//汎用USB送信
function req_read_usb_cache() {
  data = {
    "type":"req_read_usb_cache",
    "data":{
	     "bytes":-1
    }
  }
  sendAPI(data)
}


function usbtest() {
  console.log('a')
}


///////////////////////////////////////////////////////////////////////////////////////
//API戻値取得関数
///////////////////////////////////////////////////////////////////////////////////////
function getResponseObserver(res) {
  //登録したobserverを解除にする
  systemUI.observerOff(getResponseObserver.name)
  var call = getVariable("api")

  //コールバック振分け処理
  switch (res.type) {
  //現在地情報取得指示
  case ("get_current_location") :
    callback_GCL(res)
    break
  //目的地情報取得指示
  case ("get_destination_list") :
    callback_GDL(res)
    break
    //トレースモード移動指示
  case ("req_route_trace") :
    transScreen("onmove");
    break
  //区間トレースモード移動指示
  case ("req_section_route_trace") :
    transScreen("onmove");
    break
  //目的地移動指示
  case ("req_move") :
    callback_RM(res)
    break
  //移動停止指示
  case ("req_stop_move") :
    break
  //経路復帰指示
  case ("req_relocate") :
    callback_RRL(res)
    break
  //MAP取得
  case ("req_route_image") :
    callback_MGD(res)
    break
  //走行状態取得
  case ("get_move_status") :
    callback_GMS(res)
    break
  //センサデータ情報取得指示
  case ("get_sensor_data") :
    callback_GSD(res)
    break
  //走行状態リセット指示
  case ("req_move_status_reset") :
    setLog(0, "走行状態リセット完了")
    break
  //汎用USBコマンド送信
  case ("req_usb_command") :
    callback_RUC(res)
    break
  //汎用USBコマンド受信
  case ("res_read_usb_cache") :
    callback_RRUC(res)
    break
  //汎用USBコマンド受信
  case ("res_change_map") :
    callback_RCM(data);
    break
  //デフォルト
  default :
  console.log(call + ' but ' + res.type)
    break
  }
}
