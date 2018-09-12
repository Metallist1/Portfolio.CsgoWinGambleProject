function getPositionOfWinner(e) {
    var t = $("#1").width(),
        a = $("[id=" + e.toString() + "]"),
        l = $(a[4]),
        i = $(a[1]);
    return minus = l.position().left - i.position().left, getRandomInt(l.position().left + 5, l.position().left + t - 5)
}

function rouletteSpin(e) {
    0 == spining ? (document.getElementById("timer").innerHTML = "Match started", spining = !0, tl = new TimelineMax({}), rouletteImages = $("#list"), startLeft = rouletteImages.position().left, poitionof = getPositionOfWinner(e), poitionof = parseFloat(poitionof) - parseFloat(middlemaker), tl.to(rouletteImages, 10, {
        x: -1 * poitionof,
        ease: Power4.easeOut
    })) : console.log("already spinning ")
}

function rollFin() {
    if (tl) {
        var e = document.getElementById("list");
        for (x = 0; x < 45; x++) e.removeChild(e.firstChild);
        $("#list").offset();
        var t = -1 * (t = parseFloat(poitionof) - parseFloat(minus)),
            a = document.getElementById("list");
        tl.pause(0, !0), tl.remove(), a.style.transform = "matrix(1, 0, 0, 1," + t + ", 0)", $("#redU").empty(), $("#blackU").empty(), $("#greenU").empty(), $("#redbet").html("0"), $("#greenbet").html("0"), $("#blackbet").html("0"), $("#betsumred").html("0"), $("#betsumgreen").html("0"), $("#betsumblack").html("0"), spining = !1
    }
}

function getRandomInt(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}

function ArrayHas(e, t) {
    return e in t
}
$(function() {
    function e(e) {
        if ("red" == e) t = $("#redU li ");
        else if ("black" == e) t = $("#blackU li ");
        else var t = $("#greenU li ");
        var a = t.sort(function(e, t) {
            return parseFloat($(e).find(".BetInfo").find(".extraI").text()) < parseFloat($(t).find(".BetInfo").find(".extraI").text())
        });
        "red" == e ? $("#redU").html(a) : "black" == e ? $("#blackU").html(a) : $("#greenU").html(a)
    }
    var a = io("http://sazone.lt:8080"),
        l = Cookies.get("who"),
        i = Cookies.get("_152Geb54"),
        s = $("#list li");
    s.clone().appendTo("#list");
    var r = new Audio("/gambleproject/sounds/rolling.wav"),
        o = new Audio("/gambleproject/sounds/tone.wav"),
        n = $(".Rollitself")[0];
    middlemaker = n.clientWidth / 2, a.emit("functioncall", {
        id: l,
        info: "login",
        hash: i
    }), a.emit("functioncall", {
        id: l,
        info: "onlinecheck",
        hash: i
    }), a.emit("functioncall", {
        id: l,
        info: "affiliatesUpdate",
        additionalinfo: "check",
        hash: i
    }), a.emit("functioncall", {
        id: l,
        info: "LVLUpdate",
        additionalinfo: "check",
        hash: i
    }), a.emit("functioncall", {
        id: l,
        info: "HistoryCheck",
        additionalinfo: "none",
        hash: i
    }), a.on("response", function(n) {
        if ("color" == n.data) {
            if ("black" == n.colour)
                if (0 != $("#blackU li .BetInfo[steamid='" + n.steamid + "']").length) {
                    var d = $("#blackU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    $("#blackU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
                } else {
                    d = $("#blackbet").text();
                    (c = parseFloat(d) + parseFloat(n.value)) > 200 && $("#blackU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='Imgage' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
                }
            else if ("red" == n.colour)
                if (0 != $("#redU li .BetInfo[steamid='" + n.steamid + "']").length) {
                    var d = $("#redU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                        c = parseFloat(d) + parseFloat(n.value);
                    $("#redU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
                } else {
                    d = $("#redbet").text();
                    (c = parseFloat(d) + parseFloat(n.value)) > 200 && $("#redU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='Imgage' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
                }
		else 
            if (0 != $("#greenU li .BetInfo[steamid='" + n.steamid + "']").length) {
                var d = $("#greenU li .BetInfo[steamid='" + n.steamid + "'] .extraI").text(),
                    c = parseFloat(d) + parseFloat(n.value);
                $("#greenU li .BetInfo[steamid='" + n.steamid + "'] .extraI").html(c)
            } else {
                d = $("#greenbet").text();
                (c = parseFloat(d) + parseFloat(n.value)) > 200 && $("#greenU").append($("<li>").html("<div class='BetInfo' steamid =" + n.steamid + " ><img alt='Imgage' class='Player' src=" + n.avatar + "></img> " + n.id + "<div class='extraI'>" + c + "</div></div> "))
            }
            e(n.colour)
        } else if ("balance" == n.data) $(".Balances").html("Your balance <div class='balanceIN'>" + n.value + "<img alt='Imgage' id='refreshBalance' src='images/refresh.webp'></div>");
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
                if (n.allbets[y].win > 0) m = "winbar";
                else var m = "losebar";
                $("#table").append($('<li class="tablebackground">').html("<div class='historicalvalue'>" + n.allbets[y].betid + "</div><div class='historicalvalue'>" + n.allbets[y].roundid + "</div><div class='historicalvalue'>" + n.allbets[y].time + "</div><div class='historicalvalue'>" + n.allbets[y].amount + "</div><div class='historicalvalue'> <div class='bethistoryroll'> <img alt='Imgage' class='refreshU' src='images/" + n.allbets[y].bet + ".webp'></div></div><div class='historicalvalue'><div class='bethistoryroll'><img alt='' class='refreshU' src='images/" + n.allbets[y].roll + ".webp'></div> </div><div class='historicalvalue'><div class='" + m + "'>" + n.allbets[y].win + "</div></div>"))
            }
        } else if ("erro" == n.data) "AF" == n.who ? ($(".AFSucc").html(""), $(".AFError").html(n.value), $(".AFError").show(), $(".AFSucc").hide()) : "LVL" == n.who ? ($(".LVLSucc").html(""), $(".LVLError").html(n.value), $(".LVLError").show(), $(".LVLSucc").hide()) : "Tradelink" == n.who ? ($(".TlinkError").show(), $(".TlinkSucc").hide()) : ($(".CodekSucc").html(""), $(".CodeError").html(n.value), $(".CodeError").show(), $(".CodekSucc").hide());
        else if ("Success" == n.data) "AF" == n.who ? ($(".AFError").html(""), $(".AFSucc").html(n.value), $(".AFSucc").show(), $(".AFError").hide()) : "LVL" == n.who ? ($(".LVLError").html(""), $(".LVLSucc").html(n.value), $(".LVLSucc").show(), $(".LVLError").hide()) : "Tradelink" == n.who ? ($(".TlinkSucc").show(), $(".TlinkError").hide()) : ($(".CodeError").html(""), $(".CodekSucc").html(n.value), $(".CodekSucc").show(), $(".CodeError").hide());
        else if ("affiliateUP" == n.data) $(".AFCurr").html("<div class='left'>Your Code<div class='right'>" + n.crr + "</div></div>"), $(".AFCurrAmout").html("<div class='left'>Affiliate Signups<div class='right'>" + n.amout + "</div></div>"), $(".AFREALCurrAmout").html("<div class='left'>Eligible Affiliates <div class='right'>" + n.realamout + "</div></div>"), $(".AFCurrCoin").html("<div class='left'>Claimable Balance <div class='right'>" + n.reddem + "(<div class='AFreddem'>Claim</div>)</div></div>"), $(".AFCurrLVL").html("<div class='left'>Your Affiliate LVL <div class='right'>" + n.lvl + "</div></div>");
        else if ("LVLUP" == n.data) {
            var v = document.getElementById("LVLbar"),
                u = 5e4 * parseFloat(n.crr),
                h = parseFloat(n.amout) - u,
                g = h / 5e4 * 100,
                f = 100;
            f = parseFloat(g) - parseFloat(f);
            var p = 100 - (f = Math.abs(f));
            if (v.style.width = p + "%", jQuery(".LVLPointerTXT").animate({
                    width: f + .5 + "%",
                    right: p + "%"
                }, 1500, "swing"), $(".LVLPointerTXT").html("<div class='white'>" + h + " EXP</div><img alt='Imgage' class='pointer' src='images/Rodyklegeletona.webp'>"), $(".LVLCurr").html("Your current level <div class='lvlamounth yellowchat'> " + n.crr + " </div>"), $(".LVLCurrAmout").html("<div class='leftstrong'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + n.crr + " </div><div class='darkamount'>" + u + " EXP</div></div><div class='right'><div class='white'>Level </div><div class='lvlamounth yellowchat'>" + n.lvl + " </div><div class='darkamount'>" + n.realamout + " EXP</div></div>"), $(".LVLCurrCoin").html(" <div class='lvlamonth yellowchat'>Collect " + n.reddem + " coins for free each day</div>"), "true" == n.canreddem) $(".LVLCurrLVL").html("<img alt='Imgage' class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>Your coins are ready</div></div>");
            else var b = new Date(n.canreddem).getTime(),
                y = setInterval(function() {
                    var e = (new Date).getTime(),
                        t = b - e,
                        s = Math.floor(t % 864e5 / 36e5),
                        r = Math.floor(t % 36e5 / 6e4),
                        o = Math.floor(t % 6e4 / 1e3);
                    $(".LVLCurrLVL").html("<img alt='Imgage' class='lvltimerIMG' src='images/clockimg.webp'><div class='containerLVL'><div class='timertext white'>Next collect in</div><div class='lvltime yellowchat'>" + s + ":" + r + ":" + o + "</div></div>"), t < 0 && (clearInterval(y), a.emit("functioncall", {
                        id: l,
                        info: "LVLUpdate",
                        additionalinfo: "check",
                        hash: i
                    }))
                }, 1e3)
        } else if ("Online" == n.data) $(".usersonline").text("Online players : " + n.value);
        else if ("balancecheck" == n.data) a.emit("functioncall", {
            id: l,
            info: "balanceUP",
            hash: i
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
        } else if ("chat message" == n.data) void 0 !== n.steam && "" != n.status ? $("#messages").append($("<li>").html(" <div class='msgInf " + n.color + "chat '> <img alt='Imgage' class='Player' src=" +  n.avatar +"> </img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/profiles/"  +  n.steam +  ">"+  n.id +"</a><div class='lvl'> " +  n.level + " lvl </div><div class='status right'> "+  n.status + "</div></div><div class='msgrealvalue'> "+   n.value +  "</div></div></div> ")) : "" == n.status ? $("#messages").append($("<li>").html("<div class='msgInf "+  n.color + "chat '><img alt='Imgage' class='Player' src="+  n.avatar + "></img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/profiles/"+  n.steam +  ">"+  n.id + "</a><div class='lvl'> " +  n.level +  " lvl </div></div><div class='msgrealvalue'> " +  n.value + "</div></div></div> ")): $("#messages").append($("<li>").html("<div class='msgInf bluechat '><img alt='Imgage' class='Player' src=" + n.avatar + "></img><div class='msgoutside'><div class='anothaone'><a href=http://steamcommunity.com/groups/csgowin_GG>" + n.id + "</a><div class='status right'>SYSTEM</div></div><div class='msgrealvalue'> " + n.value + "</div></div></div> ")), $(".msgwin").scrollTop($(".msgwin")[0].scrollHeight);
        else if ("NewRoll" == n.data) {
            var w = document.getElementById("progressbar"),
                k = 100 / n.value,
                I = 100,
                L = n.value;
            "undefined" != typeof Worker ? ("undefined" == typeof t && (t = new Worker("js/worker.js")), t.onmessage = function(e) {
                if (0 >= L) return t.terminate(), void(t = void 0);
                3e3 == L && rollFin(), I = parseFloat(I) - parseFloat(k), w.style.width = I + "%";
                var a = --L / 100;
                document.getElementById("timer").innerHTML = a.toPrecision(L.toString().length) + " secs"
            }) : $("#messages").append($("<li>").text("Your browser does not support Workers , please update it to use our site to its maximum."))
        } else if ("Inroll" == n.data) r.play(), document.getElementById("timer").innerHTML = "Match started", rouletteSpin(n.value);
        else if ("EndRoll" == n.data) {
            o.play();
            var F = s.clone();
            $("#list").append(F);
            var E = $("#betsumred").text(),
                x = $("#betsumgreen").text(),
                B = $("#betsumblack").text(),
                C = $("#redbet").text(),
                T = $("#greenbet").text(),
                U = $("#blackbet").text();
            if (n.value > 0 && n.value < 8) {
                document.getElementById("timer").innerHTML = "Terrorists win";
                var c = 2 * parseFloat(E),
                    H = 2 * parseFloat(C);
                $("#betsumred").html("<div class='win'>+" + c + "</div>"), $("#betsumgreen").html("<div class='lose'>-" + x + "</div>"), $("#betsumblack").html("<div class='lose'>-" + B + "</div>"), $("#redbet").html("<div class='win'>+" + H + "</div>"), $("#greenbet").html("<div class='lose'>-" + T + "</div>"), $("#blackbet").html("<div class='lose'>-" + U + "</div>")
            } else if (n.value >= 8) {
                document.getElementById("timer").innerHTML = "Counter-Terrorists win";
                var c = 2 * parseFloat(B),
                    H = 2 * parseFloat(U);
                $("#betsumblack").html("<div class='win'>+" + c + "</div>"), $("#betsumgreen").html("<div class='lose'>-" + x + "</div>"), $("#betsumred").html("<div class='lose'>-" + E + "</div>"), $("#blackbet").html("<div class='win'>+" + H + "</div>"), $("#greenbet").html("<div class='lose'>-" + T + "</div>"), $("#redbet").html("<div class='lose'>-" + C + "</div>")
            } else if (0 == n.value) {
                document.getElementById("timer").innerHTML = "Match has tied";
                var c = 14 * parseFloat(x),
                    H = 14 * parseFloat(T);
                $("#betsumgreen").html("<div class='win'>+" + c + "</div>"), $("#betsumblack").html("<div class='lose'>-" + B + "</div>"), $("#betsumred").html("<div class='lose'>-" + E + "</div>"), $("#greenbet").html("<div class='win'>+" + H + "</div>"), $("#redbet").html("<div class='lose'>-" + C + "</div>"), $("#blackbet").html("<div class='lose'>-" + U + "</div>")
            }
        }
    }), $("div").on("click", function(e) {
        if ($(e.target).is("#red") || $($(e.target)[0].parentElement).is("#red") || $(e.target).is(".betTIMG")) return a.emit("functioncall", {
            id: l,
            info: "bet",
            value: $("#Bet").val(),
            colour: "red",
            hash: i
        }), !1;
        if ($(e.target).is("#black") || $($(e.target)[0].parentElement).is("#black") || $(e.target).is(".betCtIMG")) return a.emit("functioncall", {
            id: l,
            info: "bet",
            value: $("#Bet").val(),
            colour: "black",
            hash: i
        }), !1;
        if ($(e.target).is("#green") || $($(e.target)[0].parentElement).is("#green") || $(e.target).is(".betTieIMG")) return a.emit("functioncall", {
            id: l,
            info: "bet",
            value: $("#Bet").val(),
            colour: "green",
            hash: i
        }), !1;
        if ($(e.target).is("#refreshBalance")) return a.emit("functioncall", {
            id: l,
            info: "balanceUP",
            hash: i
        }), !1;
        if ($(e.target).is(".AFsubmit")) return a.emit("functioncall", {
            id: l,
            info: "affiliatesUpdate",
            additionalinfo: "affiliatecode",
            value: $(".youraffiliatecode").val(),
            hash: i
        }), !1;
        if ($(e.target).is(".AFreddem")) return a.emit("functioncall", {
            id: l,
            info: "affiliatesUpdate",
            additionalinfo: "redeem",
            hash: i
        }), !1;
        if ($(e.target).is(".Historyprevs")) return a.emit("functioncall", {
            id: l,
            info: "HistoryCheck",
            additionalinfo: "previous",
            hash: i
        }), !1;
        if ($(e.target).is(".HistoryHome")) return a.emit("functioncall", {
            id: l,
            info: "HistoryCheck",
            additionalinfo: "none",
            hash: i
        }), !1;
        if ($(e.target).is(".HistoryNext")) return a.emit("functioncall", {
            id: l,
            info: "HistoryCheck",
            additionalinfo: "next",
            hash: i
        }), !1;
        if ($(e.target).is(".Codesubmit")) return a.emit("functioncall", {
            id: l,
            info: "ReddemCode",
            value: $(".codereddem").val(),
            hash: i
        }), !1;
        if ($(e.target).is(".extra")) {
            var t = $(e.target).attr("what");
            if ((s = $("#Bet").val()) || (s = 0), "none" == t) return $("#Bet").val(""), !1;
            if ("max" == t) {
                a.emit("functioncall", {
                    id: l,
                    info: "balanceUP",
                    hash: i
                });
                var s = $(".balanceIN").text();
                return $("#Bet").val(s), !1
            }
            return "half" == t ? (s = parseFloat(s) / 2, $("#Bet").val(s.toFixed(0)), !1) : "twice" == t ? (s = 2 * parseFloat(s), $("#Bet").val(s), !1) : (s = parseFloat(s) + parseFloat(t), $("#Bet").val(s), !1)
        }
        if ($(e.target).is(".LVLreddem")) return a.emit("functioncall", {
            id: l,
            info: "LVLUpdate",
            additionalinfo: "redeem",
            hash: i
        }), !1;
        if ($(e.target).is(".submit")) {
            var r = document.getElementById("Tradelink").value;
            return a.emit("functioncall", {
                id: l,
                info: "Tradelinkupdate",
                link: r,
                hash: i
            }), !1
        }
    }), $("#msg").on("keyup", function(e) {
        if (13 == e.keyCode) return a.emit("functioncall", {
            id: l,
            info: "chat message",
            msg: $("#msg").val(),
            hash: i
        }), $("#msg").val(""), !1
    })
}), window.addEventListener("focusout", function() {
    TweenLite.lagSmoothing(0)
}, !1), window.addEventListener("focusin", function() {
    TweenLite.lagSmoothing(1e3, 16)
}, !1);
var minus, tl, poitionof, spining = !1;
$(document).contextmenu(function() {
    return !1
}), $(document).on("click mousedown", function(e) {
    console.log($(e.target)), 0 == e.button && ($(e.target).is(".modalOpen") ? $(e.target).parent()[0].lastElementChild.style.display = "block" : $(e.target).is(".close") ? $(e.target).parent().parent().parent()[0].style.display = "none" : $(e.target).is(".modal-content") ? $(e.target).parent()[0].style.display = "none" : $(e.target).is(".dropdownOpen") ? $(e.target).is("img") ? ($(".dropdown-content").not($($(e.target).parent()[0].nextElementSibling)).hide(), $($(e.target).parent()[0].nextElementSibling).fadeToggle()) : ($(".dropdown-content").not($($(e.target).parent()[0].lastElementChild)).hide(), $($(e.target).parent()[0].lastElementChild).fadeToggle()) : $(e.target).is(".tradelink") ? document.getElementById("tradelink").style.display = "block" : $(e.target).is(".tos") ? document.getElementById("TOS").style.display = "block" : $(e.target).is(".sup") ? document.getElementById("Support").style.display = "block" : $(e.target).is(".faq") ? document.getElementById("FAQ").style.display = "block" : $(e.target).is(".affiliates") ? document.getElementById("affiliates").style.display = "block" : $(e.target).is(".historylist") ? document.getElementById("historylist").style.display = "block" : $(e.target).is(".level") ? document.getElementById("level").style.display = "block" : ($($(e.target)[0].parentElement).is(".dropdown-content") || $($(e.target)[0].parentElement).is(".modal-content") || $($(e.target)[0].parentElement).is("form") || $($(e.target)[0].parentElement).is(".modal-inner") || $($(e.target)[0].parentElement).is("tr") || $($(e.target)[0].parentElement.parentElement).is("#userdrop") || $(".dropdown-content").hide(), $(e.target).is(".inspect * , .inspect") || $(".inspect").hide())), $(this).off("click")
});