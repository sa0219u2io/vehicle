function readDebug(data) {
  var url = 'debug/' + data.type + '.json'
  var response

  $.getJSON(url, (data) => {
    //console.log('DEBUG:'+data.type);
    switch (data.type) {
      //new API対応済み20201109
      case("get_current_location"):
        callback_GCL(data);
      break
      //new API対応済み20201109
      case("req_route_trace"):
        callback_RM(data);
      break
      //new API対応済み20201109
      case("get_destination_list"):
        callback_GDL(data);
      break
      //new API対応済み20201109
      case("get_map_data"):
        callback_MGD(data);
      break
      //new API対応済み20201109
      case("req_move"):
        callback_RM(data);
      break
      case("req_relocate"):
        callback_RRL(data);
      break
      //new API対応済み20201109
      case("info_obstacle_detection"):
        callback_OD(data);
      break
      //new API対応済み20201109
      case("info_arrival"):
        callback_IA(data);
      break
      //new API対応済み20201109
      case("get_move_status"):
        callback_GMS(data);
      break
      //センサデータ情報取得指示
      case ('get_sensor_data') :
        callback_GSD(data)
        break
      //地図切替指示
      case("res_change_map"):
        callback_RCM(data);
      break
      //汎用USBコマンド送信
      case ("req_usb_command") :
        callback_RUC(data)
        break
      //汎用USBコマンド受信
      case ("res_read_usb_cache") :
        callback_RRUC(data)
        break
      default:
      break
    }
  })
}
