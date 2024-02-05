<?php $main = ''?>
<?php $mainmessage = '運搬モードを起動します'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
  init()
  setUnderMessage(mainversion)
  setTimeout(function(){playAnnounce('wakeup')}, 1000)
  setTimeout(function(){transScreen('select')}, 6000)
//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
