<?php
  $dir = 'asset/announce/*';
  echo($dir);
  $files = glob($dir);
  var_dump($files);
?>