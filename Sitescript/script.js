"use strict";


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var async = require('async');
var sha256 = require('sha256')
const request = require('request');

var mysqlInfo;
var time = -1;
var betTime = 3000;
var AnimationTime = 1500;
var pause = false;
var maxbet = 5000000;
var minbet = 1;
var betlimit = 2;
var roundID = 1;
var hash = '';
var ticket = '';
var mod = 14;
var modR = 2;
var realroll = "";
var history = [];
var historylimit = 40;
var systemavatar = "http://cdn.edgecast.steamstatic.com/steamcommunity/public/images/avatars/78/788efef2ca9f6af820c551a69fcbcedcc09b5b0b.jpg";
var systemuser = "CsgoWin.GG System";
var chatlimit = 500; //coins limitas
var chattimelimit = 12000;
var mutetime = 600;
var sendlimit = 10000;
var reffcoins = 500;
var reffcoinslimit = 2000;
var freecoins = 20;
var freecoinslimit = 1000;
var dailycooldown = 1;
var clients = [];
var steammusers = [];
var activebots = ["76561198354714728"];
//bot activation.

var childProcess = require('child_process');
var fsss = [];

for (var i = 0; i < activebots.length; i++) {
    fsss[i + 1] = childProcess.fork('./' + activebots[i] + '.js');
    fsss[i + 1].on('message', function(m) {
        var indexas = steammusers.indexOf(m.hash);
        if (indexas > -1) {
            if (m.type == "err") {
                console.log('Site got a reply :', m)

                io.sockets.in(steammusers[indexas]).emit('response', {
                    data: "erro",
                    who: "Trade",
                    value: m.value
                });
            } else {
                console.log('Site got a reply :', m);
                io.sockets.in(steammusers[indexas]).emit('response', {
                    data: "Success",
                    who: "Trade",
                    value: m.tradeid
                });
            }
        }
    });
}

mysqlInfo = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'csgogamble'
};
var con = mysql.createConnection(mysqlInfo);
con.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to database');
});
getHash();
Clock();

function getHash() {
    con.query('SELECT * FROM `hash` ORDER BY `id` DESC LIMIT 1', function(err, row) {
        if (err) {
            console.log('Cant get the hash.');
            process.exit(0);
        }
        if (row.length == 0) {
            console.log('No hash, creating new hash');
            var newhash = createHash();
            hash = newhash;
            console.log('Restart the script');
        } else {
            if (hash != row[0].hash) {
                console.log('Loaded hash ' + row[0].hash);
                console.log('Loaded ticket ' + row[0].ticket);
                hash = row[0].hash;
                ticket = row[0].ticket;
            } else {
                var newhash = createHash();
                hash = newhash;
            }
        }
    });
}
var day = 1000 * 60 * 60 * 24;
setInterval(function() {
    createHash();
}, day);

var minute = 1000 * 60 * 3;
setInterval(function() {
    checkbots();
}, minute);
checkbots();

function checkbots() {

    request({
        uri: "http://www.csgowin.gg/overflowup.php",
        method: "POST",
        form: {
            who: activebots,
            auth: "authenticated",
        }
    }, function(error, response, body) {
        console.log(body);
    });
}

function createHash() {
    var loto = getRandomInt(1000000000, 9888888887);
    var nohash = getRandomInt(1000000000, 9888888887);
    var prepared = nohash.toString();
    var hashed = sha256(prepared);
    con.query('INSERT INTO hash SET ?', {
        hash: hashed,
        ticket: loto
    }, function(err) {
        if (err) console.log(err);
    });
    roundID = 1;
    hash = hashed;
    ticket = loto;
    getHash();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Clock() {
    if (time <= -1 || pause == false) {
        time = betTime + AnimationTime;
        var timer = setInterval(function() {
            //console.log('Timer: '+ time +' Site timer: '+( time-AnimationTime));
            if (time == AnimationTime) {
                rollingWin();
            }
            if (time == 1300) {
                io.emit('response', {
                    data: "Inroll",
                    value: realroll
                });
            }
            if (time == 500) {
                var newLength = clients.length;
                for (i = 0; i < newLength; i++) {
                    io.sockets.in(clients[i]).emit('response', {
                        data: "balancecheck"
                    });
                }
                clients = [];
                io.emit('response', {
                    data: "EndRoll",
                    value: realroll
                });
                io.emit('response', {
                    data: "HistoryUP",
                    value: history
                });
            }
            if (time == 0) {
                if (pause == true) {
                    stopTime();
                } else {
                    console.log('New roll starting');
                    time = betTime + AnimationTime;
                    io.emit('response', {
                        data: "NewRoll",
                        value: betTime
                    });
                    io.emit('response', {
                        data: "HistoryUP",
                        value: history
                    });
                }
            }
            time--;
        }, 10);
    }
}

function stopTime() {
    clearInterval(timer);
}

function rollingWin() {
    var win = "none";
    var preparing = hash.concat(ticket, roundID);
    var prepared = sha256(preparing);
    var substringed = prepared.substr(0, 8);
    var roll = parseInt(substringed, 16);
    realroll = roll % 15;
    if (realroll > 0 && realroll < 8) win = "red";
    else if (realroll >= 8) win = "black";
    else if (realroll == 0) win = "green";
    if (history.length >= historylimit) {
        history.push(realroll);
        history.shift();
    } else history.push(realroll);
    con.query('INSERT INTO rolls SET ?', {
        roll: realroll,
        hash: hash,
        ticket: ticket,
        rollnumber: roundID,
        color: win
    }, function(err) {
        if (err) console.log(err);
    });
    con.query('SELECT * FROM `bets` WHERE `hash` = ? AND `colour` = ? AND `round` = ?', [hash, win, roundID], function(err, row) {
        if (err) console.log(err);
        else {
            var x = 0;
            var loopArray = function(row) {
                if (row.length != 0) {
                    customAlert(row[x], function() {
                        x++;
                        if (x < row.length) {
                            loopArray(row);
                        }
                    });
                }
            }
            loopArray(row);
            function customAlert(msg, callback) {
                if (win == "green") var newCoins = parseFloat(msg.amount) * mod;
                else var newCoins = parseFloat(msg.amount) * modR;
                var userfinal = msg.user;
                console.log(msg.user);
                con.query('SELECT * FROM `users` WHERE `steamid` = ?', [userfinal], function(err, rowas) {
                    if (err) console.log(err);
                    else {
                        if (rowas[0].BiggestWin < newCoins) con.query('UPDATE users SET BiggestWin = ? WHERE `steamid`= ?', [newCoins, userfinal], function(err) {});
                        var newblance = parseFloat(rowas[0].Coins) + parseFloat(newCoins);
                        //console.log(userfinal + " won : " + newCoins );
                        con.query('UPDATE users SET Coins= ?,BetsWon= ? WHERE `steamid`= ?', [newblance, newCoins, userfinal], function(err) {
                            if (err) console.log(err);
                            else callback();
                        });
                    }
                });
            }
            con.query('UPDATE bets SET won = ? WHERE `hash` = ? AND `colour` = ? AND `round` = ?', ["1", hash, win, roundID], function(err) {
                if (err) console.log(err);
            });
            con.query('UPDATE bets SET winColour = ? WHERE `hash` = ? AND `round` = ?', [win, hash, roundID], function(err) {
                if (err) console.log(err);
            });
            roundID++;
        }
    });
}
app.get('/', function(req, res) {
    res.send('No access');
});
io.on('connection', function(socket) {
    socket.emit('response', {
        data: "NewRoll",
        value: time - AnimationTime
    });
    socket.emit('response', {
        data: "HistoryUP",
        value: history
    });
    var logedin = false;
    var username;
    var avatar;
    var hashing;
    var totalcoins;
    var offsetcurrent = 0;
    var chattime = false;
    socket.emit('response', {
        data: "chat message",
        id: systemuser,
        avatar: systemavatar,
        value: "Rules :<br>1. Minimum bet : 1 coin.<br>2. Maximum bet: 5,000,000 coins.<br>3. Maximum bets per roll: 2 bets. <br>4. Chat cooldown: 10 sec.<br>5. To unlock chat : bet 500 coins in total.<br>6. Respect your fellow player."
    });
    socket.on('functioncall', function(data) {
console.log("bump");
        if (data.info == "login") {
            con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                if ((err) || (!row.length)) socket.emit('response', {
                    data: "chat message",
                    id: systemuser,
                    avatar: systemavatar,
                    value: "You need to log on"
                });
                else {
                    function isValid(str) {
                        return !/[<>]/g.test(str);
                    }
                    logedin = row[0].steamid;
                    var balance = row[0].Coins;
                    if (isValid(row[0].name) == false) {
                        username = (row[0].name).replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    } else username = row[0].name;
                    totalcoins = row[0].CoinsBetTotal;
                    avatar = row[0].avatar;
                    hashing = data.hash;
                    socket.emit('response', {
                        data: "balance",
                        value: balance
                    });
                    socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You succesfully logged on"
                    });
                    var index = steammusers.indexOf(hashing);
                    if (index <= -1) {
                        steammusers.push(row[0].hash);
                        socket.join(row[0].hash);
                    }
                }
            });
        } else if (data.info == "balanceUP") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You need to log on"
                    });
                    else {
                        if (time < 500 || time > 1300) {
                            var balance = row[0].Coins;
                            totalcoins = row[0].CoinsBetTotal;
                            socket.emit('response', {
                                data: "balance",
                                value: balance
                            });
                        }
                    }
                });
            } else socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "You need to log on"
            });
        } else if (data.info == "onlinecheck") {
            var Users = steammusers.length;
            io.emit('response', {
                data: "Online",
                value: Users
            });
            console.log('users online :' + Users);
        } else if (data.info == "chat message") {
            console.log('user: ' + logedin + " said " + data.msg);
            if (logedin == false || hashing != data.hash) socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "You need to log in"
            });
            else if (!(data.msg)) socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "Messages cannot be empty"
            });
            else if ((data.msg).length > 100) socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "Your message is too long"
            });
            else if (chattime == true) socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "Slow down , you are typing too fast"
            });
            else {
                function isValid(str) {
                    return !/[<>]/g.test(str);
                }

                function isValide(str) {
                    return !/[.]/g.test(str);
                }
                if (isValid(data.msg) == false || !(data.msg)) {
                    var unhtmled = (data.msg).replace(/</g, "&lt;").replace(/>/g, "&gt;");
                } else var unhtmled = (data.msg);

                if (isValide(data.msg) == false) unhtmled = unhtmled.replace(".com", " ").replace(".net", " ").replace("www.", " ").replace("http://", " ");

                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You need to log on"
                    });
                    else {
                        var Cbalance = row[0].Coins;

                        if (row[0].Admin == 1) {
                            var chatwho = "red";
                            var level = 1337;
                            var status = "ADMIN";
                        } else if (row[0].Chatmod == 1) {
                            var chatwho = "yellow";
                            var level = 666;
                            var status = "MOD";
                        } else {
                            var chatwho = "white";
                            if (row[0].CoinsBetTotal < 50000) var level = 0;
                            else var level = Math.floor(parseFloat(row[0].CoinsBetTotal) / 50000);
                            var status = "";
                        }  
                        var split = (data.msg).split(" ");
          if ( (row[0].CoinsBetTotal) < chatlimit) socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "Insufficient amount of bets for chatting. You need: " + totalcoins + "/" + chatlimit
            });
                       else if ((data.msg).startsWith("/")) {
                            switch (split[0]) {
                                case "/stop":
                                    if (chatwho == "red") {
                                        pause = true;
                                        io.emit('response', {
                                            data: "chat message",
                                            id: systemuser,
                                            avatar: systemavatar,
                                            value: "Next round will be paused"
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/start":
                                    if (chatwho == "red") {
                                        pause = false;
                                        setTimeout(function() {
                                            Clock();
                                        }, 5000);
                                        io.emit('response', {
                                            data: "chat message",
                                            id: systemuser,
                                            avatar: systemavatar,
                                            value: "Rounds will resume in 5 seconds"
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/stopH":
                                    if (chatwho == "red") {
                                        stopTime();
                                        io.emit('response', {
                                            data: "chat message",
                                            id: systemuser,
                                            avatar: systemavatar,
                                            value: "Website is paused , bets are suspended until furture notice."
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    activebots = [];
				    fsss= [];
                                    break;
                                case "/mod":
                                    if (chatwho == "red") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                                con.query('UPDATE users SET Chatmod= ? WHERE `steamid`= ?', [1, split[1]], function(err) {
                                                    if (err) console.log(err);
                                                });
                                                io.emit('response', {
                                                    data: "chat message",
                                                    id: systemuser,
                                                    avatar: systemavatar,
                                                    value: "Please congratulate " + row[0].name + " he is now an official chat mod on our great site"
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/unmod":
                                    if (chatwho == "red") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                                con.query('UPDATE users SET Chatmod= ? WHERE `steamid`= ?', [0, split[1]], function(err) {
                                                    if (err) console.log(err);
                                                });
                                                io.emit('response', {
                                                    data: "chat message",
                                                    id: systemuser,
                                                    avatar: systemavatar,
                                                    value: "Sad to see " + row[0].name + " go but he is no longer a chat mod on our great site"
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/mute":
                                    if (chatwho == "red" || chatwho == "yellow") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                               var created = new Date();
                                                created.setSeconds(created.getSeconds() + parseFloat(mutetime));
                                                var res = (data.msg).split('"');
                                                con.query('UPDATE users SET Mute= ?, muteend = ?, reason = ? WHERE `steamid`= ?', [1, created, res[1], split[1]], function(err) {
                                                    if (err) console.log(err);
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/chatban":
                                    if (chatwho == "red" || chatwho == "yellow") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                                var res = (data.msg).split('"');
                                                con.query('UPDATE users SET ChatBan= ?, reason = ? WHERE `steamid`= ?', [1, res[1], split[1]], function(err) {
                                                    if (err) console.log(err);
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/permaban":
                                    if (chatwho == "red") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                                var res = (data.msg).split('"');
                                                con.query('UPDATE users SET Ban= ?, reason = ? WHERE `steamid`= ?', [1, res[1], split[1]], function(err) {
                                                    if (err) console.log(err);
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/send":
                                    if (row[0].CsRes == 0) {
                                        if (typeof split[1] != "undefined" && split[1] != null && typeof split[2] != "undefined" && split[2] != null) {
                                            var pirmassplit = parseInt(split[1]);
                                            var antrassplit = parseInt(split[2]);
                                            if (totalcoins > sendlimit) {
                                                var balancesplit = parseFloat(Cbalance) - parseFloat(antrassplit);
                                                if (balancesplit >= 0 && row[0].Ban == 0) {
                                                    con.query('UPDATE users SET Coins= ? WHERE `hash`= ?', [balancesplit, data.hash], function(err) {
                                                        if (err) socket.emit('chat message', "Failed to send coins");
							else{
                                                   
                                                    con.query('SELECT * FROM `users` WHERE `steamid` = ?', [pirmassplit], function(err, row) {
                                                        if (err) console.log(err);
                                                        else if (!row.length) socket.emit('response', {
                                                            data: "chat message",
                                                            id: systemuser,
                                                            avatar: systemavatar,
                                                            value: "No such SteamID"
                                                        });
                                                        else {
                                                            var postsent = parseFloat(antrassplit) + parseFloat(row[0].Coins);
                                                            con.query('UPDATE users SET Coins= ? WHERE `steamid`= ?', [postsent, pirmassplit], function(err) {
                                                                if (err) socket.emit('response', {
                                                                    data: "chat message",
                                                                    id: systemuser,
                                                                    avatar: systemavatar,
                                                                    value: "Failed to send coins"
                                                                });
                                                                else socket.emit('response', {
                                                                    data: "chat message",
                                                                    id: systemuser,
                                                                    avatar: systemavatar,
                                                                    value: antrassplit + " amount of coins have been sent to " + pirmassplit
                                                                });
                                                            });
                                                        }
                                                    });
}
 });
                                                } else socket.emit('response', {
                                                    data: "chat message",
                                                    id: systemuser,
                                                    avatar: systemavatar,
                                                    value: "Not enough coins"
                                                });
                                            } else socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "Insufficient amount of bets for sending. You need: " + totalcoins + "/" + sendlimit
                                            });
                                        } else socket.emit('response', {
                                            data: "chat message",
                                            id: systemuser,
                                            avatar: systemavatar,
                                            value: "Unknown command"
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "This function is only available to people who played 20 hours of cs"
                                    });
                                    break;
                                case "/sendADMIN":
                                    if (chatwho == "red") {
                                        con.query('SELECT * FROM `users` WHERE `steamid` = ?', [split[1]], function(err, row) {
                                            if (err) console.log(err);
                                            else if (!row.length) socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "No such SteamID"
                                            });
                                            else {
                                                var postsent = parseFloat(split[2]) + parseFloat(row[0].Coins);
                                                con.query('UPDATE users SET Coins= ? WHERE `steamid`= ?', [postsent, split[1]], function(err) {
                                                    if (err) socket.emit('response', {
                                                        data: "chat message",
                                                        id: systemuser,
                                                        avatar: systemavatar,
                                                        value: "Failed to send coins"
                                                    });
                                                    else socket.emit('response', {
                                                        data: "chat message",
                                                        id: systemuser,
                                                        avatar: systemavatar,
                                                        value: split[2] + " amount of coins have been sent to " + split[1]
                                                    });
                                                });
                                            }
                                        });
                                    } else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                case "/get":
                                    if (chatwho == "red") con.query('UPDATE users SET Coins= ? WHERE `hash`= ?', [500000, data.hash], function(err) {
                                        if (err) console.log(err);
                                    });
                                    else socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                                    break;
                                default:
                                    socket.emit('response', {
                                        data: "chat message",
                                        id: systemuser,
                                        avatar: systemavatar,
                                        value: "No such command"
                                    });
                            }
                        } else if (row[0].Mute == 1) {
                           var ended = new Date();
                            if (row[0].muteend > ended) {
                                socket.emit('response', {
                                    data: "chat message",
                                    id: systemuser,
                                    avatar: systemavatar,
                                    value: "You were muted for " + mutetime + " seconds .<br> Calm down for now ."
                                });
                            } else if (row[0].muteend < ended) {
                                socket.emit('response', {
                                    data: "chat message",
                                    id: systemuser,
                                    avatar: systemavatar,
                                    value: "Congrats you have been unmuted .Your next message will be shown so do not get into trouble again."
                                });
                                con.query('UPDATE users SET Mute= ? WHERE `steamid`= ?', [0, logedin], function(err) {
                                    if (err) console.log(err);
                                });
                            }
                        } else if (row[0].ChatBan == 1) socket.emit('response', {
                            data: "chat message",
                            id: systemuser,
                            avatar: systemavatar,
                            value: "Shhh you hear that ?<br> Thats the sound of you not being able to use chat anymore"
                        });
                        else if (row[0].Ban == 1) socket.emit('response', {
                            data: "chat message",
                            id: systemuser,
                            avatar: systemavatar,
                            value: "<br>I will make sure to pass your messages to the admins.<br>But they probably do not care about you anyway."
                        });
                        else {
                            io.emit('response', {
                                data: "chat message",
                                id: username,
                                steam: logedin,
                                avatar: avatar,
                                value: unhtmled,
                                color: chatwho,
                                level: level,
                                status: status
                            });
                            chattime = true;
                            setTimeout(function() {
                                chattime = false
                            }, chattimelimit);
                        }
                    }
                });
            }
        } else if (data.info == "bet") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
var parsedinteger = parseInt(data.value);
                var betValue = Math.round(parsedinteger );
                if (time > AnimationTime) {
                    if (betValue >= minbet && betValue <= maxbet && betValue && /^[a-zA-Z0-9-\s ]*$/.test(parsedinteger) != false) {
                        if (data.colour == "black" || data.colour == "red" || data.colour == "green") {
                            con.query('SELECT * FROM `bets` WHERE `hash` = ? AND `user` = ? AND `round` = ?', [hash, logedin, roundID], function(err, row) {
                                if (err) console.log(err);
                                else if (row.length >= betlimit) socket.emit('response', {
                                    data: "chat message",
                                    id: systemuser,
                                    avatar: systemavatar,
                                    value: "You already placed " + row.length + "/" + betlimit + " bets"
                                });
                                else {
                                    var justplaced = row.length + 1;
                                    con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                                        if (err) console.log(err);
                                        else {
                                            var newBetsPlaced = parseFloat(row[0].BetsPlaced) + 1;
                                            var newbalance = parseFloat(row[0].Coins) - parseFloat(betValue);
                                            var anotherbetvalue = parseFloat(betValue);
                                            var name = (row[0].name).toLowerCase();
                                            name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                            var test = name.indexOf("csgowin.gg");
                                            var timebetted = new Date();
                                            if (test !== -1) anotherbetvalue = anotherbetvalue * 1.1;
                                            var newbetbalance = parseFloat(row[0].CoinsBetTotal) + anotherbetvalue;
                                            if (newbalance >= 0) {
                                                if (row[0].BiggestBet < betValue) con.query('UPDATE users SET BiggestBet = ? WHERE `hash`= ?', [betValue, data.hash], function(err) {});

                                                con.query('UPDATE users SET BetsPlaced= ? WHERE `hash`= ?', [newBetsPlaced, data.hash], function(err) {
                                                    if (err) console.log(err);
                                                });
                                                con.query('UPDATE users SET Coins= ?,CoinsBetTotal= ? WHERE `hash`= ?', [newbalance, newbetbalance, data.hash], function(err) {
                                                    if (err) console.log(err);
else{
                                                con.query('INSERT INTO bets SET ?', {
                                                    user: logedin,
                                                    round: roundID,
                                                    won: 0,
                                                    amount: betValue,
                                                    colour: data.colour,
                                                    placedbet: timebetted,
                                                    hash: hash
                                                }, function(err) {
                                                    if (err) console.log(err);
                                                    else {
                                                        clients.push(row[0].steamid);
                                                        socket.join(row[0].steamid);
                                                        socket.emit('response', {
                                                            data: "chat message",
                                                            id: systemuser,
                                                            avatar: systemavatar,
                                                            value: "You placed " + justplaced + "/" + betlimit + " bets"
                                                        });
                                                        socket.emit('response', {
                                                            data: "balance",
                                                            value: newbalance
                                                        });
                                                        io.emit('response', {
                                                            data: "color",
                                                            steamid: row[0].steamid,
                                                            id: username,
                                                            avatar: avatar,
                                                            value: betValue,
                                                            colour: data.colour
                                                        });
                                                        io.emit('response', {
                                                            data: "betUp",
                                                            value: betValue,
                                                            colour: data.colour
                                                        });
                                                        socket.emit('response', {
                                                            data: "colorUp",
                                                            value: betValue,
                                                            colour: data.colour
                                                        });
                                                    }
                                                });
}
 });
                                            } else socket.emit('response', {
                                                data: "chat message",
                                                id: systemuser,
                                                avatar: systemavatar,
                                                value: "You do not have enough coins"
                                            });
                                        }
                                    });
                                }
                            });
                        } else socket.emit('response', {
                            data: "chat message",
                            id: systemuser,
                            avatar: systemavatar,
                            value: "Sorry , im kinda color blind , but did you just try to insert" + data.colour + " ? "
                        });
                    } else socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "Invaldi bet"
                    });
                } else socket.emit('response', {
                    data: "chat message",
                    id: systemuser,
                    avatar: systemavatar,
                    value: "You cannot place bets during rolls"
                });
            } else socket.emit('response', {
                data: "chat message",
                id: systemuser,
                avatar: systemavatar,
                value: "You need to log in"
            });
        } else if (data.info == "affiliatesUpdate") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You need to log on"
                    });
                    else {
                        if (row[0].CsRes == 0) {
                            var reff = row[0].referral;
                            var code = row[0].defultreferal;
                            var coinreddem = row[0].nonreferal;
                            var coinreddemasssss = row[0].Coins;
                            var coinstbh = 0;
                            var valiable = 0;
                            if (reff < 50) {
                                var procc = 0.033;
                                var lvl = 0;
                            } else if (reff >= 50 && reff <= 100) {
                                var procc = 0.044;
                                var lvl = 1;
                            } else {
                                var procc = 0.055;
                                var lvl = 2;
                            }
                            con.query('SELECT * FROM `users` WHERE ownreferal= ? AND CoinsBetTotal >= ? ', [logedin, reffcoinslimit], function(err, row) {
                                if (err) socket.emit('response', {
                                    data: "chat message",
                                    id: systemuser,
                                    avatar: systemavatar,
                                    value: "You need to log on"
                                });
                                else {
                                    for (var x = 0; x < row.length; x++) {
                                        valiable++;
                                        coinstbh = parseFloat(coinstbh) + parseFloat(row[x].CoinsBetTotal);
                                    }
                                    var intotal = coinstbh * procc;
                                    var intotall = Math.round(parseFloat(intotal) - parseFloat(coinreddem));
                                    if (data.additionalinfo == "redeem" && intotall > 0) {
                                        var nonref = parseFloat(intotall) + parseFloat(coinreddem);
                                        var newcoins = parseFloat(coinreddemasssss) + parseFloat(intotall);
                                        con.query('UPDATE users SET Coins= ?,nonreferal= ? WHERE `hash`= ?', [newcoins, nonref, data.hash], function(err) {
                                            if (err) console.log(err);
                                        });
                                        socket.emit('response', {
                                            data: "affiliateUP",
                                            crr: code,
                                            amout: reff,
                                            realamout: valiable,
                                            reddem: 0,
                                            lvl: lvl
                                        });
                                    } else if (data.additionalinfo == "affiliatecode") {
                                        if (data.value && (data.value).length >= 4 && (data.value).length <= 14 && /^[a-zA-Z0-9-\s ]*$/.test(data.value) != false && (data.value).indexOf(' ') === -1) {
                                            con.query('SELECT * FROM `users` WHERE `defultreferal` = ?', [data.value], function(err, row) {
                                                if (err) console.log(err);
                                                else if (!row.length) {
                                                    con.query('UPDATE users SET defultreferal= ? WHERE `hash`= ?', [data.value, data.hash], function(err) {
                                                        if (err) console.log(err);
                                                        else {
                                                            socket.emit('response', {
                                                                data: "Success",
                                                                who: "AF",
                                                                value: "You updated your code"
                                                            });
                                                            socket.emit('response', {
                                                                data: "affiliateUP",
                                                                crr: data.value,
                                                                amout: reff,
                                                                realamout: valiable,
                                                                reddem: intotall,
                                                                lvl: lvl
                                                            });
                                                        }
                                                    });
                                                } else socket.emit('response', {
                                                    data: "erro",
                                                    who: "AF",
                                                    value: "Such code already exists , try another one"
                                                });
                                            });
                                        } else socket.emit('response', {
                                            data: "erro",
                                            who: "AF",
                                            value: "Invalid code format. Minimum code length is 4 characters . Maximum 14 characters"
                                        });
                                    } else socket.emit('response', {
                                        data: "affiliateUP",
                                        crr: code,
                                        amout: reff,
                                        realamout: valiable,
                                        reddem: intotall,
                                        lvl: lvl
                                    });
                                }
                            });
                        } else socket.emit('response', {
                            data: "erro",
                            who: "AF",
                            value: "This function is only available if you played cs for 20 hours"
                        });
                    }
                });
            } else socket.emit('response', {
                data: "erro",
                who: "AF",
                value: "You need to log in"
            });
        } else if (data.info == "HistoryCheck") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You need to log on"
                    });
                    else {
                        var totalbetamount = row[0].CoinsBetTotal;
                        var totalbetwon = row[0].BetsWon;
                        var largestbet = row[0].BiggestBet;
                        var largestwin = row[0].BiggestWin;
                        var totalbets = row[0].BetsPlaced;
                        var winningbet = "";
                        var alluserbets = [];
                        if (data.additionalinfo == "next") {
                            offsetcurrent = offsetcurrent + 50;
                            if (offsetcurrent > row[0].BetsPlaced && row[0].BetsPlaced <= 50) offsetcurrent = 0;
                            else if (offsetcurrent > row[0].BetsPlaced && row[0].BetsPlaced > 50) offsetcurrent = parseFloat(row[0].BetsPlaced) - 50;
                        } else if (data.additionalinfo == "previous") {
                            offsetcurrent = offsetcurrent - 50;
                            if (offsetcurrent < 0) offsetcurrent = 0;
                        } else offsetcurrent = 0;
                        con.query('SELECT * FROM `bets` WHERE user = ? ORDER BY `id` DESC LIMIT 50 OFFSET ?', [row[0].steamid, offsetcurrent], function(err, row) {
                            if (err) socket.emit('response', {
                                data: "chat message",
                                id: systemuser,
                                avatar: systemavatar,
                                value: "You need to log on"
                            });
                            else {
                                var newwonamount = 0;
                                for (var x = 0; x < row.length; x++) {
                                    if ((row[x].colour == "red" || row[x].colour == "black") && row[x].won == 1) newwonamount = parseFloat(row[x].amount) * 2;
                                    else if (row[x].colour == "green" && row[x].won == 1) newwonamount = parseFloat(row[x].amount) * 14;
                                    if (newwonamount == 0) newwonamount = -Math.abs(row[x].amount);
                                    var d = new Date(row[x].placedbet).toISOString().slice(0, 19).replace('T', ' ');
                                    var jsonObj = {
                                        roundid: row[x].round,
                                        betid: row[x].id,
                                        time: d,
                                        bet: row[x].colour,
                                        roll: row[x].winColour,
                                        amount: row[x].amount,
                                        win: newwonamount
                                    }
                                    alluserbets.push(jsonObj);
                                    newwonamount = 0;
                                }
                                socket.emit('response', {
                                    data: "HistoryUpdated",
                                    totalbeta: totalbetamount,
                                    totalbetw: totalbetwon,
                                    largea: largestbet,
                                    largew: largestwin,
                                    total: totalbets,
                                    allbets: alluserbets
                                });
                            }
                        });
                    }
                });
            } else socket.emit('response', {
                data: "erro",
                who: "History",
                value: "You need to log in"
            });
        } else if (data.info == "Tradelinkupdate") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                var linkas = data.link;
                if (linkas.indexOf("https://steamcommunity.com/trade") != -1 && linkas.length < 80) {
                    con.query('UPDATE users SET tradeurl= ? WHERE `hash`= ?', [data.link, data.hash], function(err) {
                        if (err) console.log(err);
                        else {
                            socket.emit('response', {
                                data: "Success",
                                who: "Tradelink",
                                value: "You updated your trade link"
                            });
                        }
                    });
                } else socket.emit('response', {
                    data: "erro",
                    who: "Tradelink",
                    value: "Incorrect trade link format"
                });

            } else socket.emit('response', {
                data: "erro",
                who: "Tradelink",
                value: "You need to log in"
            });
        } else if (data.info == "trade") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "erro",
                        who: "Trade",
                        value: "You need to log in"
                    });
                    else {
                        if (row[0].tradeurl == null || row[0].tradeurl == '' || !row[0].tradeurl) {
                            socket.emit('response', {
                                data: "erro",
                                who: "Trade",
                                value: "Please set up your trade link"
                            });
                        } else {
                            if (data.reason == "deposit") {
                                if (row[0].ActiveTrade == 1 || row[0].Coins < 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "You have trades active already ."
                                    });
                                } else if ((data.Uitems).length === 0 || (data.Uassets).length === 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "Trade cannot be empty"
                                    });
                                } else {
                                    var checkarray = data.Uassets;
                                    checkarray.sort(function(a, b) {
                                        return a - b
                                    });
                                    var current = null;
                                    var cnt = 0;
                                    var restrict = 0;
                                    for (var i = 0; i <= checkarray.length; i++) {
                                        if (checkarray[i] != current) {
                                            if (cnt > 1) {
                                                console.log(current + ' comes --> ' + cnt + ' times<br>');
                                                restrict = 1;
                                            }
                                            current = Uassets[i];
                                            cnt = 1;
                                        } else {
                                            cnt++;
                                        }
                                    }
                                    if (restrict == 0) {
                                        con.query('SELECT * FROM `bots` ORDER BY rand() LIMIT 1', function(err, rowas) {
                                            if ((err) || (!rowas.length)) socket.emit('response', {
                                                data: "erro",
                                                who: "Trade",
                                                value: "Unknown error"
                                            });
                                            else {
                                                fsss[rowas[0].id].send({
                                                    id: data.id,
                                                    bot: rowas[0].steamid,
                                                    reason: data.reason,
                                                    items: data.Uitems,
                                                    assets: data.Uassets,
                                                    price: data.Uprice,
                                                    hash: data.hash,
                                                    tradelink: row[0].tradeurl
                                                });
                                            }
                                        });
                                    } else {
                                        socket.emit('response', {
                                            data: "erro",
                                            who: "Trade",
                                            value: "Please do not temper with deposits"
                                        });
                                    }
                                }
                            } else if (data.reason == "withdraw") {
                                var checkingprices = parseFloat(row[0].Coins) - parseFloat(data.Uprice);
                                var checkingpricess = parseFloat(row[0].CoinsBetTotal) - parseFloat(data.Uprice) - parseFloat(row[0].CoinsWithdrawed);
                                var checkingpricesss = parseFloat(row[0].CoinsTotal) - 2000;
                                if (row[0].Ban == 1 || row[0].Coins < 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "You are banned."
                                    });
                                } else if (row[0].ActiveTrade == 1) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "You have trades active already ."
                                    });
                                } else if ((data.Uitems).length === 0 || (data.Uassets).length === 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "Trade cannot be empty"
                                    });
                                } else if (checkingprices < 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "You do not have enough coins."
                                    });
                                } else if (checkingpricess < 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "Error. To take out items you must bet 100 % of your withdrawing sum."
                                    });
                                } else if (row[0].CsRes != 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "This function is available only if you played Counter-Strike: Global Offensive for more than 20 hours"
                                    });
                                } else if (checkingpricesss < 0) {
                                    socket.emit('response', {
                                        data: "erro",
                                        who: "Trade",
                                        value: "To prove you are a real person , please deposit a 2000 coin worth item"
                                    });
                                } else {
                                    var checkarray = data.Uassets;
                                    checkarray.sort(function(a, b) {
                                        return a - b
                                    });
                                    var current = null;
                                    var cnt = 0;
                                    var restrict = 0;
                                    for (var i = 0; i <= checkarray.length; i++) {
                                        if (checkarray[i] != current) {
                                            if (cnt > 1) {
                                                console.log(current + ' comes --> ' + cnt + ' times');
                                                restrict = 1;
                                            }
                                            current = checkarray[i];
                                            cnt = 1;
                                        } else {
                                            cnt++;
                                        }
                                    }
                                    if (restrict == 0) {
                                        if (data.bot == 76561198354714728) var botas = 1;
                                        else var botas = 2;
                                        fsss[botas].send({
                                            id: data.id,
                                            bot: data.bot,
                                            reason: data.reason,
                                            items: data.Uitems,
                                            assets: data.Uassets,
                                            price: data.Uprice,
                                            hash: data.hash,
                                            tradelink: row[0].tradeurl
                                        });

                                    }
                                }
                            }
                        }
                    }
                });
            } else socket.emit('response', {
                data: "erro",
                who: "Trade",
                value: "Please log in"
            });
        } else if (data.info == "ReddemCode") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "erro",
                        who: "code",
                        value: "You need to log in"
                    });
                    else {
                        if (row[0].ownreferal == 0) {
                            if (row[0].CsRes == 0) {
                                var name = (row[0].name).toLowerCase();
                                name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                var test = name.indexOf("csgowin.gg");

                                if (test !== -1) var oldcoins = parseFloat(reffcoins) + 100;
                                else var oldcoins = reffcoins;

                                var refcoinadd = parseFloat(oldcoins) + parseFloat(row[0].Coins);
 if (data.value && (data.value).length >= 4 && (data.value).length <= 14 && /^[a-zA-Z0-9-\s ]*$/.test(data.value) != false && (data.value).indexOf(' ') === -1) {

                                con.query('SELECT * FROM `users` WHERE `defultreferal` = ?', [data.value], function(err, row) {
                                    if ((err) || (!row.length)) socket.emit('response', {
                                        data: "erro",
                                        who: "code",
                                        value: "There is no such code , try another one."
                                    });
                                    else {
                                        if (row[0].steamid != logedin) {
                                            var refreduser = row[0].steamid;
                                            var anotherone = parseFloat(row[0].referral) + 1;
                                            con.query('UPDATE users SET referral= ? WHERE `steamid`= ?', [anotherone, row[0].steamid], function(err) {
                                                if (err) console.log(err);
                                            });
                                            con.query('UPDATE users SET Coins= ?, ownreferal = ? WHERE `hash`= ?', [refcoinadd, refreduser, data.hash], function(err) {
                                                if (err) console.log(err);
                                            });
                                            socket.emit('response', {
                                                data: "Success",
                                                who: "code",
                                                value: "Congratulations . " + reffcoins + " coins have been added to your balance "
                                            });
                                        } else socket.emit('response', {
                                            data: "erro",
                                            who: "code",
                                            value: "You cannot enter your own code"
                                        });
                                    }
                                });
}
                            } else socket.emit('response', {
                                data: "erro",
                                who: "code",
                                value: "This function is only available if you played CSGO for 20 hours !"
                            });
                        } else socket.emit('response', {
                            data: "erro",
                            who: "code",
                            value: "You already redeemed a code"
                        });
                    }
                });
            } else socket.emit('response', {
                data: "erro",
                id: systemuser,
                avatar: systemavatar,
                value: "You need to log in"
            });
        } else if (data.info == "LVLUpdate") {
            if (logedin != false && logedin == data.id && hashing == data.hash) {
                con.query('SELECT * FROM `users` WHERE `hash` = ?', [data.hash], function(err, row) {
                    if ((err) || (!row.length)) socket.emit('response', {
                        data: "chat message",
                        id: systemuser,
                        avatar: systemavatar,
                        value: "You need to log on"
                    });
                    else {
                        if (row[0].CsRes == 0) {
                            var name = (row[0].name).toLowerCase();
                            name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            var test = name.indexOf("csgowin.gg");
                            if (test !== -1) freecoins = 25;
                            if (row[0].CoinsBetTotal < 50000) {
                                var lvl = 0;
                                var redeemable = 0;
                            } else {
                                var lvl = Math.floor(parseFloat(row[0].CoinsBetTotal) / 50000);
                                if (lvl == 1) var redeemable = freecoins;
                                else {
                                    var redeemable = freecoins + (lvl * 3);
                                    if (redeemable > 1000) var redeemable = 1000;
                                }
                            }
                            var needed = (lvl + 1) * 50000;
                            var canredeem = "true";
                            var ended = new Date();
                            if (data.additionalinfo == "redeem" && row[0].freecoins > ended) {
                                socket.emit('response', {
                                    data: "erro",
                                    who: "LVL",
                                    value: "You already redeemed your daily coins"
                                });
                                var canredeem = row[0].freecoins;
                            } else if (data.additionalinfo == "redeem" && row[0].freecoins <= ended) {
                                ended.setDate(ended.getDate() + parseFloat(dailycooldown));
                                var redeemedC = parseFloat(row[0].Coins) + parseFloat(redeemable);
                                con.query('UPDATE users SET freecoins= ?,Coins= ? WHERE `hash`= ?', [ended, redeemedC, data.hash], function(err) {
                                    if (err) console.log(err);
                                });
                                socket.emit('response', {
                                    data: "Success",
                                    who: "LVL",
                                    value: "You just redeemed " + redeemable + " coins successfully , come back tommorow"
                                });
                                var canredeem = ended;
                            } else if (row[0].freecoins > ended) var canredeem = row[0].freecoins;
                            socket.emit('response', {
                                data: "LVLUP",
                                crr: lvl,
                                amout: row[0].CoinsBetTotal,
                                realamout: needed,
                                reddem: redeemable,
                                lvl: lvl + 1,
                                canreddem: canredeem
                            });
                        } else socket.emit('response', {
                            data: "erro",
                            who: "LVL",
                            value: "This function is only available if you played cs for 20 hours"
                        });
                    }
                });
            } else socket.emit('response', {
                data: "erro",
                who: "LVL",
                value: "You need to log in"
            });
        }
    });
    socket.on('disconnect', function() {
        var index = steammusers.indexOf(hashing);
        if (index > -1) {
            steammusers.splice(index, 1);
        }
        var Users = steammusers.length;
        io.emit('response', {
            data: "Online",
            value: Users
        });
        console.log('Users online :' + Users);
        if (logedin != false) console.log('user disconnected');
        else console.log('guest disconnected');
    });
});
http.listen(8080, function() {
    console.log('listening on *:8080');
});