<?php 
  $basename = basename(__FILE__, ".php");
  
  $type = $_GET['type'];
  $content['main_message'] = '';

  if ($type =="qrCameraSend") {
    $title='自動帰宅QRカメラコマンド送信';
    $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="transScreen(\'\debug\')"><img src="asset/image/pictgram/stopmove_2.png"></div><div class="boxlist" id="selectlist"></div>';
  } elseif ($type =="qrCamera") {
    $title='自動帰宅QRカメラ起動';
    $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="transScreen(\'\debug\')"><img src="asset/image/pictgram/stopmove_2.png"></div><div class="boxlist" id="selectlist"></div>';
  } elseif ($type =="variables") {
    $title='各種設定値';
    $content['main'] = '<div class="onmoveicon" id="modal-stopnow-open" onclick="transScreen(\'\debug\')"><img src="asset/image/pictgram/stopmove_2.png"></div><div class="boxlist" id="selectlist"></div>';
  } else {
    $main = '<div class="boxlist" id="selectlist">';
    $buttuon = ['qrCamera' => 'QR Camera', 'qrCameraSend' => 'QR Camera 送信', 'variables' => '各種設定値'];
    foreach ($buttuon as $key => $value) {
      $string = '<div class="selectbox" onclick="transScreen(\'debug\', \'?type='.$key.'\')">'.$value.'</div>';
      $main = $main.$string;
    }
    $main = $main.'<div class="selectbox" onclick="transScreen(\'error\', \'?error=battery_charging\')">充電画面</div>';
    $main = $main.'</div>';

    $content['main'] = $main;
    $title='デバッグメニュー';
  }
  include('component/template.php');
?>
<script>
  setMainMessage('<?=$title?>')
</script>
<?php if ($type =="qrCameraSend"):?>
  <script>
    camera = [100,101];
    Object.keys(camera).forEach(function(key) {
    console.log(key);
      $('#selectlist').append('<div class="selectbox" onclick="sendCamera('+camera[key]+')" data="'+key+'">'+camera[key]+'</div>')
    });
    function sendCamera(id) {
      console.log('sendCamera:'+id)
      sendCameraEndpoint = "http://192.168.100."+id

      jsontext = '{"type":"set_camera","data":{"endpoint":"http://192.168.100.1/<?=APP?>/component/autoreturn.php?camera='+id+'","cycle_millisecond":1000}}'
      // jsontext = JSON.stringify(json)
      // console.log(json)
      $.ajax({
        type: "POST",
        url: sendCameraEndpoint,
        timeout: 3000,
        data: jsontext,
        dataType: 'json'
      }).done(function(data){
        // setLog('Remote設定保存完了');
        setLog(data);
      });
    }
  </script>
<?php elseif ($type =="variables"):?>
  <script>
    viewVariable(getVariable('current_map'))
    function viewVariable(current_map) {
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
        if (key == 'auto_return_camera') {
          $('#selectlist').append('<p onclick="setAutoReturnCamera()">'+key+'('+variables[key]+')</p>')
        } else {
          $('#selectlist').append('<p>'+key+'('+variables[key]+')</p>')
        }
      });
    }
  </script>
<?php elseif ($type =="qrCamera"):?>
  <script>
    setUnderMessage('カメラがQRコードを認識していないと、色が黒反転します')
    data = readAutoReturnJson()
    console.debug(data)
    // $('#selectList').empty();

    Object.keys(data.camera).forEach(function(key) {
      console.log(key);
      if (data.camera[key] == true || data.camera[key] == 'true') {
        // console.log(data.camera[key]);
        $('#selectlist').append('<div class="selectbox" data="'+key+'">'+key+'</div>')
      } else {
        // console.log(data.camera[key]);
        $('#selectlist').append('<div class="selectbox selected" data="'+key+'">'+key+'</div>')
      }
    });
    //ループスクリプト
    function debug_countup() {
      data = readAutoReturnJson()
      console.debug(data)
      Object.keys(data.camera).forEach(function(key) {
        if (data.camera[key] == true || data.camera[key] == 'true') {
          $('[data="'+key+'"]').removeClass('selected')
        } else {
          $('[data="'+key+'"]').addClass('selected')
        }
      });
    }
    setInterval(debug_countup, remotetimer);
  </script>
<?php endif;?>

<!-- <div class="selectbox">Camera 1</div><div class="selectbox">Camera 2</div></div> -->