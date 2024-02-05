<?php 
$post = "{status:'OK'}";
if($_POST) {$post = json_encode($_POST);}
file_put_contents("debug/log.txt", $post.'\n', FILE_APPEND);
echo($post);
?>