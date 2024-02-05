<?php $main = ''?>
<?php $mainmessage = '目的地に到着しました'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  loadBall()
  setVariable('complete_temp', 1);
  get_current_location()
  setVariable('onmove', 0)
  //transScreen('select')

  function callback_GCL(res) {
    current_location = res.data.destination_name
    setVariable('current_location', current_location)
    do_complete(current_location)
  }
</script>
