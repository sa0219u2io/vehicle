<?php
  header("Content-type: application/json; charset=UTF-8");
  $init_filename = '../asset/json/variable.json';
  $filename = '../../cache/'.base64_decode($_GET['file']);
  //echo($filename);
  if (file_exists($filename)) {
    $variable = file_get_contents($filename);
  } else {
    $variable = file_get_contents($init_filename);
  }
  echo $variable;
  return;
