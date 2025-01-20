<?php 
  $basename = basename(__FILE__, ".php");
  include('component/error.php');
  $em = new EM();
  // var_dump($em->em);

  $message = (isset($em->em[$_GET['error']]))?$em->em[$_GET['error']]: 'エラーが発生しました('.$_GET['error'].')<br>ロボットを移動して再設置してください';
  // var_dump($message);

  $content['main'] = '';
  $content['main_message'] =  'エラーが発生しました';
  $content['error_message'] =  $message;
  $content['chargerelseasebutton'] =  '';
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  var error = "<?=$_GET['error'];?>";
  // $('.wrapper').addClass('error')
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
        setTimeout(function(){move(moveto)}, 5000)
      } else {
        setVariable('onmoverest', 0)
        setLog('move failed due to RTINO END')
        transScreen('select')
      }
    } else if (error == "info_motor_collision_detection" || error =="info_motor_collision_detection?data=undefined") {
      // stopnow()
    } else if (error == "nomap") {
      setTimeout(function(){transScreen('index')}, 10000)
    } else if (error == "battery_charging") {
      // console.log('a')
      $('.chargerelseasebutton').append('<div class="button_go" onclick="chargeComplete()">充電ケーブルを抜いたことを確認し、こちらをタップ</div>')
      setMainMessage('充電中です')
      $('.wrapper').removeClass('error')
      $('.wrapper').addClass('charging')
    } else if (error == "info_motor_cmdexecution_error" || error =="info_motor_cmdexecution_error?data=undefined") {
      // 20240806 中村歯科対応 ブレーキ解除ボタン押下時には30秒待って充電場所に戻る
      default_destination = '充電場所'
      setTimeout(function(){move(default_destination)}, 30000)
      setUnderMessage('30秒経過すると充電場所に自動で戻ります')
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
    current_location = getVariable('current_location')
    // if (current_location != "充電場所") {
    destination_list = JSON.parse(getVariable('destination_list'))
    console.debug(destination_list)
    let me = 0;
    Object.keys(destination_list).forEach(function(key) {
      if(destination_list[key] == "充電場所") {
        me = 1;
      }
    });
    if (me > 0) {
      console.log('充電場所に再設置')
      relocate('充電場所')
    }
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