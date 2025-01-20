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
    chmod($filename, 0777);
  }
  $variable = json_decode(file_get_contents($filename), true);
  $newlist = $list['settings'][$list['current_map']];
  $variable['settings'][$list['current_map']] = $newlist;
  $string = json_encode($variable, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  echo($string);
  file_put_contents($filename, $string);
  return;
