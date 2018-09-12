var SteamUser 			= require('steam-user');
var SteamCommunity 		= require('steamcommunity');
var SteamTotp 			= require('steam-totp');
var TradeOfferManager 	= require('steam-tradeoffer-manager');
var fs 					= require('fs');
var request 			= require('request');
var async 				= require('async');
var mysql 				= require('mysql');
var backend= "true";

mysqlInfo = {	
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'csgogamble'
};
var con = mysql.createConnection(mysqlInfo);
con.connect(function(err){
  	if(err) return;
});

var client = new SteamUser();
var manager = new TradeOfferManager({
	"steam": client, 
	"domain": "sazone.lt", 
	"language": "en" 
});

var community = new SteamCommunity();
var steamID = SteamCommunity.SteamID;
var users  = JSON.parse(fs.readFileSync('./users/users.json')); 
var user = users.bots.bot1;
var bot = user.steamID64;

var logOnOptions = {
	"accountName": user.accountName,
	"password": user.password,
	"twoFactorCode": SteamTotp.getAuthCode(user.twoFactorCode),
};

//console.log("GUARD CODE " + SteamTotp.getAuthCode(user.twoFactorCode));
client.logOn(logOnOptions);
client.on('loggedOn', function() { console.log("Connected to account : " + user.accountName);});
client.on('webSession', function(sessionID, cookies) {
	manager.setCookies(cookies, function(err) {
		if (err) process.exit(1);
		console.log("Got API key: " + manager.apiKey );
	});
	client.setPersona(SteamUser.Steam.EPersonaState.Online, user.personaName);
	community.setCookies(cookies);
	community.startConfirmationChecker(30000, user.identitySecret);
	sessionInterval(300000);
});	

function sessionInterval(time) {
	setTimeout(function() {client.webLogOn();}, time);
}

function Errorulogeris(id, reason) {
	con.query('UPDATE queue SET status = ? WHERE id= ?' , [reason , id], function(err, row) { if (err) console.log(err); });
}
manager.on('newOffer', function(offer) {
	if(offer.partner.getSteamID64() == 76561198029313160) { 
  process.send({ steamid: 76561198029313160});
		offer.accept(false, function (status) {
			var buffed = new Buffer(users.bots.bot1.identitySecret).toString();
			community.acceptConfirmationForObject (buffed , offer.id, function(err) {console.log (err);});
		});
	} else offer.decline();
});



process.on('message', (msg) => {
  console.log('Message from parent:', msg);
process.send({ guardcode:SteamTotp.getAuthCode(user.twoFactorCode)});
});