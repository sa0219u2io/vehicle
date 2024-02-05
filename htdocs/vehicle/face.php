<?php $main = ''?>
<?php $mainmessage = ''?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  $('.wrapper').addClass('onmove')
//タイマースクリプト
  var countup = function(){
  }
  //setInterval(countup, defaultlooptimer);
  $('.onmove').click(function(){
    url = webroot+appname+'/asset/announce/001_TakePhoto.wav'
    setLog(0,url);
    var announce = new Audio(url);
    vol = getVariable('announce_volume')/100
    announce.volume = vol;
    announce.play();
  });
</script>
