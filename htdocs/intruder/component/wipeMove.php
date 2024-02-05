<?php
  header("Content-type: application/json; charset=UTF-8");
  $filename = '../asset/json/move.json';
  unlink($filename);
  return;