<?php $main = ''?>
<?php $mainmessage = ''?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<?php
  $dir = 'asset/announce/*';
  echo($dir);
  $files = json_encode(glob($dir));
  // var_dump($files);
?>
<script>
//起動時スクリプト
  $('.wrapper').addClass('onmove')
  var files = JSON.parse('<?=$files?>')
  // console.log(files)
  var count = files.length
  console.log(count+'files found')
  var min = 0 ;
  var run = 0;
//タイマースクリプト
  var countup = function(){
    console.log('再生')
    var i = Math.floor( Math.random() * (count) ) ;
    url = webroot+appname+'/'+files[i]
    setLog(0,url);
    setUnderMessage(url+'再生')
    var announce = new Audio(url);
    announce.play();
  }
  // setInterval(countup, 10000);
  $('.onmove').click(function(){
    if (run == 0) {
      countup()
      a = setInterval(countup, 15000);
      run = 1;
    } else {
      clearInterval(a);
      run = 0;
    }
    
  });
</script>
