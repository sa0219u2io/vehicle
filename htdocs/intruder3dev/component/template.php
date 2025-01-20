<?php
  include('com.php');
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
      <div class="right_nav panel-opener" id="info"></div>
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
      page_int()

      if (!isInArray(basename, ['index','error','remote','destination','debug'])){
        countup_temmplate()
        setInterval(countup_temmplate, timer.system);
      }

      if (isInArray(basename, ['select','sequence','senario','face'])){
        setInterval(countup_move, timer.remote);
      }

      if (isInArray(basename, ['select','sequence'])){
        setInterval(countup_select, timer.default);
      }

      if (isInArray(basename, ['complete', 'onmove'])){
        setInterval(countup_complete, timer.default);
      }
      //ループスクリプト
      function countup_temmplate() {
        checkBattery()
        get_system_data()
      }

      // ループスクリプト
      function countup_move() {
        // 移動実行
        work = getWork()
        if (isTrue(work.ready)) {
          work.ready = false
          move(work)
        }
        // 予約☑
        now = new Date();
        reserveWork(zeroPadding(now.getHours(),2)+zeroPadding(now.getMinutes(),2))
        // 複数拠点のアボイダンス判定
        checkAvoidance()
        // checkRemote()
      }

      // ループスクリプト
      function countup_select() {
        // 状況表示
        showWork()
      }

      // ループスクリプト
      function countup_complete() {
        // 状況表示
        if (isTrue(getVariable('multiple_flg'))) {
          gatherMultiple()
          multiple = getVariable('multiple','obj')
          multiple_judgement = getMultipleJudgement(multiple)
        }
      }

    </script>
  </body>
</html>