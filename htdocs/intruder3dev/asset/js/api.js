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
  operatedFlg(true)
  setVariable('checkingAvoidance', true)
}
// 移動指示
function req_move(destination) {
  velocity = getVariable('velocity')
  tolerance = getVariable('tolerance','obj')
  // console.log(tolerance)
  if (!tolerance.hasOwnProperty('destination_settings')) {
    initTorelanceList()
    tolerance = getVariable('tolerance','obj')
  }
  console.log(tolerance.destination_settings)
  // console.log()
  console.log(temp)
  temp = tolerance.destination_settings[destination];
  if (temp != null) {
    tolerancenum = parseInt(temp)/1000
  } else {
    tolerancenum = parseInt(tolerance.default)/1000
  }
  console.log(tolerancenum)

  data = {
    "type":"req_move",
    "data": {
      "destination_name":destination,
      "speed_rate": velocity,
      "xy_goal_tolerance" : tolerancenum
    }
  }
  sendAPI(data)
}
// 移動停止指示
function req_stop_move() {
  reserveUnderMessage('一時停止しました<br>黄色の表示が向かっていた目的地です')
  setStatus('interval',true)
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