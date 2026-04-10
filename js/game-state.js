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

// Set by ActionBar before invoking each callback; read and cleared once at the top of resolveAction.
// null  = no skill check (backwards compat)
// true  = skill check passed
// false = skill check failed
var actionBarSuccess = null;

// Returns { speed (units/s), successMin, successMax } derived from current global player+enemy state.
// speed is on a 0–100 scale — at speed 60 the cursor crosses the full bar in ~1.67 s.
function calcActionBarConfig(button) {
  var pAtk = Math.max(0, playerAtk  || 0);
  var pSta = Math.max(0, playerSta  || 0);
  var pMgk = Math.max(0, playerMgk  || 0);
  var pLck = Math.max(0, playerLck  || 0);
  var pInt = Math.max(0, playerInt  || 0);

  var eAtk = Math.max(0, (enemyAtk || 0) + (enemyAtkBonus || 0));
  var eSta = Math.max(0, (enemySta || 0) - (enemyStaLost || 0));
  var eMgk = Math.max(0, (enemyMgk || 0) - (enemyMgkLost || 0));
  var eInt = enemyInt || 0;
  var eDef = Math.max(0, enemyDef  || 0);
  var types = String(enemyType || '');

  var isHeavy     = types.includes('Heavy');
  var isSwift     = types.includes('Swift');
  var isSpirit    = types.includes('Spirit');
  var isUndead    = types.includes('Undead');
  var isTough     = types.includes('Tough');
  var isSmall     = types.includes('Small');
  var isBoss      = types.includes('Boss');
  var isGrabbable = /Container|^Item$|Consumable|^Prop$/.test(types);
  var isTrap      = types.includes('Trap');
  var isAltar     = types.includes('Altar');
  var isCurse     = types === 'Curse';

  var pStat, eStat, baseW, baseSpeed;

  switch (button) {
    case 'button_attack':
      pStat     = pAtk;
      eStat     = (isTough  ? eDef * 3              : 0)
                + (isSpirit ? Math.max(0, eInt)      : 0)
                + eSta * 0.4;
      baseW     = isTrap ? 65 : 40;
      baseSpeed = 50;
      break;

    case 'button_roll':
      pStat     = pSta;
      eStat     = (isSwift ? eSta * 2 : 0) + eAtk * 0.5;
      baseW     = 38;
      baseSpeed = 55;
      break;

    case 'button_block':
      pStat     = pAtk;
      eStat     = (isHeavy  ? eSta * 2.5 : eSta)
                + (isUndead ? 4           : 0)
                + eAtk * 0.4;
      baseW     = 42;
      baseSpeed = 48;
      break;

    case 'button_grab':
      pStat     = pAtk;
      eStat     = (isSmall  ? eSta * 3 : 0)
                + (isUndead ? 6        : 0);
      baseW     = isGrabbable ? 78 : 35;
      baseSpeed = isGrabbable ? 28 : 52;
      break;

    case 'button_sleep':
      pStat     = pSta;
      eStat     = eAtk * 0.25;
      baseW     = 62;
      baseSpeed = 32;
      break;

    case 'button_speak':
      pStat     = pInt;
      eStat     = (isSpirit ? Math.max(0, eInt) * 2 : Math.max(0, eInt));
      baseW     = isAltar || isCurse ? 52 : 42;
      baseSpeed = 40;
      break;

    case 'button_cast':
      pStat     = pMgk;
      eStat     = eMgk * 0.8;
      baseW     = 40;
      baseSpeed = 44;
      break;

    case 'button_pray':
      pStat     = pLck;
      eStat     = Math.max(0, eInt) * 0.4;
      baseW     = isAltar ? 62 : 48;
      baseSpeed = 36;
      break;

    case 'button_curse':
      pStat     = pMgk + pLck * 0.5;
      eStat     = eMgk + Math.max(0, eInt) * 0.35;
      baseW     = 38;
      baseSpeed = 46;
      break;

    default:
      pStat = 1; eStat = 0; baseW = 50; baseSpeed = 42;
  }

  if (isBoss) eStat += 5;

  var zoneW = Math.round(baseW + pStat * 6 - eStat * 4);
  zoneW = Math.max(12, Math.min(72, zoneW));

  var speed = Math.round(baseSpeed + pStat * 5);
  speed = Math.max(28, Math.min(130, speed));

  // Zone position: random, luck blends toward an easier left-centre placement
  var maxStart   = 100 - zoneW;
  var rawStart   = Math.random() * maxStart;
  var luckTarget = 15 + Math.random() * 30;
  var luckBlend  = Math.min(0.8, pLck * 0.12);
  var zoneStart  = Math.round(rawStart * (1 - luckBlend) + luckTarget * luckBlend);
  zoneStart = Math.max(4, Math.min(maxStart - 4, zoneStart));

  return { speed: speed, successMin: zoneStart, successMax: zoneStart + zoneW };
}
