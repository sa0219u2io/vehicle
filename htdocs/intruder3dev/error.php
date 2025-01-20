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
  resetStatus()
  setStatus('error', error)
  get_current_location()
  errorhandle()

  function errorhandle() {
    setLog('error='+error)
    if (error == "charging") {
      // 充電中なら
      $('.wrapper').append('<div class="chargerelease" onclick="chargeComplete()">ご使用の際は<br>充電ケーブルを抜いたことを確認し<br>こちらをタップ</div>')
      setMainMessage('充電中です')
      $('.wrapper').removeClass('error')
      $('.wrapper').addClass('charging')
      nomenu ()
      return
    }
    if (error == "move_failed" || error == "move_failed?data=undefined" || error == "info_move_error?data=undefined") {
      // 再送処理
      work = getWork()
      if (work.reset < 3) {
        work.reset++
        setWork('reset',work.reset)
        setLog('move failed due to RTINO')
        var moveto = getVariable('move_to')
        setTimeout(function(){move(moveto)}, 5000)
      } else {
        setWork('reset',0)
        setLog('move failed due to RTINO END')
        transScreen('select')
      }
    } else if (error == "info_motor_collision_detection" || error =="info_motor_collision_detection?data=undefined") {
    } else if (error == "nomap") {
      setTimeout(function(){transScreen('index')}, timer.system)
    }
  }
  
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
  //ループスクリプト
  function countup_temmplate() {
    // 充電ワーニングの画面なら
    if (error != "charging") {
      battery = getVariable('battery','obj')
      if (battery.status == "2") {
          transScreen('error', '?error=charging')
      }
      get_system_data();
    }
  }
  // TODO;
  setInterval(countup_temmplate, timer.complete);

  // 充電完了確認ボタン
  function chargeComplete () {
    setLog('充電完了')
    // 現在地チェック
    setVariable('lowbattery_count', 0)
    current_location = getVariable('current_location')
    charge_spot = getVariable('charge_spot')
    if(current_location != charge_spot) {
      setLog(charge_spot+'に再設置')
      relocate(charge_spot)
    }
    loadBall()
    get_system_data()
    setTimeout(function _chrageComplete(){transScreen('select')}, timer.complete)
  }
</script>