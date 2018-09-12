function getPositionOfWinner(e) {
    var t = $("#1").width(),
        a = 4,
        i = $("[id=" + e.toString() + "]"),
        l = $(i[4]),
        s = $(i[1]);
    minus = l.position().left - s.position().left;
    var r = l.position().left + a,
        o = l.position().left + t - a;
    return getRandomInt(r, o)
}

function printLeftOfRouletteSpinner() {
    $("#list").position().left
}

function rouletteSpin(e) {
    0 == spining ? (document.getElementById("timer").innerHTML = "Match started", spining = !0, tl = new TimelineMax({
        onUpdate: printLeftOfRouletteSpinner,
        onCompleteParams: [e]
    }), rouletteImages = $("#list"), startLeft = rouletteImages.position().left, poitionof = getPositionOfWinner(e), poitionof = parseFloat(poitionof) - parseFloat(middlemaker), tl.to(rouletteImages, 10, {
        x: -1 * poitionof,
        ease: Power4.easeOut
    })) : console.log("already spinning ")
}

function rollFin() {
    if (tl) {
        var e = document.getElementById("list");
        for (x = 0; x < 45; x++) e.removeChild(e.firstChild);
        var t = ($("#list").offset(), parseFloat(poitionof) - parseFloat(minus)),
            t = -1 * t,
            a = document.getElementById("list");
        tl.pause(0, !0), tl.remove(), a.style.transform = "matrix(1, 0, 0, 1," + t + ", 0)", $("#redU").empty(), $("#blackU").empty(), $("#greenU").empty(), $("#redbet").html("0"), $("#greenbet").html("0"), $("#blackbet").html("0"), $("#betsumred").html("0"), $("#betsumgreen").html("0"), $("#betsumblack").html("0"), spining = !1
    }
}

function getRandomInt(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}

function loadInv() {
    var e = $(".Rollitself")[0];
    middlemaker = e.clientWidth / 2;
    var t = Cookies.get("who");
    $.ajax({
        url: "/gambleproject/inventory.php",
        dataType: "json",
        cache: !1,
        type: "POST",
        data: {
            who: t,
            ident: "user"
        },
        success: function(e) {
            "undefined" != typeof e.error ? $("#user").html("<div class='innerError'>" + e.error + " </div>") : additems(e, 1)
        }
    })
}

function loadbot(e) {
    switch (e) {
        case 1:
            Cookies.set("botid", "76561198165970813");
            break;
        case 2:
            Cookies.set("botid", "76561198263760347");
            break;
        case 3:
            Cookies.set("botid", "76561198354714728")
    }
    loadbotinv()
}

function loadbotinv() {
    var e = Cookies.get("botid");
    $.ajax({
        url: "/gambleproject/inventory.php",
        dataType: "json",
        cache: !1,
        type: "POST",
        data: {
            who: e,
            ident: "bot"
        },
        success: function(e) {
            "undefined" != typeof e.error ? $("#bot").html("<div class='innerError'>Unable to load bot items , if this problem continues , please contact one of the admins </div>") : additems(e, 0)
        }
    })
}

function additems(e, t) {
    var a = 0,
        e = $.map(e, function(e, t) {
            return [e]
        });
    if (1 == t) {
        Cookies.get("bonus");
        $("#user").empty(), $("#Uselected").empty(), $("#userprice").text(1e3 * a.toFixed(0))
    } else $("#bot").empty(), $("#Bselected").empty(), $("#botprice").text(1e3 * a.toFixed(0));
    for (var i = 0; i < e.length; i++) {
        var l = "url(https://steamcommunity-a.akamaihd.net/economy/image/" + e[i].icon_url + ")",
            s = document.createElement("div");
        s.style.backgroundImage = l, 1 == t ? s.className = "item" : s.className = "items";
        var r = (1e3 * e[i].price).toFixed(0);
        0 == r && (r = "Unstable price"), ArrayHas("banned", e[i]) && (r = "Unavailable");
        var o = document.createAttribute("price");
        o.value = (1e3 * e[i].price).toFixed(0), s.setAttributeNode(o);
        var n = document.createAttribute("name");
        n.value = e[i].market_hash_name, s.setAttributeNode(n);
        var d = document.createAttribute("assetid");
        d.value = e[i].assetid, s.setAttributeNode(d);
        var c = document.createAttribute("title");
        if (ArrayHas("fraudwarnings", e[i]) ? c.value = e[i].market_hash_name + "<br>" + e[i].fraudwarnings : c.value = e[i].market_hash_name, s.setAttributeNode(c), ArrayHas("stickers", e[i])) {
            var m = document.createAttribute("data-content");
            m.value = e[i].stickers, s.setAttributeNode(m)
        }
        1 == t ? document.getElementById("user").appendChild(s) : document.getElementById("bot").appendChild(s);
        var u = document.createElement("div");
        if (u.className = "price", u.innerHTML = r, s.appendChild(u), ArrayHas("wear", e[i])) {
            var v = document.createElement("div");
            v.className = "wear", v.innerHTML = e[i].wear, s.appendChild(v)
        }
        if (ArrayHas("st", e[i])) {
            var p = document.createElement("div");
            p.className = "st", p.innerHTML = "<img alt='alt' style='margin-top:3px;' src='images/ST.webp'>", s.appendChild(p)
        }
        var h = document.createElement("div");
        if (h.className = "inspect", ArrayHas("inspectlink", e[i])) {
            var g = document.createElement("a");
            g.className = "InspectLink", g.innerHTML = "Inspect Link<Br>";
            var f = document.createAttribute("href");
            f.value = e[i].inspectlink, g.setAttributeNode(f);
            var b = document.createAttribute("target");
            b.value = "_blank", g.setAttributeNode(b), h.appendChild(g)
        }
        var y = document.createElement("a");
        y.className = "MarketLink", y.innerHTML = "Market";
        var f = document.createAttribute("href");
        f.value = "http://steamcommunity.com/market/listings/730/" + e[i].market_hash_name, y.setAttributeNode(f);
        var b = document.createAttribute("target");
        b.value = "_blank", y.setAttributeNode(b), h.appendChild(y), s.appendChild(h)
    }
    1 == t ? sort(1, 1) : sort(1, 0)
}

function trade(e) {
    document.getElementById("Proccess").style.display = "block";
    var t = [],
        a = [],
        i = [],
        l = [],
        s = Cookies.get("who"),
        r = Cookies.get("botid");
    if (1 == e) {
        for (var o = $("#userprice").text(), n = document.getElementById("Uselected").children, d = 0; d < n.length; d++) t.push(n[d].attributes[3].nodeValue), a.push(n[d].attributes[4].nodeValue);
        $.ajax({
            url: "/gambleproject/trade.php",
            dataType: "json",
            cache: !1,
            type: "POST",
            data: {
                who: s,
                reason: e,
                Uitems: t,
                Uassets: a,
                Uprice: o
            },
            success: function(e) {
                "undefined" != typeof e.error ? (document.getElementById("Proccess").style.display = "none", $("#modalError").html("<span class='close'>&times;</span>" + e.error), document.getElementById("Fail").style.display = "block") : (document.getElementById("Proccess").style.display = "none", $("#modalSucc").html("<span class='close'>&times;</span> Your trade offer was proccesed and confirmed .You can go to your trade by clicking <a href=https://steamcommunity.com/tradeoffer/" + e + ">Here</a> Thank you for using Sazone.LT trading service ! Have a nice day !"), document.getElementById("Success").style.display = "block")
            }
        })
    } else {
        for (var c = $("#botprice").text(), m = document.getElementById("Bselected").children, d = 0; d < m.length; d++) i.push(m[d].attributes[3].nodeValue), l.push(m[d].attributes[4].nodeValue);
        $.ajax({
            url: "/gambleproject/trade.php",
            dataType: "json",
            cache: !1,
            type: "POST",
            data: {
                who: s,
                bot: r,
                reason: e,
                Bitems: i,
                Bassets: l,
                Bprice: c
            },
            success: function(e) {
                "undefined" != typeof e.error ? (document.getElementById("Proccess").style.display = "none", $("#modalError").html("<span class='close'>&times;</span>" + e.error), document.getElementById("Fail").style.display = "block") : (document.getElementById("Proccess").style.display = "none", $("#modalSucc").html("<span class='close'>&times;</span> Your trade offer was proccesed and confirmed .You can go to your trade by clicking <a href=https://steamcommunity.com/tradeoffer/" + e + ">Here</a> Thank you for using Sazone.LT trading service ! Have a nice day !"), document.getElementById("Success").style.display = "block")
            }
        })
    }
}

function sort(e, t) {
    if (1 == t) var a = $("#user .item");
    else var a = $("#bot .items");
    var i = a.sort(function(t, a) {
        return 0 == e ? +t.getAttribute("price") - +a.getAttribute("price") : +a.getAttribute("price") - +t.getAttribute("price")
    });
    1 == t ? $("#user").html(i) : $("#bot").html(i)
}

function ArrayHas(e, t) {
    return e in t ? !0 : !1
}

function search(e) {
    var t, a, i, l;
    for ("bot" == e ? (t = document.getElementById("ItemsInput"), a = t.value.toLowerCase(), i = document.getElementById("bot"), div = i.getElementsByClassName("items")) : (t = document.getElementById("ItemInput"), a = t.value.toLowerCase(), i = document.getElementById("user"), div = i.getElementsByClassName("item")), l = 0; l < div.length; l++) {
        var s = div[l].attributes[3].nodeValue;
        s = s.replace(" |", ""), s && (s.toLowerCase().includes(a) ? div[l].style.display = "" : div[l].style.display = "none")
    }
}
$(function() {
    function e(e) {
        if ("red" == e) var t = $("#redU li ");
        else if ("black" == e) var t = $("#blackU li ");
        else var t = $("#greenU li ");
        var a = t.sort(function(e, t) {
            var a = parseFloat($(e).find(".BetInfo").find(".extraI").text()),
                i = parseFloat($(t).find(".BetInfo").find(".extraI").text());
            return i > a
        });
        "red" == e ? $("#redU").html(a) : "black" == e ? $("#blackU").html(a) : $("#greenU").html(a)
    }
    var t;
    loadbot(1), loadInv();
    var a = io("http://sazone.lt:8080"),
        i = Cookies.get("who"),
        l = Cookies.get("_152Geb54"),
        s = $("#list li");
    s.clone().appendTo("#list");
    var r = new Audio("/gambleproject/sounds/rolling.wav"),
        o = new Audio("/gambleproject/sounds/tone.wav");
    a.emit("functioncall", {
        id: i,
        info: "login",
        hash: l
    }), a.emit("functioncall", {
        id: i,
        info: "onlinecheck",
        hash: l
    }), a.emit("functioncall", {
        id: i,
        info: "affiliatesUpdate",
        additionalinfo: "check",
        hash: l
    }), a.emit("functioncall", {
        id: i,
        info: "LVLUpdate",
        additionalinfo: "check",
        hash: l
    }), a.emit("functioncall", {
        id: i,
        info: "HistoryCheck",
        additionalinfo: "none",
        hash: l
    }), a.on("response", function(n) {
        if ("color" == n.data) {
            if ("black" == n.colour)
                if (0 != $("#blackU li .BetInfo[steamid='" + n.steamid + "']").length) {
                    var d = $("#blackU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    $("#blackU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
                } else {
                    var d = $("#blackbet").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    c > 200 && $("#blackU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='player' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
                } else if ("red" == n.colour)
                if (0 != $("#redU li .BetInfo[steamid='" + n.steamid + "']").length) {
                    var d = $("#redU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    $("#redU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
                } else {
                    var d = $("#redbet").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    c > 200 && $("#redU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='player' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
                } else if (0 != $("#greenU li .BetInfo[steamid='" + n.steamid + "']").length) {
                var d = $("#greenU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                    c = parseFloat(d) + parseFloat(n.value);
                $("#greenU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
            } else {
                var d = $("#greenbet").text(),
                    c = parseFloat(d) + parseFloat(n.value);
                c > 200 && $("#greenU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='player' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
            }
            e(n.colour)
        } else if ("balance" == n.data) $(".Balances").html("Your balance <div class='balanceIN'>" + n.value + "<img alt='refresh' id='refreshBalance' src='images/refresh.webp'></div>");
        else if ("colorUp" == n.data)
            if ("black" == n.colour) {
                var d = $("#blackbet").text(),
                    c = parseFloat(d) + parseFloat(n.value);
                $("#blackbet").html(c)
            } else if ("red" == n.colour) {
            var d = $("#redbet").text(),
                c = parseFloat(d) + parseFloat(n.value);
            $("#redbet").html(c)
        } else {
            var d = $("#greenbet").text(),
                c = parseFloat(d) + parseFloat(n.value);
            $("#greenbet").html(c)
        } else if ("HistoryUpdated" == n.data) {
            $("#table").empty(), $(".HistoryBetCount").html("<div class='left'>Total bets placed<div class='right'>" + n.total + "</div></div>"), $(".HistoryTotalCount").html("<div class='left'>Total bet value<div class='right'>" + n.totalbeta + "</div></div>"), $(".HistoryTotalWinCount").html("<div class='left'>Total sum won<div class='right'>" + n.totalbetw + "</div></div>"), $(".HistoryBiggestBet").html("<div class='left'>Biggest bet placed<div class='right'>" + n.largea + "</div></div>"), $(".HistoryBiggestWin").html("<div class='left'>Max amount won<div class='right'>" + n.largew + "</div></div>");
            document.getElementById("table");
            for (y = 0; y < n.allbets.length; y++) {
                if (n.allbets[y].win > 0) var m = "winbar";
                else var m = "losebar";
                $("#table").append($('<li class="tablebackground">').html("<div class='historicalvalue'>" + n.allbets[y].betid + "</div><div class='historicalvalue'>" + n.allbets[y].roundid + "</div><div class='historicalvalue'>" + n.allbets[y].time + "</div><div class='historicalvalue'>" + n.allbets[y].amount + "</div><div class='historicalvalue'> <div class='bethistoryroll'> <img alt='bet' class='refreshU' src='images/" + n.allbets[y].bet + ".webp'></div></div><div class='historicalvalue'><div class='bethistoryroll'><img alt='bet' class='refreshU' src='images/" + n.allbets[y].roll + ".webp'></div> </div><div class='historicalvalue'><div class='" + m + "'>" + n.allbets[y].win + "</div></div>"))
            }
        } else if ("erro" == n.data) "AF" == n.who ? ($(".AFSucc").html(""), $(".AFError").html(n.value), $(".AFError").show(), $(".AFSucc").hide()) : "LVL" == n.who ? ($(".LVLSucc").html(""), $(".LVLError").html(n.value), $(".LVLError").show(), $(".LVLSucc").hide()) : ($(".CodekSucc").html(""), $(".CodeError").html(n.value), $(".CodeError").show(), $(".CodekSucc").hide());
        else if ("Success" == n.data) "AF" == n.who ? ($(".AFError").html(""), $(".AFSucc").html(n.value), $(".AFSucc").show(), $(".AFError").hide()) : "LVL" == n.who ? ($(".LVLError").html(""), $(".LVLSucc").html(n.value), $(".LVLSucc").show(), $(".LVLError").hide()) : ($(".CodeError").html(""), $(".CodekSucc").html(n.value), $(".CodekSucc").show(), $(".CodeError").hide());
        else if ("affiliateUP" == n.data) $(".AFCurr").html("<div class='left'>Your Code<div class='right'>" + n.crr + "</div></div>"), $(".AFCurrAmout").html("<div class='left'>Affiliate Signups<div class='right'>" + n.amout + "</div></div>"), $(".AFREALCurrAmout").html("<div class='left'>Eligible Affiliates <div class='right'>" + n.realamout + "</div></div>"), $(".AFCurrCoin").html("<div class='left'>Claimable Balance <div class='right'>" + n.reddem + "(<div class='AFreddem'>Claim</div>)</div></div>"), $(".AFCurrLVL").html("<div class='left'>Your Affiliate LVL <div class='right'>" + n.lvl + "</div></div>");
        else if ("LVLUP" == n.data) {
            var u = document.getElementById("LVLbar"),
                v = 5e4 * parseFloat(n.crr),
                p = parseFloat(n.amout) - v,
                h = p / 5e4 * 100,
                g = 100;
            g = parseFloat(h) - parseFloat(g), g = Math.abs(g);
            var f = 100 - g;
            if (u.style.width = f + "%", jQuery(".LVLPointerTXT").animate({
                    width: g + .5 + "%",
                    right: f + "%"
                }, 1500, "swing"), $(".LVLPointerTXT").html("<div class='white'>" + p + " EXP</div><img alt='pointer'  class='pointer' src='images/Rodyklegeletona.webp'>"), $(".LVLCurr").html("Your current level <div class='lvlamounth yellowchat'> " + n.crr + " </div>"), $(".LVLCurrAmout").html("<div class='leftstrong'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + n.crr + " </div><div class='darkamount'>" + v + " EXP</div></div><div class='right'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + n.lvl + " </div><div class='darkamount'>" + n.realamout + " EXP</div></div>"), $(".LVLCurrCoin").html(" <div class='lvlamonth yellowchat'>Collect " + n.reddem + " coins for free each day</div>"), "true" == n.canreddem) $(".LVLCurrLVL").html("<img alt='clock'  class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>Your coins are ready</div></div>");
            else var b = new Date(n.canreddem).getTime(),
                y = setInterval(function() {
                    var e = (new Date).getTime(),
                        t = b - e,
                        s = Math.floor(t % 864e5 / 36e5),
                        r = Math.floor(t % 36e5 / 6e4),
                        o = Math.floor(t % 6e4 / 1e3);
                    $(".LVLCurrLVL").html("<img alt='bet' class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>" + s + ":" + r + ":" + o + "</div></div>"), 0 > t && (clearInterval(y), a.emit("functioncall", {
                        id: i,
                        info: "LVLUpdate",
                        additionalinfo: "check",
                        hash: l
                    }))
                }, 1e3)
        } else if ("Online" == n.data) $(".usersonline").text("Online players : " + n.value);
        else if ("balancecheck" == n.data) a.emit("functioncall", {
            id: i,
            info: "balanceUP",
            hash: l
        });
        else if ("HistoryUP" == n.data)
            for ($(".History").html(""), y = 0; y < n.value.length; y++) n.value[y] > 0 && n.value[y] < 8 ? $(".History").prepend($('<div class="rollHistory red">').html("")) : n.value[y] >= 8 ? $(".History").prepend($('<div class="rollHistory black">').html("")) : 0 == n.value[y] && $(".History").prepend($('<div class="rollHistory green">').html(""));
        else if ("betUp" == n.data)
            if ("black" == n.colour) {
                var d = $("#betsumblack").text(),
                    c = parseFloat(d) + parseFloat(n.value);
                $("#betsumblack").html(c)
            } else if ("red" == n.colour) {
            var d = $("#betsumred").text(),
                c = parseFloat(d) + parseFloat(n.value);
            $("#betsumred").html(c)
        } else {
            var d = $("#betsumgreen").text(),
                c = parseFloat(d) + parseFloat(n.value);
            $("#betsumgreen").html(c)
        } else if ("chat message" == n.data) "undefined" != typeof n.steam && "" != n.status ? $("#messages").append($("<li>").html("<div class='msgInf " + n.color + "chat '><img alt='player'  class='Player' src=" + n.avatar + "></img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/profiles/" + n.steam + ">" + n.id + "</a><div class='lvl'> " + n.level + " lvl </div><div class='status right'> " + n.status + "</div></div><div class='msgrealvalue'> " + n.value + "</div></div></div> ")) : "" == n.status ? $("#messages").append($("<li>").html("<div class='msgInf " + n.color + "chat '><img alt='player'  class='Player' src=" + n.avatar + "></img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/profiles/" + n.steam + ">" + n.id + "</a><div class='lvl'> " + n.level + " lvl </div></div><div class='msgrealvalue'> " + n.value + "</div></div></div> ")) : $("#messages").append($("<li>").html("<div class='msgInf bluechat '><img alt='player'  class='Player' src=" + n.avatar + "></img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/groups/SaZone_lt>" + n.id + "</a><div class='status right'>SYSTEM</div></div><div class='msgrealvalue'> " + n.value + "</div></div></div> ")), $(".msgwin").scrollTop($(".msgwin")[0].scrollHeight);
        else if ("NewRoll" == n.data) {
            var k = document.getElementById("progressbar"),
                h = 100 / n.value,
                g = 100,
                I = n.value;
            "undefined" != typeof Worker ? ("undefined" == typeof t && (t = new Worker("js/workeris.js")), t.onmessage = function(e) {
                if (0 >= I) return t.terminate(), void(t = void 0);
                3e3 == I && rollFin(), g = parseFloat(g) - parseFloat(h), k.style.width = g + "%", I--;
                var a = I / 100;
                document.getElementById("timer").innerHTML = a.toPrecision(I.toString().length) + " secs"
            }) : $("#messages").append($("<li>").text("Your browser does not support Workers , please update it to use our site to its maximum."))
        } else if ("Inroll" == n.data) r.play(), document.getElementById("timer").innerHTML = "Match started", rouletteSpin(n.value);
        else if ("EndRoll" == n.data) {
            o.play();
            var F = s.clone();
            $("#list").append(F);
            var w = $("#betsumred").text(),
                E = $("#betsumgreen").text(),
                L = $("#betsumblack").text(),
                x = $("#redbet").text(),
                B = $("#greenbet").text(),
                C = $("#blackbet").text();
            if (n.value > 0 && n.value < 8) {
                document.getElementById("timer").innerHTML = "Terrorists win";
                var c = 2 * parseFloat(w),
                    T = 2 * parseFloat(x);
                $("#betsumred").html("<div class='win'>+" + c + "</div>"), $("#betsumgreen").html("<div class='lose'>-" + E + "</div>"), $("#betsumblack").html("<div class='lose'>-" + L + "</div>"), $("#redbet").html("<div class='win'>+" + T + "</div>"), $("#greenbet").html("<div class='lose'>-" + B + "</div>"), $("#blackbet").html("<div class='lose'>-" + C + "</div>")
            } else if (n.value >= 8) {
                document.getElementById("timer").innerHTML = "Counter-Terrorists win";
                var c = 2 * parseFloat(L),
                    T = 2 * parseFloat(C);
                $("#betsumblack").html("<div class='win'>+" + c + "</div>"), $("#betsumgreen").html("<div class='lose'>-" + E + "</div>"), $("#betsumred").html("<div class='lose'>-" + w + "</div>"), $("#blackbet").html("<div class='win'>+" + T + "</div>"), $("#greenbet").html("<div class='lose'>-" + B + "</div>"), $("#redbet").html("<div class='lose'>-" + x + "</div>")
            } else if (0 == n.value) {
                document.getElementById("timer").innerHTML = "Match has tied";
                var c = 14 * parseFloat(E),
                    T = 14 * parseFloat(B);
                $("#betsumgreen").html("<div class='win'>+" + c + "</div>"), $("#betsumblack").html("<div class='lose'>-" + L + "</div>"), $("#betsumred").html("<div class='lose'>-" + w + "</div>"), $("#greenbet").html("<div class='win'>+" + T + "</div>"), $("#redbet").html("<div class='lose'>-" + x + "</div>"), $("#blackbet").html("<div class='lose'>-" + C + "</div>")
            }
        }
    }), $("div").on("click", function(e) {
        if ($(e.target).is("#red") || $($(e.target)[0].parentElement).is("#red") || $(e.target).is(".betTIMG")) return a.emit("functioncall", {
            id: i,
            info: "bet",
            value: $("#Bet").val(),
            colour: "red",
            hash: l
        }), !1;
        if ($(e.target).is("#black") || $($(e.target)[0].parentElement).is("#black") || $(e.target).is(".betCtIMG")) return a.emit("functioncall", {
            id: i,
            info: "bet",
            value: $("#Bet").val(),
            colour: "black",
            hash: l
        }), !1;
        if ($(e.target).is("#green") || $($(e.target)[0].parentElement).is("#green") || $(e.target).is(".betTieIMG")) return a.emit("functioncall", {
            id: i,
            info: "bet",
            value: $("#Bet").val(),
            colour: "green",
            hash: l
        }), !1;
        if ($(e.target).is("#refreshBalance")) return a.emit("functioncall", {
            id: i,
            info: "balanceUP",
            hash: l
        }), !1;
        if ($(e.target).is(".AFsubmit")) return a.emit("functioncall", {
            id: i,
            info: "affiliatesUpdate",
            additionalinfo: "affiliatecode",
            value: $(".youraffiliatecode").val(),
            hash: l
        }), !1;
        if ($(e.target).is(".AFreddem")) return a.emit("functioncall", {
            id: i,
            info: "affiliatesUpdate",
            additionalinfo: "redeem",
            hash: l
        }), !1;
        if ($(e.target).is(".Historyprevs")) return a.emit("functioncall", {
            id: i,
            info: "HistoryCheck",
            additionalinfo: "previous",
            hash: l
        }), !1;
        if ($(e.target).is(".HistoryHome")) return a.emit("functioncall", {
            id: i,
            info: "HistoryCheck",
            additionalinfo: "none",
            hash: l
        }), !1;
        if ($(e.target).is(".HistoryNext")) return a.emit("functioncall", {
            id: i,
            info: "HistoryCheck",
            additionalinfo: "next",
            hash: l
        }), !1;
        if ($(e.target).is(".Codesubmit")) return a.emit("functioncall", {
            id: i,
            info: "ReddemCode",
            value: $(".codereddem").val(),
            hash: l
        }), !1;
        if ($(e.target).is(".extra")) {
            var t = $(e.target).attr("what"),
                s = $("#Bet").val();
            if (s || (s = 0), "none" == t) return $("#Bet").val(""), !1;
            if ("max" == t) {
                a.emit("functioncall", {
                    id: i,
                    info: "balanceUP",
                    hash: l
                });
                var s = $(".balanceIN").text();
                return $("#Bet").val(s), !1
            }
            return "half" == t ? (s = parseFloat(s) / 2, $("#Bet").val(s.toFixed(0)), !1) : "twice" == t ? (s = 2 * parseFloat(s), $("#Bet").val(s), !1) : (s = parseFloat(s) + parseFloat(t), $("#Bet").val(s), !1)
        }
        return $(e.target).is(".LVLreddem") ? (a.emit("functioncall", {
            id: i,
            info: "LVLUpdate",
            additionalinfo: "redeem",
            hash: l
        }), !1) : void 0
    }), $("#msg").on("keyup", function(e) {
        return 13 == e.keyCode ? (a.emit("functioncall", {
            id: i,
            info: "chat message",
            msg: $("#msg").val(),
            hash: l
        }), $("#msg").val(""), !1) : void 0
    })
});
var minus, tl, poitionof, spining = !1;
$(document).contextmenu(function() {}), $(document).ready(function() {
    $("#containuser ").popover({
        trigger: "hover focus",
        selector: ".item",
        container: "#containuser",
        html: !0,
        placement: "auto bottom"
    }), $("#containbot").popover({
        trigger: "hover focus",
        selector: ".items",
        container: "#containbot",
        html: !0,
        placement: "auto bottom"
    })
}), $(document).on("click mousedown", function(e) {
    if (console.log($(e.target)), 0 == e.button)
        if ($(e.target).is(".modalOpen")) $(e.target).parent()[0].lastElementChild.style.display = "block";
        else if ($(e.target).is(".close")) $(e.target).parent().parent().parent()[0].style.display = "none";
    else if ($(e.target).is(".modal-content")) $(e.target).parent()[0].style.display = "none";
    else if ($(e.target).is(".dropdownOpen")) $(e.target).is("img") ? ($(".dropdown-content").not($($(e.target).parent()[0].nextElementSibling)).hide(), $($(e.target).parent()[0].nextElementSibling).fadeToggle()) : ($(".dropdown-content").not($($(e.target).parent()[0].lastElementChild)).hide(), $($(e.target).parent()[0].lastElementChild).fadeToggle());
    else if ($(e.target).is(".submit")) {
        var t = Cookies.get("who"),
            a = $('input[id="Tradelink"]');
        $.ajax({
            url: "/gambleproject/tradelink.php",
            dataType: "json",
            cache: !1,
            type: "POST",
            data: {
                who: t,
                link: a[0].value
            },
            success: function(e) {
                "undefined" != typeof e.error ? ($(".TlinkError").show(), $(".TlinkSucc").hide()) : ($(".TlinkSucc").show(), $(".TlinkError").hide())
            }
        })
    } else if ($(e.target).is(".item")) {
        if (!$(e.target).is(".inspect * , .inspect")) {
            var i = $(e.target).data("clicked");
            if (i) {
                var l = $(e.target).attr("price"),
                    s = $("#userprice").text(),
                    r = parseFloat(s) - parseFloat(l);
                $("#userprice").text(r.toFixed(0)), $(e.target).detach().appendTo("#user"), $(e.target).data("clicked", !1)
            } else {
                var l = $(e.target).attr("price"),
                    s = $("#userprice").text(),
                    r = parseFloat(s) + parseFloat(l);
                $("#userprice").text(r.toFixed(0)), $(e.target).detach().appendTo("#Uselected"), $(e.target).data("clicked", !0)
            }
        }
    } else if ($(e.target).is(".items")) {
        if (!$(e.target).is(".inspect * , .inspect")) {
            var i = $(e.target).data("clicked");
            if (i) {
                var l = $(e.target).attr("price"),
                    s = $("#botprice").text(),
                    r = parseFloat(s) - parseFloat(l);
                $("#botprice").text(r.toFixed(0)), $(e.target).detach().appendTo("#bot"), $(e.target).data("clicked", !1)
            } else {
                var l = $(e.target).attr("price"),
                    s = $("#botprice").text(),
                    r = parseFloat(s) + parseFloat(l);
                $("#botprice").text(r.toFixed(0)), $(e.target).detach().appendTo("#Bselected"), $(e.target).data("clicked", !0)
            }
        }
    } else $(e.target).is(".tradelink") ? document.getElementById("tradelink").style.display = "block" : $(e.target).is(".tos") ? document.getElementById("TOS").style.display = "block" : $(e.target).is(".sup") ? document.getElementById("Support").style.display = "block" : $(e.target).is(".faq") ? document.getElementById("FAQ").style.display = "block" : $(e.target).is(".affiliates") ? document.getElementById("affiliates").style.display = "block" : $(e.target).is(".historylist") ? document.getElementById("historylist").style.display = "block" : $(e.target).is(".level") ? document.getElementById("level").style.display = "block" : $(e.target).is(".refreshU") ? loadInv() : $(e.target).is(".refreshB") ? loadbotinv() : ($($(e.target)[0].parentElement).is(".dropdown-content") || $($(e.target)[0].parentElement).is(".modal-content") || $($(e.target)[0].parentElement).is("form") || $($(e.target)[0].parentElement).is(".modal-inner") || $($(e.target)[0].parentElement).is("tr") || $($(e.target)[0].parentElement.parentElement).is("#userdrop") || $(".dropdown-content").hide(), $(e.target).is(".inspect * , .inspect") || $(".inspect").hide());
    else 2 == e.button && ($(e.target).is(".item") ? ($(".inspect").not($(e.target).children(".inspect")).hide(), $(e.target).children(".inspect").fadeToggle()) : $(e.target).is(".items") && ($(".inspect").not($(e.target).children(".inspect")).hide(), $(e.target).children(".inspect").fadeToggle()));
    $(this).off("click")
});