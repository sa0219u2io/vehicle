<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

  $filename = '../asset/json/multiple.json';

  $variable = file_get_contents($filename);
  echo $variable;
  return;