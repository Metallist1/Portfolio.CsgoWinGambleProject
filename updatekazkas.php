<?php
	$id = $_POST["who"];
$check = $_POST["auth"];
if($check == "authenticated"){
	$db = new PDO('mysql:host=localhost;dbname=csgogamble', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	$db->setAttribute(\PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES 'utf8'");
$db ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
for ($i = 0; $i < count($id); $i++) {

	$url = 'http://steamcommunity.com/inventory/' .$id[$i]. '/730/2?l=english&count=5000';
	$obj = json_decode(file_get_contents($url), true);
	if($obj["success"] == 1 ){
		if($obj["total_inventory_count"] > 0 ){
			$stmt = $db->prepare("SELECT * FROM `itemsinfo` WHERE `market_hash_name` = ?");
			$realinventory = array();
			$updating = array();
			$assets = $obj["assets"];
			$descriptions = $obj["descriptions"];
			foreach($descriptions as $key => $description){
 				foreach($assets as $key =>$asset){
 					if($description["classid"]==$asset["classid"] && $description["tradable"]==true && $description["marketable"]){
						if(array_key_exists($asset["assetid"],$realinventory)==false){
							$realinventory[$asset["assetid"]]																			=$description;
							$realinventory[$asset["assetid"]]["assetid"] 																		=$asset["assetid"];
							array_push($updating, $description["market_hash_name"]);
						}
					}
				}
			}

		}else echo json_encode(['error' => "No items"]);
	}else echo json_encode(['error' => "Please log in"]);
}
	function updateoverstock($array ,$db){
	$query = $db->prepare("UPDATE `itemsinfo` SET `Overstock` = :Overstock WHERE `market_hash_name` = :name");
	$updating = array_count_values($array);
	foreach ($updating as $key =>$value) {
echo json_encode(['error' => $key]);
echo json_encode(['error' => $value]);
		if ($value>=10){
			$query->execute(array(
   			"Overstock" => 1,
  			"name" => $key
			));
			echo json_encode(['error' => "No items"]);
		}else{
				$query->execute(array(
   		"Overstock" => 0,
  		"name" => $key
		));
		}
	}
}
updateoverstock($updating , $db);


}else{
		http_response_code(404);
		die();
}
?>