<?php
	if(!isset($_COOKIE["admin"])){
		http_response_code(404);
		die();
	}
$db = new PDO('mysql:host=localhost;dbname=csgogamble', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$time = rand(1000000000, 9888888887);
$no_hash = $time.rand(1,128).rand(1,16985).rand(1,12769812);
$hash = hash('sha256', $no_hash);
$db->exec('INSERT INTO `hash` SET `hash` = '.$db->quote($hash).', `ticket` = '.$db->quote($time));
echo $hash;
?>