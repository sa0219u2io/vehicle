<?php
  include('com.php');
  // define('APP', 'intruder');
  if (!isset($content['main']))$content['main'] = '';
  if (!isset($content['main_message']))$content['main_message'] = '';
  if (!isset($content['under_message']))$content['under_message'] = '';

  $mp = gethostbyname(gethostname());
?>

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css?<?=time()?>">
    <script>
      const appname = '<?=APP?>';
      const basename = '<?=$basename?>';
      const myip = '<?=$mp?>';
    </script>
    <?php $jslist = ['jquery', 'driver', 'api', 'frame', 'main']?>
    <?php foreach($jslist as $obj):?>
      <script type="text/javascript" src="asset/js/<?=$obj?>.js?<?=time()?>"></script>
    <?php endforeach;?>
  </head>
  <body>
    <div class="wrapper">
      <!-- 共通 -->
      <div class="right_nav"></div>
      <!-- コンテンツ -->
      <?php foreach($content as $key => $value):?>
        <div class="<?=$key?>"><?=$value?></div>
      <?php endforeach;?>
      <!-- 共通のモーダル表示部分 -->
      <div class="left_nav modal-opener" id="menu"></div>
      <?php include('modal.php')?>
      <!-- ローディングボール -->
      <div class="loading hid">
        <?php for ($i=1; $i < 9; $i++):?>
          <span class="ball ball-<?=$i?>"></span>
        <?php endfor?>
      </div>
      <div id="loadingwall" class="hid"></div>
      
    </div>
    <script>
      // modalNumbers()
      beforehandler();
      //ループスクリプト
      function countup_temmplate() {
        beforehandler();
      }
      // TODO;
      setInterval(countup_temmplate, sytemlooptimer);
    </script>
  </body>
</html>