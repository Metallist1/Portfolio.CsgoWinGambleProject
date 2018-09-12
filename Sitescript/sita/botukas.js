var SteamUser 			= require('steam-user');
var SteamCommunity 		= require('steamcommunity');
var SteamTotp 			= require('steam-totp');
var TradeOfferManager 	= require('steam-tradeoffer-manager');
var fs 					= require('fs');
var request 			= require('request');
var async 				= require('async');
var mysql 				= require('mysql');
var mysqlInfo;

mysqlInfo = {	
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'csgogamble'
};
var con = mysql.createConnection(mysqlInfo);
con.connect(function(err){
  	if(err){
		console.log(err);
    	return;
  	}
  	console.log('Connected to database');
});

var client = new SteamUser();
var manager = new TradeOfferManager({
	"steam": client, 
	"domain": "sazone.lt", 
	"language": "en" 
});
var community = new SteamCommunity();
var steamID = SteamCommunity.SteamID;
if(fs.existsSync('./users/users.json') ) var users  = JSON.parse(fs.readFileSync('./users/users.json')); 
else process.exit(1);
var user = users.bots.bot2;
var bot = user.steamID64;

var logOnOptions = {
	"accountName": user.accountName,
	"password": user.password,
	"twoFactorCode": SteamTotp.getAuthCode(user.twoFactorCode),
};

console.log("GUARD CODE " + SteamTotp.getAuthCode(user.twoFactorCode));
client.logOn(logOnOptions);
client.on('loggedOn', function() { console.log("Connected to account : " + user.accountName);});

client.on('webSession', function(sessionID, cookies) {
	manager.setCookies(cookies, function(err) {
		if (err) {
			console.log(err);
			process.exit(1);
			return;
		}
		console.log("Got API key: " + manager.apiKey );
	});
	client.setPersona(SteamUser.Steam.EPersonaState.Online, user.personaName);
	community.setCookies(cookies);
	community.startConfirmationChecker(30000, user.identitySecret);
	sessionInterval(300000);
});	
var myVar = setInterval(sendoffers, 2000);
function sessionInterval(time) {
	setTimeout(function() {
		console.log('Getting new cookies.');
		client.webLogOn();
	}, time);
}
function Errorulogeris(id, reason) {
	con.query('UPDATE queue SET status = ? WHERE id= ?' , [reason , id], function(err, row) { if (err) console.log(err); });
}
manager.on('newOffer', function(offer) {
	if(offer.partner.getSteamID64() == 76561198029313160) { 
		offer.accept(false, function (status) {
			var buffed = new Buffer(users.bots.bot2.identitySecret).toString();
			community.acceptConfirmationForObject (buffed , offer.id, function(err) {console.log (err);});
		});
	} else offer.decline();
});
//webo funkcija
function sendoffers(){
	con.query('SELECT * FROM queue WHERE status = ?', ['Processing'], function(err, row) {
		if (err) console.log(err);
		else if (!row[0] == undefined) return;
		else{
			con.query('SELECT * FROM queue WHERE status = ?', ['waiting'], function(err, row) {
				if (err) console.log(err);
				else if (row[0] == undefined) return;
				else if (row[0].botoid != bot) return; 
				else seteverything(row[0].id,row[0].userid,row[0].useritems,row[0].userioasset,row[0].userioprice,row[0].botitems,row[0].botoassetid,row[0].botoprice,row[0].deposit);

				function seteverything(id,userid,Uitems,Uassets,Uprice,Bitems,Bassets,Bprice,deposit) {
					exchangeid = id ;
					priezastis = "Processing";
					Errorulogeris(exchangeid,priezastis );
					user = userid;
					deposits=deposit;
					console.log("exchangeid : " + exchangeid);
					console.log("userio id : " + user);
					uItems = Uitems.split(' / ');
					uAssets = Uassets.split(' / ');
					KainaU = Uprice ;
					console.log("user items : " + Uitems);
					console.log("user asset ids : " + Uassets);
					console.log("userio kaina : " + KainaU);
					bItems = Bitems.split(' / ');
					bAssets = Bassets.split(' / ');
					KainaB = Bprice ;
					console.log("bot items : " + Bitems);
					console.log("bot asset ids : " + Bassets);
					console.log("bot kaina : " + KainaB);
					console.log("deposit : " + deposits);						
				}
				con.query('SELECT * FROM users WHERE steamid = ?', [user], function(err, row) {
					if (err) console.log(err);
					else if (row[0].tradeurl == undefined) { //nera trade link . Offeris iskart laikomas kaip ivykes
						priezastis = "No tradelink";
						console.log("No tradelink");
						Errorulogeris(exchangeid,priezastis );
						return;
					} else {
						console.log(row[0].tradeurl);
						console.log(row[0].Ban);
						setuserinfo(row[0].Ban,row[0].tradeurl,row[0].Coins);
					}
				});
				function setuserinfo(ban , token,coins) {
						availableC = coins;
						isbanned = ban ;
						tradeurltoken = token ;
						approchingcheckers();
						console.log("coins " + availableC);
						console.log("tradelink " + tradeurltoken);
						console.log("0= not banned 1 = banned " + isbanned);
				}
				function approchingcheckers (){		
						if(isbanned == 1){
							console.log("user is banned");
							priezastis = "User is banned";
							Errorulogeris(exchangeid,priezastis );
							return;
						}
					KainaU = KainaU*1000;
					KainaB = KainaB*1000;
					if(deposits == 0){
					var availableCoins = Math.round(availableC) -Math.round(KainaB);
						console.log(availableC);
						console.log(KainaB);
						console.log(availableCoins);
						if (availableCoins<0){
							console.log("Not enough coins ");
							priezastis = "Not enough coins";
							Errorulogeris(exchangeid,priezastis );
							return;
						}		
					}
			//pirmas checkeris
					if (KainaU <0 || KainaB<0){
							console.log("nepraejo pro pirma checkeri ");
							priezastis = "First checker error";
							var bannintas = 1 ; 
							con.query('UPDATE users SET ban = ? WHERE steamid= ?' , [bannintas , user], function(err, row) { if (err) console.log(err); });
							Errorulogeris(exchangeid,priezastis );
							return;
					}
				console.log("Checker number 1 is clear");
				var Exchange = manager.createOffer(new TradeOfferManager.SteamID(user), tradeurltoken);
				Exchange.setToken(tradeurltoken);
// antras checkeris
					async.parallel({
							escrow: function(callback) {
								Exchange.getUserDetails(function (err, them, me, escrowDays) {
									if(err) callback(err);
									else if ( !them['escrowDays']==0) callback(null, 0);
									else callback(null, 1);
								});
							},
							secondcheckerone: function(callback) {
								var itemvalue = 0;
								var SumOfuser = 0 ;
								var endofuser = 0 ;
								var secondItemcount = -1;
								var lengthofuser =  uItems.length-2;
								console.log("length " + lengthofuser);
								if(lengthofuser == secondItemcount)callback(null, endofuser);
									for (i = 0; i <= lengthofuser; i++) { 
										console.log("useris siuncia itema su vardu : " +uItems[i]);
										var itemUSERS = uItems[i];
											con.query('SELECT * FROM itemsinfo WHERE market_hash_name = ?', [itemUSERS], function(err, row) {
												if (err) callback(err);
												else{
												if(row[0].Allowitem == 1) callback("unallowed item detected ");
													secondItemcount++;
													console.log( row[0].Price);
													setValue(row[0].Price,secondItemcount,lengthofuser);
												}
											}); 
									}
									function setValue(value,secondU,lengthofU) {
										itemvalue = value ;
										if(itemvalue<0.5) SumOfuser = 0.005 + endofuser;
										else SumOfuser = itemvalue + endofuser;

										endofuser = SumOfuser;
										console.log("Suma userio : " + endofuser);
										if(secondU ==lengthofU) callback(null, endofuser);
									}
							},
							secondcheckertwo: function(callback) {
								var itemovalueboto = 0;
								var sumaboto = 0 ;
								var galas = 0 ;
								secondItemBcount=-1;
								var ilgisboto =  bItems.length-2;
								if(ilgisboto == secondItemBcount)callback(null, galas);
									for (i = 0; i <= ilgisboto; i++) { 
										console.log("botas siuncia itema su vardu : " +  bItems[i]);
										var itemasb = bItems[i];
											con.query('SELECT * FROM itemsinfo WHERE market_hash_name = ?', [itemasb], function(err, row) {
												if (err) callback(err);
												else{
													secondItemBcount++;
													console.log( row[0].Price);
													setValueb(row[0].Price,secondItemBcount,ilgisboto);
												}
											}); 
									}
									function setValueb(value,secondB,lengthofB) {
										if(value == 0 ){
											itemovalueboto = 10000000 ;
											sumaboto = itemovalueboto + galas;
											galas = sumaboto;
										}else{
											itemovalueboto = value ;
											sumaboto = itemovalueboto + galas;
											galas = sumaboto;
											console.log("suma boto : " + galas);
											if(secondB ==lengthofB)callback(null, galas);
										}
									}
							}
					}, function(err, result) {
						if (err) {
							priezastis = err;
							Errorulogeris(exchangeid,priezastis );
							return;
						}
						if(result.escrow == 0){
											priezastis = "Escrow error";
										Errorulogeris(exchangeid,priezastis );
						}else{
							var roundedgalasuserio = Math.round(result.secondcheckerone * 100) / 100;
							var roundedgalas = Math.round(result.secondcheckertwo * 100) / 100;
							roundedgalas = roundedgalas*1000;
							roundedgalasuserio = roundedgalasuserio*1000;
							lyginam(roundedgalasuserio ,roundedgalas);
								function lyginam(galasuserio,galas){
										console.log("Second checker clear");
//trecias checkeris
										console.log("boto istraukta kaina " +roundedgalas);
										console.log("userio istraukta kaina " +roundedgalasuserio);
										console.log("boto original kaina " +KainaB);
										console.log("userio original kaina  " +KainaU);
										if( deposits !=1){
											var availableCoins = Math.round(availableC) - Math.round(roundedgalas);
											if (availableCoins<0){
												console.log("Not enough coins ");
												priezastis = "Not enough coins";
												Errorulogeris(exchangeid,priezastis );
												return;
											}		
										}
										if (KainaU==roundedgalasuserio && KainaB==roundedgalas && KainaU >=0 && KainaB >=0 && galasuserio >=0 && galas >=0 && bItems.length == bAssets.length && uItems.length == uAssets.length){
											console.log("Third checker has been passed succesfully");
												async.parallel({
													userInventory: function(callback) {
														manager.loadUserInventory(user, 730, 2, true, function(err, inventory) {
															if( err) {
																priezastis = "Cant load user inv";
																Errorulogeris(exchangeid,priezastis );
																return;
															} else callback(null, inventory);
														});
													},
													botInventory: function(callback) {
														manager.loadUserInventory(bot, 730, 2, true, function(err, inventory) {
															if( err) {
																priezastis = "Cant load bot inv";
																Errorulogeris(exchangeid,priezastis );
																return;
															} else callback(null, inventory);
														});
													}
												}, function(err, results) {
														if( err) {
															console.log(err);
															priezastis = "inv error";
															Errorulogeris(exchangeid,priezastis );
															return;
														}
														var itemslength = bItems.length-1;
														var useritemslength = uItems.length-1;
														var Message = 'Thank you for exchanging with us ! Your trade [ID #' + exchangeid+ ']' ;
														var ExchangeBot  = GetExchangeItems(results.botInventory, bItems, itemslength,bAssets);
														var ExchangeUser = GetExchangeItems(results.userInventory, uItems, useritemslength,uAssets);
														if(typeof ExchangeBot.error != "undefined") {
															priezastis = "Exchange boto error";
															Errorulogeris(exchangeid,priezastis );
															return;
														}
														if(typeof ExchangeUser.error != "undefined") {
															console.log(ExchangeUser.error);
															priezastis = "Exchange userio error";
															Errorulogeris(exchangeid,priezastis );
															return;
														}
														Exchange.addMyItems(ExchangeBot);
														Exchange.addTheirItems(ExchangeUser);
														Exchange.setMessage(Message);
															Exchange.send( function(err, status) {
																if( err) {
																	priezastis = "Sending error";
																	Errorulogeris(exchangeid,priezastis );
																	return;
																}else{		
																	console.log("Status : "+ status);
																	var buffed = new Buffer(users.bots.bot2.identitySecret).toString();
																		con.query('UPDATE queue SET status=\'sent\'WHERE id= ?' , [exchangeid], function(err, row) {
																			if (err){
																				priezastis = "Status error";
																				Errorulogeris(exchangeid,priezastis );
																				return;
																			}else{
																				console.log('Trade offer for queue '+exchangeid+' sent!');	
																				console.log('Exchange send: '+ status);
																				console.log('Exchange Offer ID: ', Exchange.id);
																						if(deposits !=1){
																							con.query('SELECT * FROM users WHERE steamid= ?', [user], function(err, row){
																								if (err) console.log(err);
																								else{
																									var a = parseInt( row[0].Coins);
																									var b = parseInt( row[0].CoinsWithdrawed);	
																									var newcoins = Math.round(a)-Math.round((botoprice *1000));
																									var newtotalcoins= Math.round(b) + Math.round((botoprice *1000));
																									con.query('UPDATE users SET `Coins`=\''+newcoins+'\', `CoinsWithdrawed`=\''+newtotalcoins+'\' WHERE steamid= ?', [user], function(err) {
																										if (err) console.log(err);
																									});
																								}
																							});												
																						}
																				community.acceptConfirmationForObject (buffed , Exchange.id, function(err) {console.log (err);});
																					con.query('UPDATE queue SET status=\'Active\', `offer_id`=\''+Exchange.id+'\'WHERE id= ?' , [exchangeid], function(err, row) {
																						if (err){
																							priezastis = "Trade id error";
																							Errorulogeris(exchangeid,priezastis );
																							return;
																						}
																					});
																			}
																		});
																}
															});
													});
										}else {	
											priezastis = "Third checker error";
											Errorulogeris(exchangeid,priezastis );
											return;
										}
								}
						}
					});
				}
			});
		}
	});
}

function GetExchangeItems(Inventory, Items, itemslength , assets) {
	var ReturnItems = [];
	var i;
	var j;
	var k;
	var appid = null;
	var current = null;
    var cnt = 0;
		for (var i = 0; i < Items.length; i++) {
				if (cnt > 0) {
					console.log(current + ' comes --> ' + cnt + ' times<br>');
						for(j in Inventory) {
							var invItem = Inventory[j];
								if(invItem.market_hash_name == current && invItem.assetid==appid) {
									console.log('Should push here: ', invItem.assetid);
									ReturnItems.push(invItem);
									cnt--;
									k ++;
									appid = assets[k];
								}
							//console.log(invItem.market_hash_name, cnt);
								if(cnt == 0) break;
						}
					if(cnt > 0) {
						return { "error": "Not enough Items in Inventory. Missing: " + current + ", need " + cnt  };
						break;
					}
				}
            appid = assets[i];
            current = Items[i];
            k = i ;
            cnt = 1;
		}
	return ReturnItems;
}
manager.on('sentOfferChanged', function(offer, oldState) {
	var offerTradeId = offer.id;
	var state = offer.state ;
	var status;
		switch (state) {
			case 1:
				status = "Invalid";
				break;
			case 2:
				status = "Active";
				break;
			case 3:
				status = "Accepted";
				con.query('SELECT * FROM queue WHERE offer_id= ?', [offerTradeId], function(err, row) {
					if (err) console.log(err);
					else setCoins(row[0].userioprice,row[0].botoprice,row[0].deposit,row[0].userid);
				}); 
				break;
			case 4:
				status = "Countered";
				con.query('SELECT * FROM queue WHERE offer_id= ?', [offerTradeId], function(err, row) {
					if (err) console.log(err);
					else if (row[0].deposit == 0) setCoins(row[0].userioprice,row[0].botoprice,row[0].deposit,row[0].userid);
				}); 
				break;
			case 5:
				status = "Expired";
				break;
			case 6:
				status = "Canceled";
				break;
			case 7:
				status = "Declined";
				con.query('SELECT * FROM queue WHERE offer_id= ?', [offerTradeId], function(err, row) {
					if (err) console.log(err);
					else if (row[0].deposit == 0) setCoins(row[0].userioprice,row[0].botoprice,row[0].deposit,row[0].userid);
				});
				break;
			case 8:
				status = "InvalidItems";
				con.query('SELECT * FROM queue WHERE offer_id= ?', [offerTradeId], function(err, row) {
					if (err) console.log(err);
					else if (row[0].deposit == 0) setCoins(row[0].userioprice,row[0].botoprice,row[0].deposit,row[0].userid);
				}); 
				break;
			case 9:
				status = "CreatedNeedsConfirmation";
				break;
			case 10:
				status = "CanceledBySecondFactor";
				break;
			case 11:
				status = "InEscrow";
		}
	function setCoins(userioprice,botoprice,deposit,userid) {
		if(deposit ==1){
			con.query('SELECT * FROM users WHERE steamid= ?', [userid], function(err, row){
				if (err)console.log(err);
				else{
					var a = parseInt( row[0].Coins);
					var b = parseInt( row[0].CoinsTotal);
					var newcoins = Math.round(a)+Math.round((userioprice *1000));
					var newtotalcoins= Math.round(b) + Math.round((userioprice *1000));
					con.query('UPDATE users SET `Coins`=\''+newcoins+'\', `CoinsTotal`=\''+newtotalcoins+'\'WHERE steamid= ?', [userid], function(err) {
						if (err) console.log(err);
					});
				}
			});
		}else{
			con.query('SELECT * FROM users WHERE steamid= ?', [userid], function(err, row){
				if (err) console.log(err);
				else{
					var a = parseInt( row[0].Coins);
					var b = parseInt( row[0].CoinsWithdrawed);	
					var newcoins = Math.round(a)+Math.round((botoprice *1000));
					var newtotalcoins= Math.round(b) - Math.round((botoprice *1000));
					con.query('UPDATE users SET `Coins`=\''+newcoins+'\', `CoinsWithdrawed`=\''+newtotalcoins+'\' WHERE steamid= ?', [userid], function(err) {
						if (err) console.log(err);
					});
				}
			});												
		}
	}
	con.query('UPDATE queue SET status= ? WHERE offer_id= ?' , [status , offerTradeId], function(err) {if (err)console.log(err);});
	console.log('Offer.Changed: ', offerTradeId + " is now " + status);
});
community.on('debug', console.log);
manager.on('receivedOfferChanged', function(offer, oldState) {
	console.log(`Offer #${offer.id} changed: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);
	if (offer.state == TradeOfferManager.ETradeOfferState.Accepted) {
		offer.getReceivedItems(function(err, items) {
			if (err) console.log("Couldn't get received items: " + err);
			else {
				var names = items.map(function(item) {
						return item.name;
				});
				console.log("Received: " + names.join(', '));
			}
		});
	}
});

process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
  process.send({ counter: counter++ });
}, 1000);


//Copyrighted by sazone.LT created by alphaawper aka Nedas. 