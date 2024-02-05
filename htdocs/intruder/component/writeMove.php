<?php
  $list = $_POST;
  // var_dump($list);
  // header("Content-type: application/json; charset=UTF-8");
  $filename = '../asset/json/move.json';
  //chmod($filename, 0777);
  echo($filename);
  if (!file_exists($filename)) {
    touch($filename);
    chmod($filename, 0777);
  }
  $string = json_encode($list);
  // echo($list);
  echo($string);
  file_put_contents($filename, $string);
  return;