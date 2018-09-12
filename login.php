<?php
				
try {
	$db = new PDO('mysql:host=localhost;dbname=csgogamble', 'root', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
} catch (PDOException $e) {
	exit($e->getMessage());
}
        include 'openid.php';
        try
        {
            $openid = new LightOpenID('http://'.$_SERVER['SERVER_NAME'].'/');
            if (!$openid->mode) {
                $openid->identity = 'http://steamcommunity.com/openid/';
                header('Location: '.$openid->authUrl()); 
			} elseif ($openid->mode == 'cancel') {
				echo '';
			} else {
				if ($openid->validate()) {

					$id = $openid->identity;
					$ptn = "/^http:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";
					preg_match($ptn, $id, $matches);

					$url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=7ABB3D713E5E4685D91656AA54952CE4&steamids=$matches[1]";
					$json_object = file_get_contents($url);
					$json_decoded = json_decode($json_object);
					foreach ($json_decoded->response->players as $player) {
						$steamid = $player->steamid;
						$name = $player->personaname;
						$avatar = $player->avatar;
					}
					$url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=7ABB3D713E5E4685D91656AA54952CE4&steamid=$matches[1]&format=json";
					$obj = json_decode(file_get_contents($url), true);
					$games = $obj["response"]["games"];
					$forevertime= 1;
					foreach ($games as $key =>$asset) {
						if($asset["appid"]==730 && $asset["playtime_forever"]>=1200) $forevertime= 0;
						else if($asset["appid"]==730 && $asset["playtime_forever"]<1200)  $forevertime= 1;
					}
					$no_hash = $steamid.time().rand(1, 1000000000);
					$hash = hash('sha256', $no_hash);	
					$hashdef = md5('sazone.lt' . time() . rand(1, 50));
					$sql = $db->query("SELECT * FROM `users` WHERE `steamid` = '" . $steamid . "'");
					$row = $sql->fetchAll(PDO::FETCH_ASSOC);
					$mysqltime = date ("Y-m-d H:i:s", time());
					if (count($row) == 0) {
						$db->exec("INSERT INTO `users` (`hash`, `steamid`, `name`, `avatar`,`defultreferal`,`CsRes`,`freecoins`) VALUES ('" . $hash . "', '" . $steamid . "', " . $db->quote($name) . ", '" . $avatar . "', '" . $hashdef . "', '" . $forevertime . "', '" . $mysqltime . "')");
					} else {
						$db->exec("UPDATE `users` SET `hash` = '" . $hash . "',`CsRes` = '" . $forevertime . "', `name` = " . $db->quote($name) . ", `avatar` = '" . $avatar . "' WHERE `steamid` = '" . $steamid . "'");
					}
					foreach($row as $key => $array){
						if($array["Admin"] == 1 ) setcookie('admin', "yes", time()+86400, '/');
					}
					setcookie('_152Geb54',$hash, time()+86400, '/');
					setcookie('user', $avatar, time()+86400, '/');
					setcookie('who',$steamid, time()+86400, '/');
					header('Location: http://www.sazone.lt/gambleproject/index.php');
				}
			}
		} catch (ErrorException $e) {
			exit($e->getMessage());
		}
?>