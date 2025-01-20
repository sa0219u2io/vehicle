<?php
  header("Content-type: application/json; charset=UTF-8; Access-Control-Allow-Origin: *");
  $filename = '../asset/json/remote.json';
  //echo($filename);
  $variable = file_get_contents($filename);
  echo $variable;
  return;