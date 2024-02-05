<?php $main = ''?>
<?php $mainmessage = '目的地に到着しました'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
  loadBall()
  setVariable('complete_temp', 1);
  get_current_location()
  //transScreen('select')

  function callback_GCL(res) {
    current_location = current_location = res.data.destination_name
    setVariable('current_location', current_location)
    point_x = res.data.point.point_x
    point_y = res.data.point.point_y
    point_w = res.data.stop_angle.point_w
    setVariable('point_x', point_x)
    setVariable('point_y', point_y)
    setVariable('point_w', point_w)
    complete(current_location)
  }
</script>
