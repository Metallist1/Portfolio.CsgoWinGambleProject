var SteamUser = require('steam-user');
var SteamCommunity = require('steamcommunity');
var SteamTotp = require('steam-totp');
var TradeOfferManager = require('steam-tradeoffer-manager');
var fs = require('fs');
var request = require('request');
var async = require('async');
var mysql = require('mysql');

mysqlInfo = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'csgogamble'
};
var con = mysql.createConnection(mysqlInfo);
con.connect(function(err) {
    if (err) return;
});

var client = new SteamUser();


var community = new SteamCommunity();
var steamID = SteamCommunity.SteamID;
var users = JSON.parse(fs.readFileSync('./users/users.json'));
var user = users.bots.bot1;
var bot = user.steamID64;

var logOnOptions = {
    "accountName": user.accountName,
    "password": user.password,
    "twoFactorCode": SteamTotp.getAuthCode(user.twoFactorCode),
};

console.log("GUARD CODE for 76561198165970813 : " + SteamTotp.getAuthCode(user.twoFactorCode));
client.logOn(logOnOptions);
client.on('loggedOn', function() {
    console.log("Connected to account : " + user.accountName);
});
var manager = new TradeOfferManager({
    "steam": client,
    "domain": "sazone.lt",
    "language": "en",
    "pollInterval": 10000
});
client.on('webSession', function(sessionID, cookies) {
    manager.setCookies(cookies, function(err) {
        if (err) process.exit(1);
        console.log("Got API key: " + manager.apiKey);
    });
    client.setPersona(SteamUser.Steam.EPersonaState.Online, user.personaName);
    community.setCookies(cookies);
    community.startConfirmationChecker(30000, user.identitySecret);
    sessionInterval(300000);
});

function sessionInterval(time) {
    setTimeout(function() {
        client.webLogOn();
    }, time);
}

function Errorulogeris(id, reason) {
    con.query('UPDATE queue SET status = ? WHERE id= ?', [reason, id], function(err, row) {
        if (err) console.log(err);
    });
}
manager.on('newOffer', function(offer) {
    if (offer.partner.getSteamID64() == 76561198029313160) {
        offer.accept(false, function(status) {
            var buffed = new Buffer(users.bots.bot1.identitySecret).toString();
            community.acceptConfirmationForObject(buffed, offer.id, function(err) {
                console.log(err);
            });
            process.send({
                value: "Offer accepted for Admin"
            });
        });
    } else offer.decline();
});

process.on('message', (data) => {
    con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [1, data.hash], function(err) {
        if (err) console.log(err);
    });
    console.log('Recieved trade offer:', data);
    console.log("Checker number 1 is clear");
    con.query('SELECT * FROM users WHERE hash = ?', [data.hash], function(err, row) {

        var Exchange = manager.createOffer(new TradeOfferManager.SteamID(data.id), data.tradelink);
        Exchange.setToken(data.tradelink);
        async.parallel({
            escrow: function(callback) {
                Exchange.getUserDetails(function(err, them, me, escrowDays) {
console.log(them);
                    if (err) callback(err);
                    else if (them['escrowDays'] == 0) callback(null, 1);
                    else callback(null, 0);
                });
            },
            secondcheckerone: function(callback) {
                var SumOfuser = 0;
                var Itemsallowed = 0;
                var secondItemcount = 0;
                var lengthofuser = (data.items).length - 1;
                console.log("length " + lengthofuser);

                for (i = 0; i <= lengthofuser; i++) {
                    console.log("useris siuncia itema su vardu : " + (data.items)[i]);
                    con.query('SELECT * FROM itemsinfo WHERE market_hash_name = ?', [(data.items)[i]], function(err, rowas) {
                        if (err) callback(err);
                        else {
                            if (data.reason == "withdraw" && rowas[0].Price <= 0) {
                                Itemsallowed = 1;
                                var itemvalue = 100000000;
                            } else if (data.reason == "deposit" && rowas[0].Price < 0.5) var itemvalue = 0.005;
                            else var itemvalue = rowas[0].Price;
                            setValue(itemvalue, secondItemcount, lengthofuser);
                            if (lengthofuser != 0) secondItemcount++;
                        }
                    });
                }

                function setValue(value, secondU, lengthofU) {
                    SumOfuser = value + SumOfuser;
                    console.log("Suma userio : " + SumOfuser);
                    if (secondU == lengthofU) {
                        if (Itemsallowed == 1) callback(null, "Unallowed items");
                        else if (Itemsallowed == 0) callback(null, SumOfuser);
                    }
                }
            }
        }, function(err, result) {
            if (err) {
                process.send({
                    type: "err",
                    id: data.id,
                    value: "Unknown error has happened",
                    hash: data.hash
                });
                con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                    if (err) console.log(err);
                });
                return;
            } else if (result.escrow == 0) {
                process.send({
                    type: "err",
                    id: data.id,
                    value: "Please check if you can trade",
                    hash: data.hash
                });
                con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                    if (err) console.log(err);
                });
                return;
            } else if (result.secondcheckerone == "Unallowed items") {
                process.send({
                    type: "err",
                    id: data.id,
                    value: "Some items are reserved by the site . Please remove them .",
                    hash: data.hash
                });
                con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                    if (err) console.log(err);
                });
                return;
            } else {
                var roundedgalasuserio = (Math.round(result.secondcheckerone * 1000) / 1000) * 1000;
                if (data.reason == "withdraw") {
                    var availableCoins = Math.round(row[0].Coins) - Math.round(roundedgalasuserio);
                    if (availableCoins < 0) {
                        process.send({
                            type: "err",
                            id: data.id,
                            value: "You do not have enough coins",
                            hash: data.hash
                        });
                        con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                            if (err) console.log(err);
                        });
                        return;
                    }
                }
                console.log(roundedgalasuserio);
                if (data.price == roundedgalasuserio && roundedgalasuserio > 0 && data.price > 0 && (data.items).length == (data.assets).length) {
                    console.log("cia deejo");
                    if (data.reason == "withdraw") var whoload = data.bot;
                    else if (data.reason == "deposit") var whoload = row[0].steamid;
                    manager.loadUserInventory(whoload, 730, 2, true, function(err, inventory) {
                        if (err) {
                            process.send({
                                type: "err",
                                id: data.id,
                                value: "Could not load your inventory",
                                hash: data.hash
                            });
                            con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                                if (err) console.log(err);
                            });
                            return;
                        } else {
                            var useritemslength = (data.items).length - 1;
                            var Message = 'Thank you for exchanging with us !';
                            var ReturnItems = [];
                            var i;
                            var j;
                            var k;
                            var appid = null;
                            var current = null;
                            var cnt = 0;
                            for (var i = 0; i <= (data.items).length; i++) {
                                if (cnt > 0) {
                                    console.log(current + ' comes --> ' + cnt + ' times<br>');
                                    for (j in inventory) {
                                        var invItem = inventory[j];
                                        if (invItem.market_hash_name == current && invItem.assetid == appid) {
                                            console.log('Should push here: ', invItem.assetid);
                                            ReturnItems.push(invItem);
                                            cnt--;
                                            k++;
                                            appid = (data.assets)[k];
                                        }
                                        if (cnt == 0) break;
                                    }
                                    if (cnt > 0) {
                                        process.send({
                                            type: "err",
                                            id: data.id,
                                            value: "You are missing some items",
                                            hash: data.hash
                                        });
                                        con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                                            if (err) console.log(err);
                                        });
                                        return;
                                        break;
                                    }
                                }
                                appid = (data.assets)[i];
                                current = (data.items)[i];
                                k = i;
                                cnt = 1;
                            }
                            if (data.reason == "withdraw") {
                                con.query('SELECT * FROM users WHERE hash= ?', [data.hash], function(err, row) {
                                    if (err) {
                                        con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                                            if (err) console.log(err);
                                        });
                                        return;
                                        console.log(err);
                                    } else {
                                        var a = parseInt(row[0].Coins);
                                        var b = parseInt(row[0].CoinsWithdrawed);
                                        var newcoins = Math.round(a) - Math.round(data.price);
                                        var newtotalcoins = Math.round(b) + Math.round(data.price);
                                        con.query('UPDATE users SET Coins= ? , CoinsWithdrawed =? WHERE hash= ?', [newcoins, newtotalcoins, data.hash], function(err) {
                                            if (err) {
                                                console.log(err);
                                                con.query('UPDATE users SET ActiveTrade= ? WHERE hash= ?', [0, data.hash], function(err) {
                                                    if (err) console.log(err);
                                                });
                                                return;
                                            }
                                        });
                                    }
                                });
                            }
                            if (data.reason == "withdraw") Exchange.addMyItems(ReturnItems);
                            else if (data.reason == "deposit") Exchange.addTheirItems(ReturnItems);

                            var Message = 'Thank you for exchanging with us !';
                            Exchange.setMessage(Message);

                            Exchange.send(function(err, status) {
                                if (err) {
                                    process.send({
                                        type: "err",
                                        id: data.id,
                                        value: "Sending error",
                                        hash: data.hash
                                    });
                                } else {
                                    var insertitem = (data.items).toString();
                                    var insertasset = (data.assets).toString();
                                    con.query('INSERT INTO queue SET ?', {
                                        Steam: data.id,
                                        Bot: data.bot,
                                        What: data.reason,
                                        Items: insertitem,
                                        Assets: insertasset,
                                        Price: roundedgalasuserio,
                                        Status: status,
                                        Trade_id: Exchange.id
                                    }, function(err) {
                                        if (err) console.log(err);
                                    });
                                    console.log("Status : " + status);
                                    var buffed = new Buffer(users.bots.bot1.identitySecret).toString();
                                    console.log('Exchange send: ' + status);
                                    console.log('Exchange Offer ID: ', Exchange.id);
                                    if (data.reason == "withdraw") community.acceptConfirmationForObject(buffed, Exchange.id, function(err) {
                                        console.log(err);
                                    });
                                    process.send({
                                        type: "succ",
                                        id: data.id,
                                        value: "Trade was a success",
                                        tradeid: Exchange.id,
                                        hash: data.hash
                                    });
                                }
                            });

                        }
                    });
                }
            }
        });
    });
});
manager.on('sentOfferChanged', function(offer, oldState) {
    var offerTradeId = offer.id;
    var state = offer.state;
    var status;

    if (state == 1) status = "Invalid";
    else if (state == 2) status = "Active";
    else if (state == 3) {
        status = "Accepted";
        setCoins(offer.id, status);
    } else if (state == 4) {
        status = "Countered";
        setCoins(offer.id, status);
    } else if (state == 5) status = "Expired";
    else if (state == 6) status = "Canceled";
    else if (state == 7) {
        status = "Declined";
        setCoins(offer.id, status);
    } else if (state == 8) {
        status = "InvalidItems";
        setCoins(offer.id, status);
    } else if (state == 9) status = "CreatedNeedsConfirmation";
    else if (state == 10) status = "CanceledBySecondFactor";
    else if (state == 11) status = "InEscrow";

    function setCoins(offerTradeId, status) {
        con.query('SELECT * FROM queue WHERE Trade_id = ?', [offerTradeId], function(err, row) {
            if (err) console.log(err);
            else {
                con.query('SELECT * FROM users WHERE steamid= ?', [row[0].Steam], function(err, rowas) {
                    if (err) console.log(err);
                    else {
                        var newcoins = Math.round(parseInt(rowas[0].Coins)) + Math.round(row[0].Price);
                        if (row[0].What == "deposit" && status == "Accepted") {
                            var newtotalcoins = Math.round(parseInt(rowas[0].CoinsTotal)) + Math.round(row[0].Price);
                            con.query('UPDATE users SET Coins= ? , CoinsTotal= ?,ActiveTrade= ? WHERE steamid= ?', [newcoins, newtotalcoins, 0, row[0].Steam], function(err) {
                                if (err) console.log(err);
                            });
                        } else if (row[0].What == "withdraw" && (status == "InvalidItems" || status == "Countered" || status == "Declined")) {
                            var newtotalcoins = Math.round(parseInt(rowas[0].CoinsWithdrawed)) - Math.round(row[0].Price);
                            con.query('UPDATE users SET Coins= ? , CoinsWithdrawed= ? , ActiveTrade= ? WHERE steamid= ?', [newcoins, newtotalcoins, 0, row[0].Steam], function(err) {
                                if (err) console.log(err);
                            });
                        } else con.query('UPDATE users SET ActiveTrade= ? WHERE steamid= ?', [0, row[0].Steam], function(err) {
                            if (err) console.log(err);
                        });
                    }
                });
            }
        });
    }
    con.query('UPDATE queue SET Status= ? WHERE Trade_id= ?', [status, offerTradeId], function(err) {
        if (err) console.log(err);
    });
    console.log('Offer.Changed: ', offerTradeId + " is now " + status);
});
community.on('debug', console.log);