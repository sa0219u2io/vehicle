<?php $main = '<div class="haltdata"><img src="asset/image/buddychar.png"></div>'?>
<?php $mainmessage = '  障害物検知のため移動を中断しました<br>障害物がなくなると自動で復帰します'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  // get_sensor_data()
  $('.wrapper').addClass('halt')
  playAnnounce('halt')
  var countup = function(){
    playAnnounce('halt')
  }
  looptimer = 10000
  setInterval(countup, looptimer);
</script>
