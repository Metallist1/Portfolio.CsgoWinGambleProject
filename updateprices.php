<?php
// checkin user is admin
	if(!isset($_COOKIE["admin"])){
		http_response_code(404);
		die();
	}
ini_set('memory_limit','1000M');
$timestart= microtime(true);
$db = new PDO('mysql:host=localhost;dbname=csgogamble', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
$db->setAttribute(\PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
//opskins api .
$url = "https://api.opskins.com/IPricing/GetPriceList/v2/?appid=730";
$obj = json_decode(file_get_contents($url), true);
$date = date("Y-m-d", strtotime("-1 days"));
	foreach($obj["response"] as $key => $price) {
		foreach($price as $keys => $prices) {
			if($keys == $date){
				$min = $prices["min"]/100;
				$max = $prices["max"]/100;
				$avarage = (($min+$max)/2);
				$stmt = $db->prepare("SELECT * FROM `itemsinfo` WHERE `market_hash_name` = :name");
				$stmt->execute(array("name" => $key));
				$rows = $stmt->rowCount();
					if($rows ==0 ){
						$statement = $db->prepare("INSERT INTO `itemsinfo`(`appid`, `market_hash_name`, `Opskins`)
    							VALUES(:appid, :market, :price)");
							$statement->execute(array(
   								 "appid" => "730",
  								  "market" => $key,
  								  "price" => $avarage
							));
						echo "Inserted OPSKINS price for: <b>" . $key . " </b> with minimum price : " . $min . " and max : " . $max . " and avarage : " . $avarage . " <br>";
					}else{
						$query = $db->prepare("UPDATE `itemsinfo` SET `Opskins` = :price WHERE `market_hash_name` = :name");
						$query->execute(array(
   							 "price" => $avarage,
  							  "name" => $key
						));
						//echo "Updated OPSKINS price for: <b>" . $key . " </b> with minimum price : " . $min . " and max : " . $max . " and avarage : " . $avarage . " <br>";
					}
			}
		}
	}
//csgo fast
$url = "https://api.csgofast.com/price/all";
$obj = json_decode(file_get_contents($url), true);
	foreach($obj as $key => $price) {
		$stmt = $db->prepare("SELECT * FROM `itemsinfo` WHERE `market_hash_name` = :name");
			$stmt->execute(array("name" => $key));
			$rows = $stmt->rowCount();
				if($rows ==0 ){
					$statement = $db->prepare("INSERT INTO `itemsinfo`(`appid`, `market_hash_name`, `Csgofast`)
    						VALUES(:appid, :market, :price)");
						$statement->execute(array(
   							 "appid" => "730",
  							  "market" => $key,
  							  "price" => $price
						));
					echo "Inserted CSGOFAST price for: <b>" . $key . " </b> with price " . $price . " <br>";
				}else{
					$query = $db->prepare("UPDATE `itemsinfo` SET `Csgofast` = :price WHERE `market_hash_name` = :name");
					$query->execute(array(
   						 "price" => $price,
  						  "name" => $key
					));
					//echo "Updated CSGOFAST price for: <b>" . $key . " </b> with price " . $price . " <br>";
				}
	}

//steamapi 
$url = "https://api.steamapi.io/market/prices/730?key=55bc797df0cfbdc2bb03bba9cc8c2ce0";
$obj = json_decode(file_get_contents($url), true);
	foreach($obj as $key => $price) {
		$stmt = $db->prepare("SELECT * FROM `itemsinfo` WHERE `market_hash_name` = :name");
			$stmt->execute(array("name" => $key));
			$rows = $stmt->rowCount();
				if($rows ==0 ){
					$statement = $db->prepare("INSERT INTO `itemsinfo`(`appid`, `market_hash_name`, `CsgoApi`)
    						VALUES(:appid, :market, :price)");
						$statement->execute(array(
   							 "appid" => "730",
  							  "market" => $key,
  							  "price" => $price
						));
					echo "Inserted CSGOAPI price for: <b>" . $key . " </b> with price " . $price . " <br>";
				}else{
					$query = $db->prepare("UPDATE `itemsinfo` SET `CsgoApi` = :price WHERE `market_hash_name` = :name");
					$query->execute(array(
   						 "price" => $price,
  						  "name" => $key
					));
					//echo "Updated CSGOAPI price for: <b>" . $key . " </b> with price " . $price . " <br>";
				}
	}
//real price of items 
	$prices = $db->prepare("SELECT * FROM `itemsinfo` " );
	$prices->execute();
	$result = $prices->fetchAll();
		foreach ($result as $key=> $array){
			$thiskey =  $array["market_hash_name"];
			$pricesingeneral = array("Op"=> $array["Opskins"], "Api" => $array["CsgoApi"] , "Fast"=> $array["Csgofast"]);
			$goal = prices($pricesingeneral);
			$result = count($goal);
			$query = $db->prepare("UPDATE `itemsinfo` SET `Price` = :price WHERE `market_hash_name` = :name");
				if ($result >1){
					$endgoal = array();
					$price =0;
						foreach( $goal as $keys => $prices){
							$price = $prices + $price;
						}
					$realprice = $price/$result;
					reset($goal);
						while (list($key, $val) = each($goal)){
							$principas = $realprice/$val;
							$endgoal[] = $principas;
						}
							$jeff = aretrue($endgoal);
							
							if($jeff == true){
								echo "Updated $thiskey $realprice <br>";
								$query->execute(array(
   								 "price" => $realprice,
  								  "name" => $thiskey
								));
							}else{
								echo " $thiskey Is unstable <br>";
								$query->execute(array(
   								 "price" => 0,
  								  "name" => $thiskey
								));
							}
				}else{								
								echo " $thiskey Doesnt have enough info <br>";
								$query->execute(array(
   								 "price" => 0,
  								  "name" => $thiskey
								));
				}
		}
	function prices($stack) {
		$Final = $stack;
			foreach ($stack as $key => $price){
				if($price == 0 ) unset($Final[$key]);
			}
		return $Final;
	}
	function aretrue($array){
		foreach($array as $key =>$price){
			if($price> 1.4 || $price < 0.6) return false;
		}
		return true;
	}
$endtime = microtime(true);
$timepassed = $endtime-$timestart;
    $hours = (int) ($timepassed / 60 / 60);
    $minutes = (int) ($timepassed / 60) - $hours * 60;
    $seconds = (int) $timepassed - $hours * 60 * 60 - $minutes * 60;
echo "\n Price update was finished in $timepassed seconds or $minutes minutes ";

?>