<?php $main = ''?>
<?php $mainmessage = '目的地に到着しました'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  loadBall()
  setVariable('complete_temp', 1);
  get_current_location()
  //setTimeout(do_complete(), 2000)
</script>
