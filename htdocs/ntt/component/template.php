
<?php
  define('APP', 'ntt');
  $url = 'asset/image/pictgram/';
  $icons = [
    '1' => [
      'select' => '目的地選択',
      'relocate' => '再設置',
      'map' => '地図選択',
      'music' => '音楽設定',
      'announce' => '発話設定',
      // 'trace' => 'トレース'
    ],
    '2' => [
      'velocity' => '速度設定',
      'single' => '通常走行',
      // 'turnaround' => '往復走行',
      // 'sequence' => '連続走行',
      'hub' => '拠点走行'
    ],
    '3' => [
      'face' => '顔画面',
      'reboot' => 'APP再起動',
      // 'collision' => '衝突防止ログ',
      'erase' => '工場出荷設定',
      // 'kiosk' => 'KIOSK',
      // 'usbdebug' => 'USB通信'
      'qbittest' => 'QBITテスト',
      'selectlocalmove' => 'DBUG目的地'
    ]
  ];
  define('DNAME', [
    'wp010001' => '待機場所',
    'wp010002' => '洗い場１',
    'wp010003' => 'A地点',
    'wp010004' => 'B地点',
    'wp010005' => 'C地点１',
    'wp010006' => 'D地点',
    'wp010007' => 'Zone1の端点1',
    'wp010008' => 'Zone1の端点2',
    'wp010009' => 'Zone2の端点1',
    'wp010010' => 'Zone2の端点2',
    'wp010011' => 'Zone2の端点3',
    'wp010012' => 'スロープ上',
    'wp010013' => 'スロープ下',
    'wp010014' => 'むさし野中継地点',
    'wp010015' => 'デシャップ洋',
    'wp010016' => 'ブッフェ',
    'wp010017' => '洗い場２',
    'wp010018' => 'C地点２',
    'wp010019' => '充電場所'
  ]);
?>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css">
    <script>
      const appname = '<?=APP?>';
    </script>
    <script type="text/javascript" src="asset/js/jquery.js"></script>
    <script type="text/javascript" src="asset/js/api.js"></script>
    <script type="text/javascript" src="asset/js/frame.js"></script>
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
        <?php include('modal.php')?>
        <div class="right_nav"></div>
      </div>
      <!-- 以下、コンテンツ -->
      <div class="mainmessage">
        <?=$mainmessage?>
      </div>
      <div class="undermessage">
        <?=$undermessage?>
      </div>
      <div class="main">
        <?=$main?>
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
    <script>
      function callback_GSD(data) {
        console.log(data);
        setVariable('battery_level', data.data.battery_remain)
        setVariable('battery_status', data.data.battery_status)
        send_robot_info()
      }

      function send_robot_info() {
        url = "http://localhost/ntt/senddata_qbit.php"
        map_name = getVariable('current_map');
        destination_name = getVariable('current_location');
        point_x = Number(getVariable('point_x'))
        point_y = Number(getVariable('point_y'))
        point_w = Number(getVariable('point_w'))
        battery_level = Number(getVariable('battery_level'))
        
        onmove = getVariable('onmove')
        if(onmove == 1) {
          move_status = 'runnning';
        } else if (onmove == 2) {
          move_status = 'emergency_stop';
        } else {
          move_status = 'ready';
        }
        // ※move_statusは以下の値
        // ready, running, busy, emergency_stop
        battery_status = getVariable('battery_status')
        if (battery_status == 2) {
          charge_stauts = 'true'; //充電中
        } else {
          charge_stauts = 'false'; //それ以外
        }

        senddata = {
          "type":"info_buddy_status_for_qbit",	
          "data":{	
            "current_location": {
              "map_name": map_name,
              "destination_name":destination_name,
              "point": {
                "point_x":point_x,
                "point_y":point_y,
                "point_z":0,
              },
              "stop_angle": {
                "point_x":0,
                "point_y":0,
                "point_z":0,
                "point_w":point_w
              }
            },
            "battery_level":battery_level,
            "move_status":move_status,
            "charge_state":charge_stauts
          }	
        }
        console.debug(senddata)
        $.ajax({
          type: "POST",
          url: url,
          data: senddata,
          dataType : "json"
        }).done(function(data){
          // 既存MAPのsettingを取得
          console.log(data)
        });
      }

      function countup_temmplate() {
        console.log('QBIT連携ロボット状態収集・通知')
        get_system_data()
      }
      // setInterval(countup, 5000);
      setTimeout(countup_temmplate, 5000)
    </script>
  </body>
</html>

