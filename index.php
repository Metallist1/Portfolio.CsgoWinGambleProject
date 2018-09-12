<!DOCTYPE html>
<html>
    <link rel="stylesheet" href="css/project.mini.css" media="all">
    <link rel="stylesheet" href="css/metro-bootstrap.css" media="all">
<head>
<meta charset="utf-8">
    <title>CSGOWIN.GG Test your luck!</title>
</head>
<body>
    <div class="boxas">
        <!-- javascript -->
        <script src="/gambleproject/js/jquery.min.js"></script>
        <script src="/gambleproject/js/js.cookie.min.js"></script>
        <script src="/gambleproject/js/TweenMax.min.js"></script>
        <script src="/gambleproject/js/projektas.js"></script>
        <script src="/gambleproject/js/bootstrap.js"></script>
        <script src="/gambleproject/js/socket.io.slim"></script>
        <!-- header -->
        <header>
            <nav class="midNav">
                <div class="head">
                    <ul id="alllright">
                    <ul id="logoleft">
                        <li>
                            <div class="logo"><img alt="logo" class="refreshU" src="images/logotip.webp"></div>
                        </li>
                    </ul>
                    <ul id="right">
                        <li>
                            <div class="Elipse"><img alt="greenbuble" class="refreshU" src="images/EclipseG.webp">
                            </div>
                            <div class="usersonline">Website is offline</div>
                        </li>
                        <li>
                            <div class="Login">
                                <?php if(!isset($_COOKIE[ "user"])): ?>
                                <a class=" icona" href="/gambleproject/login.php"><img alt="login" src="images/steam.webp">
                                </a>
                                <?php else: ?>
                                <div class="dropdown" cost="eff">
                                    <a class="icona"><img alt="user icon" class="dropdownOpen rounded" src="<?=$_COOKIE["user"]?>"></a>
                                    <div id="meniu" class="dropdown-content rightpos">
                                        <ul id="userdrop">
                                            <li>
                                                <a class="level">Level</a>
                                            </li>
                                            <li>
                                                <a class="tradelink">Trade link</a>
                                            </li>
                                            <li>
                                                <a class="historylist">Bet history</a>
                                            </li>
                                            <li>
                                                <a href="/gambleproject/logout.php">Log out</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <?php endif; ?>
                            </div>
                        </li>
                    </ul>
                    </ul>
                    <ul class="navigation">
                        <li>
                            <a class="activegame">ROULETTE</a>
                        </li>
                        <!-- <li><a>COINFLIP</a></li><li><a>SWAPPER</a></li><li><a>DICES</a></li>-->
                        <li>
                            <a class="modalOpen" href="/gambleproject/withdraw.php">WITHDRAW</a>
                        </li>
                        <li>
                            <a class="modalOpen" href="/gambleproject/deposit.php">DEPOSIT</a>
                        </li>
                        <li class="right">
                            <a class="tos">TERMS OF SERVICES</a>
                        </li>
                        <li class="right">
                            <a class="sup">SUPPORT</a>
                        </li>
                        <li class="right">
                            <a class="affiliates">AFFILIATES</a>
                        </li>
                        <li class="right">
                            <a class="faq">F.A.Q</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <!-- Main body-->
        <div class="main">
            <div class="Rulletmain">
                <div class="Rullet">
                    <div class="rolloutside">
                        <div class="Roll">
                            <div class="Timer">
                                <div id="timer">0.00</div>
                            </div>
                            <div id="progressbar"></div>
                        </div>
                    </div>
                    <div class="Rollitselfe">
                	<div class="Rollitself">
                            <ul id="list"><li><div class=" boxR" id="1"/></li><li><div class=" boxB" id="14"/></li><li><div class=" boxR" id="2"/></li><li><div class=" boxB" id="13"/></li><li><div class=" boxR" id="3"/></li><li><div class=" boxB" id="12"/></li><li><div class=" boxR" id="4"/></li><li><div class=" boxG" id="0"/></li><li><div class=" boxB" id="11"/></li><li><div class=" boxR" id="5"/></li><li><div class=" boxB" id="10"/></li><li><div class=" boxR" id="6"/></li><li><div class=" boxB" id="9"/></li><li><div class=" boxR" id="7"/></li><li><div class=" boxB" id="8"/></li><li><div class=" boxR" id="1"/></li><li><div class=" boxB" id="14"/></li><li><div class=" boxR" id="2"/></li><li><div class=" boxB" id="13"/></li><li><div class=" boxR" id="3"/></li><li><div class=" boxB" id="12"/></li><li><div class=" boxR" id="4"/></li><li><div class=" boxG" id="0"/></li><li><div class=" boxB" id="11"/></li><li><div class=" boxR" id="5"/></li><li><div class=" boxB" id="10"/></li><li><div class=" boxR" id="6"/></li><li><div class=" boxB" id="9"/></li><li><div class=" boxR" id="7"/></li><li><div class=" boxB" id="8"/></li><li><div class=" boxR" id="1"/></li><li><div class=" boxB" id="14"/></li><li><div class=" boxR" id="2"/></li><li><div class=" boxB" id="13"/></li><li><div class=" boxR" id="3"/></li><li><div class=" boxB" id="12"/></li><li><div class=" boxR" id="4"/></li><li><div class=" boxG" id="0"/></li><li><div class=" boxB" id="11"/></li><li><div class=" boxR" id="5"/></li><li><div class=" boxB" id="10"/></li><li><div class=" boxR" id="6"/></li><li><div class=" boxB" id="9"/></li><li><div class=" boxR" id="7"/></li><li><div class=" boxB" id="8"/></li></ul>
                            <div class="Rollitselfpointer"></div>
                	</div>
                    </div>
                    <div class="OutherHistory">
                        <div class="Historys">
                            <div class="History"></div>
                        </div>
                    </div>
                    <div class="OptionsBalanceMeniu">
                        <div class="Balances">Your balance
                            <div class='balanceIN'> You need to log in<img alt="balance refresh" id='refreshBalance' src='images/refresh.webp'>
                            </div>
                        </div>
                        <div class="Rollitselfextra">
                            <input type="text" id="Bet" autocomplete="off" placeholder="Place your bet here " />
                            <div class="extra blue" what="none">Clear</div>
                            <div class="extra outline" what="10">+10</div>
                            <div class="extra outline" what="100">+100</div>
                            <div class="extra outline" what="1000">+1000</div>
                            <div class="extra outline" what="half">1/2</div>
                            <div class="extra outline" what="twice">x2</div>
                            <div class="extra blue" what="max">Max</div>
                        </div>
                    </div>
                </div>
                <div class="OptionAll">
                    <div class="OptionMeniu">
                    </div>
                    <div class="OptionMeniuUserBet">
                        <div class="terrorists">
                            <div id="red">
                                <div class="insidefit"><img alt="t" class="betTIMG" src="images/ct.webp">
                                </div>BET ON T
                                <div class="right biggray">2X</div>
                            </div>
                            <div class="terroristsdeep">
                                <div id="redtotalbet">Total bet :
                                    <div id="betsumred"> 0</div>
                                </div>
                                <div id="userbet">Your bet :
                                    <div id="redbet">0</div>
                                </div>
                            </div>
                            <div class="UsersR">
                                <ul id="redU"></ul>
                            </div>
                        </div>
                        <div class="both">
                            <div id="green">
                                <div class="insidefit"><img alt="tie" class="betTieIMG" src="images/ctt.webp">
                                </div>BET ON TIE
                                <div class="right bigblack">14X</div>
                            </div>
                            <div class="bothdeep">
                                <div id="greentotalbet">Total bet :
                                    <div id="betsumgreen"> 0</div>
                                </div>
                                <div id="userbet">Your bet :
                                    <div id="greenbet">0</div>
                                </div>
                            </div>
                            <div class="UsersG">
                                <ul id="greenU"></ul>
                            </div>
                        </div>
                        <div class="counter">
                            <div id="black">
                                <div class="insidefit"><img alt="ct" class="betCtIMG" src="images/t.webp">
                                </div>BET ON CT
                                <div class="right biggray">2X</div>
                            </div>
                            <div class="counterdeep">
                                <div id="blacktotalbet">Total bet :
                                    <div id="betsumblack"> 0</div>
                                </div>
                                <div id="userbet">Your bet :
                                    <div id="blackbet">0</div>
                                </div>
                            </div>
                            <div class="UsersB">
                                <ul id="blackU"></ul>
                            </div>
                        </div>
                    </div>

                    <div class="OptionMeniuUsers">
                    </div>
                </div>
            </div>
            <div class="ChatMain">
                <div class="whatisit">
                    <div class="Elipse"> <img alt="blue circle" class="refreshU" src="images/EclipseB.webp">
                    </div> CHATBOX</div>
                <div class="msgimp">
                    <input type="text" id="msg" autocomplete="off" placeholder="Type your message here " />
                </div>
                <div class="msgwin">
                    <ul id="messages"></ul>
                </div>
            </div>
        </div>
        <footer>
            <a class="footicona" href="https://www.facebook.com/Sazonelt-1772335776312687/?fref=ts"><img alt="facebook" style="margin-top:3px;" src="images/facebook_icon.webp">
            </a>
            <a class="footicona" href="https://twitter.com/Sazone_lt?lang=en"><img alt="twitter" style="margin-top:3px;" src="images/twitter_icon.webp">
            </a>
            <a class="footicona" href="http://steamcommunity.com/groups/SaZone_lt"><img alt="stean group" style="margin-top:3px;" src="images/steam_icon.webp">
            </a>
            <div class="footertext">Copyright 2017-2018, CsgoWin.gg - All rights reserved.</div>
        </footer>
    </div>
</body>
<div id="historylist" class="modal">
    <div class="modal-content">
        <div class="modal-inner">
            <div class="TopHistory">
                Game history
            </div>
            <div class="HistoryBetCount">
                <div class='left'>Total bet value
                    <div class='right'>You need to log in</div>
                </div>
            </div>
            <div class="HistoryTotalCount">
                <div class='left'>Total bets placed
                    <div class='right'>You need to log in</div>
                </div>
            </div>
            <div class="HistoryTotalWinCount">
                <div class='left'>Total sum won
                    <div class='right'>You need to log in</div>
                </div>
            </div>
            <div class="HistoryBiggestBet">
                <div class='left'>Biggest bet placed
                    <div class='right'>You need to log in</div>
                </div>
            </div>
            <div class="HistoryBiggestWin">
                <div class='left'>Max amount won
                    <div class='right'>You need to log in</div>
                </div>
            </div>
            <div class="betinside">
                <div class="betinsider">                    
		<ul id="tablee">
                        <li class="darker">
                            <div class="bettinginformation bethistorytxt">Bet ID</div>
                            <div class="bettinginformation bethistorytxt">Round</div>
                            <div class="bettinginformation bethistorytxt">Time</div>
                            <div class="bettinginformation bethistorytxt">Amount</div>
                            <div class="bettinginformation bethistorytxt">Bet</div>
                            <div class="bettinginformation bethistorytxt">Roll</div>
                            <div class="bettinginformation bethistorytxt">Profit</div>
                        </li>
                    </ul>
                    <ul id="table">
                    </ul>
                </div>
            </div>
            <div class="decisions">
                <div class="Historyprevsoutside">
                    <div class="Historyprevs">Previous page</div>
                </div>
                <div class="HistoryHomeoutside center">
                    <div class="HistoryHome">Go back to start</div>
                </div>
                <div class="HistoryNextoutside right">
                    <div class="HistoryNext">Next page</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="tradelink" class="modal">
    <div class="modal-content">
        <div class="modal-inner fitwidth">
            <div class="Discription">Insert your trade link</div>
            <form>
                <input type="text" class="Trade_link" size="74" id="Tradelink" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=xxxxxxxx&token=xxxxxxxx">
                <div class="submit">Save</div>
            </form>
            <div class="TlinkError">Invalid Trade Link
                <Br>
            </div>
            <div class="TlinkSucc">Your Trade Link Has Been Set Succesfully !
                <Br>
            </div>
            You can get your trade url <a class="links" href="http://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener">Here</a>
        </div>
    </div>
</div>
<div id="FAQ" class="modal">
    <div class="modal-content">
        <div class="modal-inner taballign">
            <div class="TopHistory">
                Frequently Asked Questions
            </div>
            <div class="FAQmainbody">
                <div class="paragrafff">
                    <div class="StrongText">What is CsgoWin.gg?</div>
                    <div class="Point">CsgoWin.gg is a CS:GO (Counter Strike: Global Offensive) game website, which is offering roulette and other gamemodes.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How does CS:GO Roulette works?</div>
                    <div class="Point">Players deposit skins and get an equivelent in coins.</div>
                    <div class="Point">You bet said coins on 1 of the 3 offered colors with diffrent awards.</div>
                    <div class="Point">Once the timer reaches 0, a winning color will be picked.</div>
                    <div class="Point">Each roll is computed using the SHA-256 hash of 3 distinct inputs.</div>
                    <div class="Point">This is a precomputed value generated by CsgoWin.gg</div>
                    <div class="Point">Once winning color is picked . All players who had placed a bet on said color will be awarded 2x their amount if they had bet on terrorist or ct. 14x if they had bet on tie. </div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How do I log into my account?</div>
                    <div class="Point">To log in to your account, tap the 'Sign in through STEAM' button in the navigation bar. Next, you will be redirected to Steam login page, enter your login details and tap the 'Login' button. </div>
                    <div class="Point">* Note that Steam requires a 7 days waiting period before allowing trade offers from new devices.</div>
                    <div class="Point">* Also note that most functions on this site require you to own CSGO and have 20 Hours of gameplay time to ensure that your account is legit.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How do I deposit?</div>
                    <div class="Point">1. Click deposit button on the homepage. </div>
                    <div class="Point">2. Then choose items which you want to deposit. </div>
                    <div class="Point">3. After choosing . Click trade. Offer will be sent shortly. </div>
                    <div class="Point">4. Once you get the offer - accept . Your balance will be updated instantly.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">I was added/approached by someone with a nickname CsgoWin.gg Admin, is it a real administrator or a fake/scammer?</div>
                    <div class="Point">CsgoWin.gg has only two administrators which will never add you to friends list unless you add them first :</div>
                    <div class="Point"><a class="linksFAQ" href="http://steamcommunity.com/id/SaberGamesHD/" target="_blank" rel="noopener">Alpha_Awper</a>(Programmer)</div>
                    <div class="Point"><a class="linksFAQ" href="http://steamcommunity.com/id/seksius" target="_blank" rel="noopener">Seksius</a>(Manager) </div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How long does support takes?</div>
                    <div class="Point">Our support takes up to from 12-48 hours to respond.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">What are the rules for using chat?</div>
                    <div class="Point">*Don't spam. </div>
                    <div class="Point">*Don't ask for skins. </div>
                    <div class="Point">*Don't predict colors. </div>
                    <div class="Point">*Don't trade/buy/sell. </div>
                    <div class="Point">*Don't post links or advertise.</div>
                    <div class="Point">*Be nice to everyone. </div>
                    <div class="Point">*Please use only english language. </div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">By using CsgoWin.gg (henceforth to be referred to as "CsgoWin"), you acknowledge and accept Terms of Service in full and without reservation, you are agreeing to our Terms of Service and you are responsible for compliance with any applicable laws. Terms of Service govern your use of this website.</div>
                    <div class="StrongText">You must be at least 18 years of age to play on CsgoWin.</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="Support" class="modal">
    <div class="modal-content">
        <div class="modal-inner">
            <div class="TopHistory">
                Support
            </div>
            <div class="Supportmainbody">
                <div class="paragrafff">
                    <div class="StrongText">How do I send coins to other users?</div>
                    <div class="Point">To send coins use the chat command "/send [steam64id] [amount]".</div>
                    <div class="Point">For example, to send 100 coins to steam64id 76561198029313160 you'd type "/send 76561198029313160 100".</div>
                    <div class="Point">To find your steam64id you can use sites like <a class="linksFAQ" href="https://steamid.io/lookup" target="_blank" rel="noopener">steamid.io</a>
                    </div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How do I get more coins? Can I have free coins?</div>
                    <div class="Point">Coins are obtained by depositing Counter-Strike: Global Offensive skins.</div>
                    <div class="Point">If you've already activated used the free 500 coins (600 if you have our site name on your nickname) with the help of a promo code, the only way to get more coins is by depositing skins.</div>
                    <div class="StrongTextred">DO NOT contact support asking for coins.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">How do I create a custom referral code?</div>
                    <div class="Point">To create your own referral code, visit the Affiliates tab.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">I accepted the trade offer but never got coins!?</div>
                    <div class="Point">Once you've accepted the trade offer you should wait a couple of seconds and refresh your balance.</div>
                    <div class="Point">If this problem is not solved in an hour, contact us and mention all the data from the exchange with the page history of exchanges or attach a screenshot of the steam trade offer that you've accepted, make sure it contains the message from our bot!</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">An error occurred while sending the offer of exchange.</div>
                    <div class="Point">Make sure that your mobile authenticator is attached to this account and that you have it for more than 15 days (for a deposit). Verify that your profile and inventory on Steam is public. Make sure that the item is still valid. Make sure that the Steam platform is not experiencing problems in inventories (Player Inventories - Normal) and the steam community (Steam Community - Normal). To check the status, use the platform <a class="linksFAQ" href="https://steamstat.us/" target="_blank" rel="noopener">steamstat.us.</a>
                    </div>
                    <div class="Point">If you believe that all the above mentioned problems do not concern you, then please try creating the exchange a few more times at a different time.</div>
                    <div class="Point">If the problem is not solved in an hour, then please contact us. </div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Got more questions ? Contact us by adding us</div>
                    <div class="Point"><a class="linksFAQ" href="http://steamcommunity.com/id/SaberGamesHD/" target="_blank" rel="noopener">Alpha_Awper</a>(Programmer)</div>
                    <div class="Point"><a class="linksFAQ" href="http://steamcommunity.com/id/seksius" target="_blank" rel="noopener">Seksius</a>(Manager) </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="TOS" class="modal">
    <div class="modal-content">
        <div class="modal-inner taballign">
            <div class="TopHistory">
                Terms Of Service
            </div>
            <div class="TOSmainbody">
                <div class="paragrafff">
                    <div class="StrongText">By using CsgoWin.gg (henceforth to be referred to as "CsgoWin"), you acknowledge and accept these Terms of Service in full and without reservation, you are agreeing to our Terms of Service and you are responsible for compliance with any applicable laws. These Terms of Service govern your use of this website.</div>
                    <div class="StrongTextred">You must be age 18 or older to play on CsgoWin.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Ownership</div>
                    <div class="Point">All materials on this website are intellectual property of CsgoWin and you may not use any of the content seen here for commercial use without permission. Exclusive rights for Counter Strike: Global Offensive and its associated virtual items belong to Steam and the Valve Corporation.</div>

                    <div class="StrongText">Acceptable Use</div>
                    <div class="Point">You must not use CsgoWin in any way that causes, or may cause, damage to the webite or impairment of the availability or accessibility of  CsgoWin or in any way which in unlawful, illegal, fraudulent or harmful. Do not use  CsgoWin, as a source for item exchanging to gain benefits from trading items that are in different price ranges compared to steam and our site. On a site it is forbidden to be engaged in commercial activity! It is prohibited to sell game currency to other users!</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Item Values</div>
                    <div class="Point">You are participating in games that allow you to deposit and receive intangible items. We display a value in coins to add the effect that these items have no physical value. These coins values are based on the CSGOAnalyst database. These values are subject to change without notice. Patterns on items are not taken into account. By using  CsgoWin you are accepting our item values and there will be no refund in case of a value issue.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Bans, Timeouts & Conduct</div>
                    <div class="Point"> CsgoWin reserves the right to remove/restricted accounts any user from our website with out and for any reason. Anyone attempting to scam other users maybe permenantly banned from using  CsgoWin. Players are asked to remain respectful at all times. Excessive spam, harassment, staff impersonation, solicitation, and defamation are strictly forbidden. Website advertisement, particularity of competing services, is not allowed.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Maximum Bets</div>
                    <div class="Point">Maximum bets are adjusted manually to maintain site solvency. The use of multiple accounts to bypass the maximum bet is strictly forbidden. A 1 hour warning will precede any decrease to the maximum bet. An increase to the maximum bet may occur at any time.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Privacy Policy</div>
                    <div class="Point">Steam profiles are used for identification purposes across the site. By using our service you acknowledge that your Steam profile, persona name, and avatar may be shared with other  CsgoWin users.  CsgoWin will never ask for, collect, or share the personal information of any of our users.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Limitations of Liability</div>
                    <div class="Point"> CsgoWin is not responsible for trade/account bans that may occur as a resulting of accepting items from our bots.  CsgoWin assumes no responsibility for missed bets as a result of network latency or disconnections. Always ensure a stable connection before placing bets. Avoid placing important bets at the last second. Use of our services is at your own risk.  CsgoWin, its employees and affiliates will never be held liable for your profits or losses while using this website. Variation These terms and conditions ("Terms of Service") are able to be revised and edited by  CsgoWin at any time. Revised terms and conditions will apply from their effective date once published to this website.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText">Law and Jurisdiction</div>
                    <div class="Point">These terms and conditions will be governed by and construed in accordance with the laws of Lithuanian Republic, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Lithuanian Republic.</div>
                </div>
                <div class="paragrafff">
                    <div class="StrongText"> CsgoWin is not affiliated with Steam or the Valve Corporation.</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="affiliates" class="modal">
    <div class="modal-content">
        <div class="modal-inner Inflexing taballign">
            <div class="InfoFirst">
                <div class="First">
                    <div class="Top">
                        <div class="number">1</div>
                        <div class="numbertxt">USERNAME</div>
                    </div>
                    <div class="Info">1.Click <a class="links" href="http://steamcommunity.com/id/me/edit" target="_blank" rel="noopener">Here</a>
                    </div>
                    <div class="Info">2.Find 'Profile Name'</div>
                    <div class="Info">3.Add <a class="links" href="#">CsgoWin.gg</a> to your name</div>
                    <div class="Info">4.Click <a class="links" href="#">Save settings</a>
                    </div>
                    <div class="Info">5.Relogin and recieve bonuses listed</div>
                </div>
                <div class="Second">
                    <div class="Top">
                        <div class="number">2</div>
                        <div class="numbertxt">BONUSES</div>
                    </div>
                    <div class="Info">1.Faster leveling up.For 1 coin you get 1.1 coin.</div>
                    <div class="Info">2.You can redeem 25 daily coins instead of 20 at level 1.</div>
                    <div class="Info">3.Redeeming your affiliate code grants you 600 coins coins instead of 500.</div>
                    <div class="Info">4.Your friends will notice you are using our site and will ask for an affiliate code.</div>
                    <div class="Info">5.AND MUCH MORE!</div>
                </div>
            </div>
            <div class="third">
                <div class="Top">
                    <div class="number">3</div>
                    <div class="numbertxt">REFER AND EARN</div>
                </div>
                <div class="Info">1.Redeem someone else's code and get 500 points</div>
                <div class="Info">2.Create your own code</div>
                <div class="Info">3.Advertise your code and link on social media and other CS:GO related media</div>
                <div class="Info">4.Drive traffic to your link, or tell people to redeem your code</div>
                <div class="Info">5.Click on CLAIM to redeem your earnings... then bet them and buy 100% FREE skins!</div>
                <div class="ReddemcodeDis">Redeem referal code</div>
                <div class="Affiliantes">
                    <form class="fitform">
                        <input type="text" class="codereddem" size="74" id="afflink" placeholder="ILoveCsgoWin1450">
                    </form>
                    <div class="Codesubmit">Redeem</div>
                </div>
                <div class="CodeError"></div>
                <div class="CodekSucc"></div>
                <div class="ReddemcodeDis">Update referal code</div>
                <div class="Affiliantes">
                    <form class="fitform">
                        <input type="text" class="youraffiliatecode" size="74" id="afflink" placeholder="Insert a code up to 14 characters long .">
                    </form>
                    <div class="AFsubmit">Update</div>
                </div>
                <div class="AFError"></div>
                <div class="AFSucc"></div>
                <div class="ReddemcodeDis">Your Affiliate Stats</div>
                <div class="AFCurr">
                    <div class='left'>Your Code
                        <div class='right'>You need to log in</div>
                    </div>
                </div>
                <div class="AFCurrAmout">
                    <div class='left'>Affiliate Signups
                        <div class='right'>You need to log in</div>
                    </div>
                </div>
                <div class="AFREALCurrAmout">
                    <div class='left'>Eligible Affiliates
                        <div class='right'>You need to log in</div>
                    </div>
                </div>
                <div class="AFCurrLVL">
                    <div class='left'>Your Affiliate LVL
                        <div class='right'>You need to log in</div>
                    </div>
                </div>
                <div class="AFCurrCoin">
                    <div class='left'>Claimable Balance
                        <div class='right'>You need to log in</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="level" class="modal">
    <div class="modal-content">
        <div class="modal-inner lvldarker">
            <div class="TopLVl">
                <div class="LVLtxt">Levels</div>
                <div class="LVLCurr"></div>
            </div>
            <div class="MidLVl">
                <div class="LVLCurrAmout"></div>
                <div class="LVLOutsidebar">
                    <div class="LVLOutsidebarr">
                        <div class="LVLPointer">
                            <div class="LVLPointerTXT"><img alt="yellow arrow" class="refreshU" src="images/Rodyklegeletona.webp">
                            </div>
                        </div>
                        <div class="LVLbaroutside">
                            <div id="LVLbar"></div>
                        </div>
                    </div>
                </div>
                <div class="LVLCurrCoin"></div>
                <div class="CollectTXT">Collect your coins ! Earn more by leveling up!</div>
                <div class="LVLCurrLVL"></div>
                <div class="LVLreddem">Collect</div>
                <div class="LVLError"></div>
                <div class="LVLSucc"></div>
            </div>
        </div>
    </div>
</div>

</html>