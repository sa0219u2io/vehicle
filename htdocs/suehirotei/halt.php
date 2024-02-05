<?php $main = '<div class="haltdata"><img src="asset/image/buddychar.png"><div class="halt-sensor-1" id="halt-sensor"></div><div class="halt-sensor-2" id="halt-sensor"></div><div class="halt-sensor-3" id="halt-sensor"></div><div class="halt-sensor-4" id="halt-sensor"></div><div class="halt-sensor-5" id="halt-sensor"></div><div class="halt-sensor-6" id="halt-sensor"></div><div class="halt-sensor-7" id="halt-sensor"></div></div>'?>
<?php $mainmessage = '  障害物検知のため移動を中断しました<br>障害物がなくなると自動で復帰します'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  get_sensor_data()
  setTimeout(function(){playAnnounce('halt')}, 200)
</script>
