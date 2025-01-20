<?php
  $list = $_POST;
  // var_dump($list);
  // header("Content-type: application/json; charset=UTF-8");
  $filename = '../asset/json/move.json';
  // chmod($filename, 0777);
  echo($filename);
  if (!file_exists($filename)) {
    touch($filename);
    chmod($filename, 0777);
  }
  // $variable = file_get_contents($filename);
  // echo $variable;
  $string = json_encode($list);
  // echo($list);
  echo($string);
  $result = file_put_contents($filename, $string);
  if ($result === false) {
    echo "error" . PHP_EOL; 
  }
  $variable = file_get_contents($filename);
  echo $variable;
  return;