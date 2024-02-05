<?php
  define('APP', 'suehirotei');
  $url = 'asset/image/pictgram/';
  $icons = [
    '1' => [
      'select' => '目的地選択',
      'relocate' => '再設置',
      'map' => '地図選択',
      'music' => '音楽設定',
      'announce' => '発話設定',
      'trace' => 'トレース'
    ],
    '2' => [
      'velocity' => '速度設定',
      'single' => '通常走行',
      'turnaround' => '往復走行',
      'sequence' => '連続走行',
      'hub' => '拠点走行'
    ],
    '3' => [
      'face' => '顔画面',
      'reboot' => 'APP再起動',
      'collision' => '衝突防止ログ',
      'erase' => '工場出荷設定',
      'kiosk' => 'KIOSK',
      'usbdebug' => 'USB通信'
    ]
  ];
?>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css">
    <script>const appname = '<?=APP?>'</script>
    <script type="text/javascript" src="asset/js/jquery.js"></script>
    <script type="text/javascript" src="asset/js/driver.js"></script>
    <script type="text/javascript" src="asset/js/api.js"></script>
    <script type="text/javascript" src="asset/js/callback.js"></script>
    <script type="text/javascript" src="asset/js/frame.js"></script>
    <script type="text/javascript" src="asset/js/debug.js"></script>
    <script type="text/javascript" src="asset/js/main.js"></script>
  </head>
  <body>
    <div class="wrapper">
      <!-- 共通 -->
      <div id="frame">
        <!-- 共通のモーダル表示部分 -->
        <div class="left_nav">
          <div class="modalclose"><img src="<?=$url?>close.png"></div>
          <menu>
            <?php foreach ($icons as $key => $value):?>
              <div class="menurow <?=($key%2==0)?"child":"";?>">
                <?php foreach ($value as $subkey => $subvalue):?>
                  <div class="menuicon" id="modal-<?=$subkey?>-open"><img src="<?=$url?><?=$subkey?>.png"><p><?=$subvalue?></p></div>
                <?php endforeach;?>
              </div>
            <?php endforeach;?>
          </menu>
        </div>
        <?php include('component/modal.php')?>
        <div class="right_nav"></div>
      </div>
      <!-- 以下、コンテンツ -->
      <div class="mainmessage">

      </div>
      <div class="undermessage">
      </div>
      <div class="main">
        <button class="select float" onclick="req_usb_command(10,0,0)">起動</button>
        <button class="select float" onclick="req_usb_command(20,0,0)">終了</button>
        <button class="select float" onclick="req_usb_command(30,0,0)">再起動</button>
        <button class="select float" onclick="req_usb_command(1000,0,0)">ステータス要求</button>
        <button class="select float" onclick="req_usb_command(110,0,0)">アラートクリア</button>
        <button class="select float" onclick="req_usb_command(950,0,0)">バージョン</button>
        <button class="select float" onclick="req_read_usb_cache()">電文取得</button>
        <button class="select float"  onclick="req_usb_command(400,'99999',1)">全子機鳴動</button>
        <button class="select float"  onclick="req_usb_command(400,'99999',0)">全子機鳴動OFF</button>
        <button class="select float"  onclick="req_usb_command(400,'00001',1)">厨房機鳴動</button>
        <button class="select float"  onclick="req_usb_command(400,'00001',0)">厨房機鳴動OFF</button>
        <button class="select float"  onclick="req_usb_command(400,'00030',1)">受付機鳴動</button>
        <button class="select float"  onclick="req_usb_command(400,'00030',0)">受付機鳴動OFF</button>
        <br>
        <div id="logscroll">
          <textarea name="log" class="log" id="log" disabled></textarea>
          <!-- <script type="text/javascript">
            console.log = ((logTextAreaArgument) => {
              let logTextArea = logTextAreaArgument;
              return text => logTextArea.value+=text+'\n';
            })(document.getElementsByClassName('log')[0]);
          </script> -->
        </div>
        <button onclick="transScreen('usbdebug')">クリア</button>
      </div>

      <div class="loading hid">
        <span class="ball ball-1"></span>
        <span class="ball ball-2"></span>
        <span class="ball ball-3"></span>
        <span class="ball ball-4"></span>
        <span class="ball ball-5"></span>
        <span class="ball ball-6"></span>
        <span class="ball ball-7"></span>
        <span class="ball ball-8"></span>
      </div>
      <!-- 以上、コンテンツ -->
    </div>
    <!-- 起動時スクリプト -->
    <script>
      //req_usb_command(10,0,0)
    </script>
    <!-- タイマースクリプト -->
    <script>
    </script>
  </body>
</html>
