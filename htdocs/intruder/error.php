<?php 
  $basename = basename(__FILE__, ".php");
  $error_message['charge_battery'] = '充電残量が10%以下です。<br>ただちに充電してください';
  $error_message['battery_charging'] = '充電中ケーブルが接続されました。<br>ご使用になるには、<br>充電コードを抜いたことをご確認ください';
  $error_message['nomap'] = 'アプリを再起動してください。';
  $error_message['move_failed'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['move_failed?data=undefined'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['info_move_error?data=undefined'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['info_motor_cmdexecution_error'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['info_motor_cmdexecution_error?data=undefined'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['info_stop_move_error'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';
  $error_message['info_stop_move_error?data=undefined'] = '目的地への到達へ失敗しました。ロボットを移動して再設置してください';

  $message = (isset($error_message[$_GET['error']]))?$error_message[$_GET['error']]: 'エラーが発生しました('.$_GET['error'].')<br>ロボットを移動して再設置してください';

  $content['main'] = '<div class="chargerelseasebutton"></div>';
  $content['main_message'] =  'エラーが発生しました';
  $content['error_message'] =  $message;
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  var error = "<?=$_GET['error'];?>";
  $('.wrapper').addClass('error')
  setVariable('onmove', 0)
  setVariable('error', error)
  get_current_location()

  function errorhandle() {
    // var error = "<?=$_GET['error'];?>";
    setLog('error='+error)
    if (error == "move_failed" || error == "move_failed?data=undefined" || error == "info_move_error?data=undefined") {
      // 再送処理
      var onmoverest = getVariable('onmoverest')
      if (onmoverest < 3) {
        onmoverest++
        setVariable('onmoverest', onmoverest)
        setLog('move failed due to RTINO')
        var moveto = getVariable('move_to')
        move(moveto)
      }
    } else if (error == "battery_charging") {
      // console.log('a')
      $('.chargerelseasebutton').append('<div class="button_go" onclick="chargeComplete()">充電ケーブルを抜いたことを確認し、こちらをタップ</div>')
      setMainMessage('充電中です')
      $('.wrapper').removeClass('error')
      $('.wrapper').addClass('charging')
    }
  }
  errorhandle()

  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
  //ループスクリプト
  function countup_temmplate() {
    if (error == "battery_charging") {
      // beforehandler();
      // obj = {battery_level:'', battery_status:''}
      // obj.battery_status = getVariable('battery_status')
      // obj.battery_level = getVariable('battery_level')
      // console.log(obj)
      // if (obj.battery_status) {
      //   if (obj.battery_status == "0" || obj.battery_status == "1") {
      //     transScreen('select')
      //   }
      // }
      // get_system_data();
    } else if (error == "charge_battery") {
      obj = {battery_level:'', battery_status:''}
      obj.battery_status = getVariable('battery_status')
      obj.battery_level = getVariable('battery_level')
      if (obj.battery_status) {
        if (obj.battery_status == "2") {
          transScreen('error', '?error=battery_charging')
        }
      }
      get_system_data();
    }
  }
  // TODO;
  setInterval(countup_temmplate, completetimer);

  function chargeComplete () {
    setLog('chargeComplete')
    // current_location = getVariable('current_location')
    // if (current_location != "充電場所") {
      // destination_list = getVariable('destination_list')
      // console.debug(destination_list)
      // console.log($.inArray("充電場所", destination_list))
      // if ($.inArray("充電場所", destination_list) >= 0) {
        // console.log('充電場所に再設置')
        relocate('充電場所')
      // }
    // }
    setVariable('battery_status', 0)
    transScreen('select')
  }

  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    if (res.data.destination_name == undefined) {
      setVariable('current_location', res.data.destination_name)
    }
  }
</script>