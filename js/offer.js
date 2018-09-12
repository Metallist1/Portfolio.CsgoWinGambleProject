$(function() {
    var w;
    var socket = io('http://sazone.lt:8080');
    var id = Cookies.get('who');
    var hash = Cookies.get('_152Geb54');
    var listPerma = $("#list li");
    listPerma.clone().appendTo("#list");
    var audio = new Audio('/gambleproject/sounds/rolling.wav');
    var audioend = new Audio('/gambleproject/sounds/tone.wav');
    socket.emit('functioncall', {
        id: id,
        info: "login",
        hash: hash
    });
    socket.emit('functioncall', {
        id: id,
        info: "onlinecheck",
        hash: hash
    });
    socket.emit('functioncall', {
        id: id,
        info: "affiliatesUpdate",
        additionalinfo: "check",
        hash: hash
    });
    socket.emit('functioncall', {
        id: id,
        info: "LVLUpdate",
        additionalinfo: "check",
        hash: hash
    });
    socket.emit('functioncall', {
        id: id,
        info: "HistoryCheck",
        additionalinfo: "none",
        hash: hash
    });
    socket.on('response', function(info) {
        if (info.data == "balance") {
            $('#useridentification').html("| Balance : <div class='useridentificationCLASS' id='trade'>" + info.value + "</div>");
            $('.userpriceinsid').text(info.value);
        } else if (info.data == "colorUp") {
            if (info.colour == "black") {
                var oldvar = $("#blackbet").text();
                var newvar = parseFloat(oldvar) + parseFloat(info.value);
                $("#blackbet").html(newvar);
            } else if (info.colour == "red") {
                var oldvar = $("#redbet").text();
                var newvar = parseFloat(oldvar) + parseFloat(info.value);
                $("#redbet").html(newvar);
            } else {
                var oldvar = $("#greenbet").text();
                var newvar = parseFloat(oldvar) + parseFloat(info.value);
                $("#greenbet").html(newvar);
            }
        } else if (info.data == "HistoryUpdated") {
            $('#table').empty();
            $('.HistoryBetCount').html("<div class='left'>Total bets placed<div class='right'>" + info.total + "</div></div>");
            $('.HistoryTotalCount').html("<div class='left'>Total bet value<div class='right'>" + info.totalbeta + "</div></div>");
            $('.HistoryTotalWinCount').html("<div class='left'>Total sum won<div class='right'>" + info.totalbetw + "</div></div>");
            $('.HistoryBiggestBet').html("<div class='left'>Biggest bet placed<div class='right'>" + info.largea + "</div></div>");
            $('.HistoryBiggestWin').html("<div class='left'>Max amount won<div class='right'>" + info.largew + "</div></div>");
            var table = document.getElementById("table");
            for (x = 0; x < (info.allbets).length; x++) {
                if ((info.allbets)[x]["win"] > 0) var fate = "winbar";
                else var fate = "losebar";
                $('#table').append($('<li class="tablebackground">').html("<div class='historicalvalue'>" + (info.allbets)[x]["betid"] + "</div><div class='historicalvalue'>" + (info.allbets)[x]["roundid"] + "</div><div class='historicalvalue'>" + (info.allbets)[x]["time"] + "</div><div class='historicalvalue'>" + (info.allbets)[x]["amount"] + "</div><div class='historicalvalue'> <div class='bethistoryroll'> <img alt='Imgage' class='refreshU' src='images/" + (info.allbets)[x]["bet"] + ".webp'></div></div><div class='historicalvalue'><div class='bethistoryroll'><img alt='' class='refreshU' src='images/" + (info.allbets)[x]["roll"] + ".webp'></div> </div><div class='historicalvalue'><div class='" + fate + "'>" + (info.allbets)[x]["win"] + "</div></div>"));
            }
        } else if (info.data == "erro") {
            if (info.who == "AF") {
                $('.AFSucc').html("");
                $('.AFError').html(info.value);
                $(".AFError").show();
                $(".AFSucc").hide();
            } else if (info.who == "LVL") {
                $('.LVLSucc').html("");
                $('.LVLError').html(info.value);
                $(".LVLError").show();
                $(".LVLSucc").hide();
            } else if (info.who == "Tradelink") {
                $(".TlinkError").show();
                $(".TlinkSucc").hide();
            } else if (info.who == "Trade") {
                document.getElementById('Proccess').style.display = "none";
                $('#modalError').html(info.value);
                document.getElementById('Fail').style.display = "block";

            } else {
                $('.CodekSucc').html("");
                $('.CodeError').html(info.value);
                $(".CodeError").show();
                $(".CodekSucc").hide();
            }
        } else if (info.data == "Success") {
            if (info.who == "AF") {
                $('.AFError').html("");
                $('.AFSucc').html(info.value);
                $(".AFSucc").show();
                $(".AFError").hide();
            } else if (info.who == "LVL") {
                $('.LVLError').html("");
                $('.LVLSucc').html(info.value);
                $(".LVLSucc").show();
                $(".LVLError").hide();
            } else if (info.who == "Tradelink") {
                console.log("tradelinkupdated");
                $(".TlinkSucc").show();
                $(".TlinkError").hide();
            } else if (info.who == "Trade") {
                document.getElementById('Proccess').style.display = "none";
                $('#modalSucc').html("Your trade offer was proccesed and confirmed .You can go to your trade by clicking <a href=https://steamcommunity.com/tradeoffer/" + info.value+ ">Here</a> Thank you depositing in CsgoWin.gg ! Good luck !");
                document.getElementById('Success').style.display = "block";
            } else {
                $('.CodeError').html("");
                $('.CodekSucc').html(info.value);
                $(".CodekSucc").show();
                $(".CodeError").hide();
            }
        } else if (info.data == "affiliateUP") {
            $('.AFCurr').html("<div class='left'>Your Code<div class='right'>" + info.crr + "</div></div>");
            $('.AFCurrAmout').html("<div class='left'>Affiliate Signups<div class='right'>" + info.amout + "</div></div>");
            $('.AFREALCurrAmout').html("<div class='left'>Eligible Affiliates <div class='right'>" + info.realamout + "</div></div>");
            $('.AFCurrCoin').html("<div class='left'>Claimable Balance <div class='right'>" + info.reddem + "(<div class='AFreddem'>Claim</div>)</div></div>");
            $('.AFCurrLVL').html("<div class='left'>Your Affiliate LVL <div class='right'>" + info.lvl + "</div></div>");
        } else if (info.data == "LVLUP") {
            var lvlprogress = document.getElementById("LVLbar");
            var newnumber = parseFloat((info.crr)) * 50000;
            var totalexp = parseFloat(info.amout) - newnumber;
            var width = ((totalexp) / 50000) * 100;
            var widthchange = 100;
            widthchange = parseFloat(width) - parseFloat(widthchange);
            widthchange = Math.abs(widthchange);
            var nextlvl = 100 - widthchange;
            lvlprogress.style.width = nextlvl + '%';
            jQuery('.LVLPointerTXT').animate({
                width: widthchange + 0.5 + '%',
                right: nextlvl + '%'
            }, 1500, 'swing');
            $('.LVLPointerTXT').html("<div class='white'>" + totalexp + " EXP</div><img alt='Imgage' class='pointer' src='images/Rodyklegeletona.webp'>");
            $('.LVLCurr').html("Your current level <div class='lvlamounth yellowchat'> " + info.crr + " </div>");
            $('.LVLCurrAmout').html("<div class='leftstrong'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + info.crr + " </div><div class='darkamount'>" + newnumber + " EXP</div></div><div class='right'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + info.lvl + " </div><div class='darkamount'>" + info.realamout + " EXP</div></div>");
            $('.LVLCurrCoin').html(" <div class='lvlamonth yellowchat'>Collect " + info.reddem + " coins for free each day</div>");
            if (info.canreddem == "true") $('.LVLCurrLVL').html("<img alt='Imgage' class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>Your coins are ready</div></div>");
            else {
                var countDownDate = new Date(info.canreddem).getTime();
                var x = setInterval(function() {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    $('.LVLCurrLVL').html("<img alt='Imgage' class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>" + hours + ":" + minutes + ":" + seconds + "</div></div>");
                    if (distance < 0) {
                        clearInterval(x);
                        socket.emit('functioncall', {
                            id: id,
                            info: "LVLUpdate",
                            additionalinfo: "check",
                            hash: hash
                        });
                    }
                }, 1000);
            }
        } else if (info.data == "Online") $('.usersonline').text("Online players : " + info.value);
        else if (info.data == "balancecheck") socket.emit('functioncall', {
            id: id,
            info: "balanceUP",
            hash: hash
        });
        else if (info.data == "HistoryUP") {
            $('.History').html("");
            for (x = 0; x < (info.value).length; x++) {
                if ((info.value)[x] > 0 && (info.value)[x] < 8) $('.History').prepend($('<div class="rollHistory red">').html(""));
                else if ((info.value)[x] >= 8) $('.History').prepend($('<div class="rollHistory black">').html(""));
                else if ((info.value)[x] == 0) $('.History').prepend($('<div class="rollHistory green">').html(""));
            }
        }
    });
    $('div').on('click', function(event) {
        if ($(event.target).is('#refreshBalance')) {
            socket.emit('functioncall', {
                id: id,
                info: "balanceUP",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.AFsubmit')) {
            socket.emit('functioncall', {
                id: id,
                info: "affiliatesUpdate",
                additionalinfo: "affiliatecode",
                value: $('.youraffiliatecode').val(),
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.AFreddem')) {
            socket.emit('functioncall', {
                id: id,
                info: "affiliatesUpdate",
                additionalinfo: "redeem",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.Historyprevs')) {
            socket.emit('functioncall', {
                id: id,
                info: "HistoryCheck",
                additionalinfo: "previous",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.HistoryHome')) {
            socket.emit('functioncall', {
                id: id,
                info: "HistoryCheck",
                additionalinfo: "none",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.HistoryNext')) {
            socket.emit('functioncall', {
                id: id,
                info: "HistoryCheck",
                additionalinfo: "next",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.Codesubmit')) {
            socket.emit('functioncall', {
                id: id,
                info: "ReddemCode",
                value: $('.codereddem').val(),
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.LVLreddem')) {
            socket.emit('functioncall', {
                id: id,
                info: "LVLUpdate",
                additionalinfo: "redeem",
                hash: hash
            });
            return false;
        } else if ($(event.target).is('.submit')) {
            var link = document.getElementById('Tradelink').value;
            socket.emit('functioncall', {
                id: id,
                info: "Tradelinkupdate",
                link: link,
                hash: hash
            });
            return false;
        } else if ($(event.target).is('#trade') || $(event.target).is('.tradeclick')) {
            document.getElementById('Proccess').style.display = "block";
            var useritems = [];
            var usersassets = [];
            var botsitems = [];
            var botsassets = [];
            var Uprice = $('.userpriceinside').text();
            var user = document.getElementById("Uselected").children;
            for (var i = 0; i < user.length; i++) {
                useritems.push(user[i].attributes[3]["nodeValue"]);
                usersassets.push(user[i].attributes[4]["nodeValue"]);
            }
            socket.emit('functioncall', {
                id: id,
                info: "trade",
                reason: "deposit",
                Uitems: useritems,
                Uassets: usersassets,
                Uprice: Uprice,
                hash: hash
            });
            return false;
        }
    });
});
loadInv();

function loadInv() {
    var id = Cookies.get('who');
    $.ajax({
        url: '/gambleproject/inventory.php',
        dataType: 'json',
        cache: false,
        type: 'POST',
        data: {
            who: id,
            ident: "user"
        },
        success: function(data) {
            if (typeof data.error != "undefined") {
                $('#user').html("<div class='innerError'>" + data.error + " </div>");
            } else additems(data);
        }
    });
}

function additems(my_array) {
    var numb = 0;
    var my_array = $.map(my_array, function(value, index) {
        return [value];
    });

    var insider = $('.useridentificationCLASS').text();
    $('.userpriceinsid').text(insider);
    $(".userpriceinside").html("0");
    $('#Uselected').empty();
    $('#user').empty();
    for (var i = 0; i < my_array.length; i++) {
        var cost = (my_array[i]["price"] * 1000).toFixed(0);
        if (cost <= 0) cost = "Reserved by website";
        if (ArrayHas("banned", my_array[i])) cost = "Unavailable";
        if (ArrayHas("wear", my_array[i])) var wear = my_array[i]["wear"];
        else var wear = "";
        if (ArrayHas("st", my_array[i])) var st = "<img alt='Imgage' style='margin-top:3px;' src='images/ST.webp'>";
        else var st = "";
        var escapedString = (my_array[i]['market_hash_name']).toString();
        $('#user').append($("<div class='item' style='background-image: url(&quot;https://steamcommunity-a.akamaihd.net/economy/image/" + my_array[i]['icon_url'] + "&quot;);' price = " + (my_array[i]['price'] * 1000).toFixed(0) + " name =\"" + my_array[i]['market_hash_name'] + "\" assetid = " + my_array[i]['assetid'] + ">").html("<div class='priceout'><div class='price'>" + cost + "</div></div><div class='nametagwrap'><div class='nametag'>\"" + my_array[i]["name"] + "\"</div><div class='wear'>" + wear + "</div></div><div class='st'>" + st + "</div>"));
    }
    sort(1);
}

function sort(numb) {
    var divs = $("#user .item");
    var Order = divs.sort(function(a, b) {
        if (numb == 0) {
            return +a.getAttribute('price') - +b.getAttribute('price');
        }
        return +b.getAttribute('price') - +a.getAttribute('price');
    });
    $("#user").html(Order);
}
$(document).contextmenu(function() {
    // nukomentuoti later kad return false  return false;
});

function ArrayHas(key, array) {
    if (key in array) return true;
    return false;
}

function search(who) {
    var input, filter, id, divu, td, i;

    input = document.getElementById("ItemsInput");
    filter = input.value.toLowerCase();
    id = document.getElementById("user");
    div = id.getElementsByClassName('item');

    for (i = 0; i < div.length; i++) {
        var price = div[i].attributes[3]["nodeValue"];
        price = price.replace(' |', '');
        if (price) {
            if (price.toLowerCase().includes(filter)) div[i].style.display = "";
            else  div[i].style.display = "none"; 
        }
    }
}
$(document).on('click mousedown', function(event) {
    console.log($(event.target));
    if (event.button == 0) {
        if ($(event.target).is('.modalOpen')) {
            $(event.target).parent()["0"].lastElementChild.style.display = "block";
        } else if ($(event.target).is('.close')) {
            $(event.target).parent().parent().parent()[0].style.display = "none";
        } else if ($(event.target).is('.modal-content')) {
            $(event.target).parent()[0].style.display = "none";
        } else if ($(event.target).is('.dropdownOpen')) {
            if ($(event.target).is('img')) {
                $('.dropdown-content').not($($(event.target).parent()["0"].nextElementSibling)).hide();
                $($(event.target).parent()["0"].nextElementSibling).fadeToggle();
            } else {
                $('.dropdown-content').not($($(event.target).parent()["0"].lastElementChild)).hide();
                $($(event.target).parent()["0"].lastElementChild).fadeToggle();
            }
        } else if ($(event.target).is('.item') || $($(event.target)["0"].offsetParent).is('.item')) {
if ($($(event.target)["0"].offsetParent).is('.item')) var whoisclicked = $(event.target)["0"].offsetParent;
else var whoisclicked = $(event.target);
                var isClicked = $(whoisclicked).data('clicked');
                if (!isClicked) {
                    var price = $(whoisclicked).attr('price');
                    var variable = $('.userpriceinside').text();
                    var change = parseFloat(variable) + parseFloat(price);

                    var variabletodelte = $('.useridentificationCLASS').text();
                    var varjanbletoadd = parseFloat(variabletodelte) + parseFloat(change);
                    $('.userpriceinsid').text(varjanbletoadd.toFixed(0));

                    $('.userpriceinside').text(change.toFixed(0));
                    $(whoisclicked).detach().appendTo('#Uselected')
                    $(whoisclicked).data('clicked', true);
                } else {
                    var price = $(whoisclicked).attr('price');
                    var variable = $('.userpriceinside').text();
                    var change = parseFloat(variable) - parseFloat(price);
                    var variabletodelte = $('.useridentificationCLASS').text();
                    var varjanbletoadd = parseFloat(variabletodelte) - parseFloat(change);
                    $('.userpriceinsid').text(varjanbletoadd.toFixed(0));
                    $('.userpriceinside').text(change.toFixed(0));
                    $(whoisclicked).detach().appendTo('#user')
                    $(whoisclicked).data('clicked', false);
                    sort(1);
                }
        } else if ($(event.target).is('.tradelink')) {
            document.getElementById('tradelink').style.display = "block";
        } else if ($(event.target).is('.tos')) {
            document.getElementById('TOS').style.display = "block";
        } else if ($(event.target).is('.sup')) {
            document.getElementById('Support').style.display = "block";
        } else if ($(event.target).is('.faq')) {
            document.getElementById('FAQ').style.display = "block";
        } else if ($(event.target).is('.affiliates')) {
            document.getElementById('affiliates').style.display = "block";
        } else if ($(event.target).is('.historylist')) {
            document.getElementById('historylist').style.display = "block";
        } else if ($(event.target).is('.level')) {
            document.getElementById('level').style.display = "block";
        } else if ($(event.target).is('.refreshU')) {
            loadInv();
        } else {
            if (!$($(event.target)["0"].parentElement).is('.dropdown-content') && !$($(event.target)["0"].parentElement).is('.modal-content') && !$($(event.target)["0"].parentElement).is('form') && !$($(event.target)["0"].parentElement).is('.modal-inner') && !$($(event.target)["0"].parentElement).is('tr') && !$($(event.target)["0"].parentElement.parentElement).is('#userdrop')) $(".dropdown-content").hide();
            if (!$(event.target).is('.inspect * , .inspect')) $(".inspect").hide();
        }
    }
    $(this).off('click');
});