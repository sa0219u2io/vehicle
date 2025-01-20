<?php
  header("Content-type: application/json; charset=UTF-8");
  $filename = '../asset/json/remote.json';
  unlink($filename);
  return;