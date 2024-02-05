<?php $main = '<div class="error"></div>'?>
<?php $mainmessage = 'エラーが発生しました。管理者に御連絡ください'?>
<?php $undermessage = ''?>
<?php echo('<script>const error = "'.$_GET['e'].'"</script>')?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  errorhandle(error)
  function errorhandle(error) {
    var error_array = [];
    error_array['no_map'] = '地図が未作成です<br>先に地図を作成してください'
    error_array['map_setting_false'] = '地図の設定が不正です<br>ロボットへの地図の設定を再度行ってください'
    setLog(error)
    setMainError(error_array[error])
  }
//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
