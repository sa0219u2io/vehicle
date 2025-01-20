<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
  $filename = '../asset/json/multiple.json';
  $string = '{"default":{"work":{"list":[],"number":0,"from":null,"to": null,"reset":0,"ready":false},"current_location":"","mynumber":0}}';

  $result = file_put_contents($filename, $string);

  $variable = file_get_contents($filename);
  echo $variable;
  return;