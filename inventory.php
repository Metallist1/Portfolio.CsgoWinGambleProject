<?php
	$id = $_POST["who"];
	$identity = $_POST["ident"];
	$db = new PDO('mysql:host=localhost;dbname=csgogamble', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	$db->setAttribute(\PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES 'utf8'");
	$url = 'http://steamcommunity.com/inventory/' .$id. '/730/2?l=english&count=5000 ';
	$obj = json_decode(file_get_contents($url), true);
	if($obj["success"] == 1 ){
			$stmt = $db->prepare("SELECT * FROM `itemsinfo` WHERE `market_hash_name` = ?");
			$realinventory = array();
			$assets = $obj["assets"];
			$descriptions = $obj["descriptions"];
			foreach($descriptions as $key => $description){
 				foreach($assets as $key =>$asset){
 					if($description["classid"]==$asset["classid"] && $description["tradable"]==true && $description["marketable"]){
						if(array_key_exists($asset["assetid"],$realinventory)==false){
							$realinventory[$asset["assetid"]]																			=$description;
							$realinventory[$asset["assetid"]]["assetid"] 																		=$asset["assetid"];
							if (strpos($description["market_hash_name"], 'SG 553 | Army Sheen') !== false) $realinventory[$asset["assetid"]]['icon_url']								=$realinventory[$asset["assetid"]]['icon_url_large'];
							if (strpos($description["market_hash_name"], 'Factory New') !== false)		$realinventory[$asset["assetid"]]["wear"]								="Factory New";
							else if (strpos($description["market_hash_name"], 'Minimal Wear') !== false) 	$realinventory[$asset["assetid"]]["wear"]								="Minimal Wear";
							else if (strpos($description["market_hash_name"], 'Field-Tested') !== false) 	$realinventory[$asset["assetid"]]["wear"]								="Field-Tested";
							else if (strpos($description["market_hash_name"], 'Well-Worn') !== false) 	$realinventory[$asset["assetid"]]["wear"]								="Well-Worn"; 
							else if (strpos($description["market_hash_name"], 'Battle-Scarred') !== false) 	$realinventory[$asset["assetid"]]["wear"]								="Battle-Scarred";
							if (strpos($description["market_hash_name"], 'StatTrak') !== false) $realinventory[$asset["assetid"]]["st"]										="true";
							if(array_key_exists(10,$realinventory[$asset["assetid"]]['descriptions'])&& strpos($realinventory[$asset["assetid"]]['descriptions'][10]['value'], '<br>') !== false) $realinventory[$asset["assetid"]]['stickers'] 					=$description['descriptions'][10]['value'];
							else if(array_key_exists(6,$realinventory[$asset["assetid"]]['descriptions'])&& strpos($realinventory[$asset["assetid"]]['descriptions'][6]['value'], '<br>')!== false) $realinventory[$asset["assetid"]]['stickers'] 				=$description['descriptions'][6]['value'];
							if(array_key_exists("actions",$description)){ 
								$tempReplace = str_replace("%owner_steamid%",$id,$description['actions'][0]['link']);
								$tempReplac = str_replace("%assetid%",$asset["assetid"],$tempReplace);
								$realinventory[$asset["assetid"]]['inspectlink'] = $tempReplac;
							}
								$stmt->execute([$description["market_hash_name"]]);
								$result = $stmt -> fetch();
								if($identity =="user" && $result["Price"]<0.5) $realinventory[$asset["assetid"]]["price"]	=0.005;
								else	$realinventory[$asset["assetid"]]["price"]																=$result["Price"];
								if ($result["Allowitem"] == 1 && $identity=="user") $realinventory[$asset["assetid"]]["banned"]											="yes";
								$realinventory[$asset["assetid"]]["link"]					="http://steamcommunity.com/market/listings/730/".$description["market_hash_name"];
								$realinventory[$asset["assetid"]]["name"]					=$description["name"];
						}
					}
				}
			}
			echo json_encode($realinventory);
	}else echo json_encode(['error' => "Please log in"]);
?>