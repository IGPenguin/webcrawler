//Run logger (localhost only)
var runLog = [];
var runLogStart = "";

//Savedata
var savedCoins = parseInt(localStorage.getItem('coins'));
if (!isNaN(savedCoins)) {
  // savedCoins is valid, nothing to do
} else {
  localStorage.setItem('coins', 0);
}

//Stats
var adventureStartTime = getTime();
var adventureEndTime = "Unfinished";
var seenLoot;

//Player stats init
var playerName = getFirstName();
var playerNumber = 1; //Increments on revival
var playerKills = 0;
var playerLootString;
var playerPartyString;
var playerHpMax;
var playerStaMax;
var playerMgkMax;
var playerHp;
var playerSta;
var playerLck;
var luckInterval = 35; //Lower to increase chances
var playerInt;
var playerAtk;
var playerAtkBonus;
var playerDef;
var playerXP;
var playerLevel;
var playerXPThreshold;
var playerLove=0;
var playerKarma=1;
var playerRested = false;
var playerCooked = false;
var playerShopped = false;
var playerDestined = false;
var bubblesUsed = false;
var playerAttackType = "⚔️";
var playerRollType = "🌀";
var playerBlockType = "🔰";
var playerSleepType = "💤";
var playerSpeakType = "💬";
var playerCastType = "💫";
var playerHealType = "❤️‍🩹";
var playerCurseType = "🪬";
var availableCoins=savedCoins;
var spentCoins=0;

var drachmaShop=["area:Wherever","emoji:👤","name:Voidwatcher Shade","type:Shop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Undertaker","desc:Well met\\ what's it gonna be this time?<br>","message:Set out on another adventure!"]
var drachmaCoin=["area:Wherever","emoji:🪙","name:Ethereal Drachma","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Entangles with one's soul on touch.<br>","message:Claimed an <b>Ethereal Drachma +1 🪙</b>"]
var drachmaPrize=["area:Wherever","emoji:🪙","name:Lucky Drachma","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Temporary reward for <b>one-time use only</b>.<br>Beware\\ gambling might be addictive.","message:Claimed a <b>Lucky Drachma +1 🪙</b>"]
var gamblingLost=["area:Wherever","emoji:🥺","name:Worthless Regrets","type:Dream","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Unlucky Moment","desc:Ooops! <b>The gamble did not pay off.</b><br>Perhaps better luck next time?","message:Released a long disappointed sigh..."]
var drachmaeBag=["area:Wherever","emoji:💰","name:Drachmae Reward","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Gambling winnings useful in the afterlife.<br>","message:Claimed an <b>Ethereal Drachma +1 🪙</b>"] //Unused
var usedShopMessages=[];

var attackTypes=(["🔪","🗡️","🔧","⛏️","🪚","🔨","🪓","🪛","🖋️","✂️","🪃","🪨","🌂","🦯","🥊","🪝","🦷","🪠","🗞️","🔱","🧹","🥏"])
var validBlades=(["🔪","🗡️","🪛","🪚","🪓","✒️","🖋️","🖊️","🏹","🪝","🦷","✂️","🔱"])
var castTypes=(["⚡️","☄️","🍭","🔥","🪄","🥢","🌙","🎐","🎋","🖌️","📔","📘","📓"])
var validBaits=(["🪱","🦋","🐝","🐞","🦟","🦗","🐜","🪲","🪰","🪳","🕷","🦐","🦂","🍤","🐙","🐛","🦑","🐌"])
var validRess=["🫀","💾","♥️","🫁","🏵️","🛟","📼","💿"];

//Adventure logging
var actionString; //Initial action log below
var actionLog = "💤&nbsp;▸&nbsp;💭 Fallen unconscious some time ago.<br>";
var adventureLog = actionLog;
var adventureEncounterCount = 1;
var adventureEndReason = "";

//Area init
var previousArea;
var areaName;

//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemyAtk;
var enemySta;
var enemyLck;
var enemyInt;
var enemyMgk;
var enemyDef;
var enemyType;
var previousEnemyType;
var enemyContainerNumber = 0;
var enemyTeam;
var enemyDesc;
var enemyMsg;
var enemyQuestItems;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;
var enemyIntBonus = 0;
var enemyMgkLost = 0;
var currentProphercy;
var enemyEmojiScaleX;
var enemyBossType = "";
var enemyCursed=false;

var totalBonus=0;
var totalMalus=0;

//Global vars
var storyData;
var linesStory;
var linesLoot;
var linesGenerator;
var encounterIndex;
var lastEncounterIndex;
var lastGeneratorName = "none";
var lootTotal;
var randomEncounterIndex;
var lootEncounterIndex;
var isFishing = false;
var encounterUsed=false;
var seenEncounters = [];

//Global vars - UIElements
var areaUIElement;
var nameUIElement;
var cardUIElement;
var emojiUIElement;
var emojiWrapperUIElement;
var emojiFlipperUIElement;
var enemyInfoUIElement;
var playerInfoUIElement;
var toolbarCardUIElement;
var enemyTeamUIElement;
var versusTextUIElement;
var buttonsContainer;

var grabColor=colorWhite;
var eatColor=colorWhite;
