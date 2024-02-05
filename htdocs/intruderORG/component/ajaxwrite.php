<?php
  $list = $_POST;
  // var_dump($list);
  // header("Content-type: application/json; charset=UTF-8");
  $filename = '../../cache/'.base64_decode($_GET['file']);
  //chmod($filename, 0777);
  echo($filename);
  if (!file_exists($filename)) {
    if (!file_exists('../../cache')) {
      mkdir('../../cache', 0777);
    }
    touch($filename);
  }
  $string = json_encode($list);
  echo($string);
  file_put_contents($filename, $string);
  return;
