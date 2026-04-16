//Run logger (localhost only)
var runLog = [];
var runLogStart = "";

var savedCoins = 0; // populated from localStorage in menu.js before each new game

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
var fishingRested = false; // persists through getRandomFish/encounterRenew; reset only on nextEncounter or new run
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

var drachmaShop=["area:Fading Wildlands","emoji:👤","name:Undertaker Shade","type:Shop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Voidwatcher","desc:Well met\\ what's it gonna be this time?<br>","message:Set out on another adventure!"]
var drachmaPrize=["area:Fading Wildlands","emoji:🪙","name:Lucky Drachma","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Temporary reward for <b>one-time use only</b>.<br>Beware\\ gambling might be addictive.","message:Claimed a <b>Lucky Drachma +1 🪙</b>"]
var drachmaCoin=["area:Wherever","emoji:🪙","name:Ethereal Drachma","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Entangles with one's soul on touch.<br>","message:Claimed an <b>Ethereal Drachma +1 🪙</b>"]
var gamblingLost=["area:Wherever","emoji:🥺","name:Worthless Regrets","type:Dream","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Unlucky Moment","desc:Ooops! <b>The gamble did not pay off.</b><br>Perhaps better luck next time?","message:Released a long disappointed sigh..."]
var drachmaeBag=["area:Wherever","emoji:💰","name:Drachmae Reward","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Gambling winnings useful in the afterlife.<br>","message:Claimed an <b>Ethereal Drachma +1 🪙</b>"] //Unused
var usedShopMessages=[];

var attackTypes=(["🔪","🗡️","🔧","⛏️","🪚","🔨","🪓","🪛","🖋️","✂️","🪃","🪨","🌂","🦯","🥊","🪝","🦷","🪠","🗞️","🔱","🧹","🥏"])
var validBlades=(["🔪","🗡️","🪛","🪚","🪓","✒️","🖋️","🖊️","🏹","🪝","🦷","✂️","🔱"])
var castTypes=(["⚡️","☄️","🍭","🔥","🪄","🥢","🌙","🎐","🎋","🖌️","📔","📘","📓"])
var validBaits=(["🪱","🦋","🐝","🐞","🦟","🦗","🐜","🪲","🪰","🪳","🕷","🦐","🦂","🍤","🐙","🐛","🦑","🐌"])
var validRess=["🫀","💾","♥️","🫁","🏵️","🛟","📼","💿"];

// Fishing bait quality: higher = wider success zone. Range roughly -2 to +3.
var baitQuality = {
  "🪱": 3,  // earthworm — great
  "🦐": 3,  // shrimp — great
  "🐙": 3,  // octopus — irresistible
  "🪲": 2,  // beetle
  "🦂": 2,  // scorpion
  "🍤": 2,  // fried shrimp
  "🦑": 2,  // squid
  "🦋": 1,  // butterfly
  "🐝": 1,  // bee
  "🦗": 1,  // cricket
  "🕷": 1,  // spider
  "🐛": 1,  // caterpillar
  "🐞": 0,  // ladybug — neutral
  "🐌": 0,  // snail — neutral
  "🦟": -1, // mosquito — bad
  "🪰": -2, // fly — terrible
  "🪳": -2, // cockroach — terrible
  "🐜": -1, // ant — poor
};

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
// adjustment: optional ±integer added to zoneW before clamping (positive = easier, negative = harder).
function calcActionBarConfig(button, adjustment) {
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

  // Cursor speed presets
  var ACTION_BAR_SPEED_MULT = 1.3; // Global multiplier — raise to make the bar harder everywhere.
  var spdInsane = 120;
  var spdHard = 90;
  var spdMedium = 60;
  var spdEasy = 30;

  // ── Special cases ────────────────────────────────────────────────────────

  // Sleep when already rested — impossible (bar all-red)
  if (button === 'button_sleep' && playerRested && types !== "Death") {
    return { speed: Math.round(52 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Sleep at fishing spot after already having rested this visit — impossible
  if (button === 'button_sleep' && fishingRested && types === 'Fishing' && types !== "Death") {
    return { speed: Math.round(52 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Cast / Heal / Curse with no mana — impossible (bar all-red)
  // button_pray is exempt on Curse type (action-resolver allows it without MGK)
  if ((button === 'button_cast' || (button === 'button_pray' && !isCurse) || button === 'button_curse') && pMgk <= 0) {
    return { speed: Math.round(52 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Exhausted grab: near-impossible without stamina (items/containers/fishing unaffected)
  if (button === 'button_grab' && pSta === 0 && !isGrabbable && types !== 'Fishing' && types !== "Death") {
    return { speed: Math.round(52 * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54 };
  }

  // Resurrection: very narrow, fast zone — last chance before permanent death
  // TODO spd-(playerKarma * ???)
  if (button === 'button_attack' && types.includes('Death')) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 45, successMax: 55 };
  }

   // Review on death: slow & green
  if (button === 'button_block' && types.includes('Death')) {
    return { speed: Math.round(32 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

   // Give up|inactive "-" on death: slow & red
  if ((button === 'button_attack' || button === 'button_grab' || button === 'button_sleep' || button === 'button_speak') && types.includes('Death')) {
    return { speed: Math.round(32 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Prop / encounterUsed walk: very wide zone — tiny stumble risk exists
  if (button === 'button_roll' && ( types === 'Prop'  ||  encounterUsed)) { 
    return { speed: Math.round(32 * ACTION_BAR_SPEED_MULT), successMin: 5, successMax: 95 };
  }

  // Dream walk: wide zone — small STA drain on fail
  if (button === 'button_roll' && types.includes('Dream')) {
    return { speed: Math.round(35 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Near-impossible attack/block/dodge at 0 stamina — tiny zone, always possible
  if (pSta === 0 && enemyType!="Item" && enemyType!="Shop" && (button === 'button_attack' || button === 'button_block' || button === 'button_roll')) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54 };
  }

  // Heavy grab: very very hard — tiny zone, high speed; fail enrages them
  if (button === 'button_grab' && isHeavy) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 46, successMax: 54 };
  }

  // Curse submit / walk when unresolved - will hurt
   if ((button === 'button_sleep' || button === 'button_roll') && ( types === 'Curse' && !encounterUsed)) {
    return { speed: Math.round(32 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Curse 100% safe if already resolved
  if (button === "button_pray" && encounterUsed) {
    return { speed: Math.round(32 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  } 

  // Curse endure: zone scales with the player stat being affected by the curse
  if ((button === 'button_roll' || button === "button_pray") && types === 'Curse') {
    var resistScore = 0;
    if ((enemyHp  || 0) < 0) resistScore = Math.max(resistScore, Math.max(0, playerHpMax || 0));
    if ((enemySta || 0) < 0) resistScore = Math.max(resistScore, pSta);
    if ((enemyAtk || 0) < 0) resistScore = Math.max(resistScore, pAtk);
    if ((enemyLck || 0) < 0) resistScore = Math.max(resistScore, pLck);
    if ((enemyInt || 0) < 0) resistScore = Math.max(resistScore, pInt);
    if ((enemyMgk || 0) < 0) resistScore = Math.max(resistScore, pMgk);

    // TODO make curse stats affect chance success
    var curseW = Math.max(15, Math.min(70, 20 + resistScore * 10));

    return { speed: Math.round(spdMedium * ACTION_BAR_SPEED_MULT), successMin: Math.max(5, 50 - Math.round(curseW/2)), successMax: Math.min(95, 50 + Math.round(curseW/2)) };
  }

  // Small grab: chance based on creature STA vs player STA
  if (button === 'button_grab' && types === 'Small') {
    var eStaSmall = Math.max(0, (enemySta || 0) - (enemyStaLost || 0));
    var smallW = Math.max(20, Math.min(85, Math.round(55 + pSta * 5 - eStaSmall * 12)));
    var smallMid = 50;
    return { speed: Math.round(44 * ACTION_BAR_SPEED_MULT), successMin: Math.max(3, smallMid - Math.round(smallW/2)), successMax: Math.min(97, smallMid + Math.round(smallW/2)) };
  }

  // Container search: luck scales zone width — bad luck = high chance of finding nothing
  if (button === 'button_grab' && types.includes('Container') && !types.includes('Locked')) {
    var searchW = Math.max(25, Math.min(82, Math.round(40 + pLck * 9)));
    return { speed: Math.round(30 * ACTION_BAR_SPEED_MULT), successMin: Math.max(4, 50 - Math.round(searchW/2)), successMax: Math.min(96, 50 + Math.round(searchW/2)) };
  }

  // Shop: Gamble = 50% zone, very fast; all other shop actions = full success zone; Tarot 100% zone
  if (types === 'Shop' || enemyName.includes("Tarot")) {
    if (button === 'button_block' && !enemyName.includes("Tarot")) { //Yolo again - Tarots are special, all good...
      return { speed: Math.round(180 * ACTION_BAR_SPEED_MULT), successMin: 45, successMax: 55 };
    }
    return { speed: Math.round(30 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Fishing: 0 STA = impossible; no bait = near-impossible; bait quality shifts zone width
  if (button === 'button_grab' && types === 'Fishing') {
    if (pSta === 0) {
      return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
    }
    var fishBait = checkPlayerHasItem(validBaits);
    if (fishBait === "") {
      return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
    }
    var fishBQ = baitQuality[fishBait] !== undefined ? baitQuality[fishBait] : 1;
    var fishMin = Math.max(3, 34 - fishBQ * 4);
    var fishMax = Math.min(97, 58 + fishBQ * 4);
    return { speed: Math.round(72 * ACTION_BAR_SPEED_MULT), successMin: fishMin, successMax: fishMax };
  }

  // Grab Stingy / Toxic / Undead — impossible (they bite back, you know it)
  if (button === 'button_grab' && (types.includes('Stingy') || types.includes('Toxic') || types.includes('Undead'))) {
    return { speed: Math.round(52 * ACTION_BAR_SPEED_MULT), successMin: -1, successMax: -1 };
  }

  // Trap wrong-action: small zone — risk of triggering it, but no penalty if passed
  // "Right" actions (Trap-Attack→attack, Trap-Roll→roll, Trap-Sleep→sleep, Trap-Obstacle→attack)
  // get normal calc; every other button on that trap type is penalised here.
  if (isTrap && types !== 'Trap' && types !== 'Trap-Big') {
    var _trapRight = (types === 'Trap-Attack'   && button === 'button_attack')
                  || (types === 'Trap-Roll'     && button === 'button_roll')
                  || (types === 'Trap-Sleep'    && button === 'button_sleep')
                  || (types === 'Trap-Obstacle' && button === 'button_attack');
    if (!_trapRight) {
      return { speed: Math.round(65 * ACTION_BAR_SPEED_MULT), successMin: 44, successMax: 56 };
    }
  }

  // Grab Prop — always succeeds, no skill required
  if (button === 'button_grab' && types === 'Prop') {
    return { speed: Math.round(30 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Speak Prop — always succeeds, no skill required
  if (button === 'button_speak' && types === 'Prop') {
    return { speed: Math.round(30 * ACTION_BAR_SPEED_MULT), successMin: 0, successMax: 100 };
  }

  // Tease (block on passive mob with stamina remaining) — hard, creature resists provocation
  if (button === 'button_block' && eAtk === 0 && eSta > 0 && !isGrabbable && !isTrap && !isAltar) {
    return { speed: Math.round(90 * ACTION_BAR_SPEED_MULT), successMin: 42, successMax: 58 };
  }

  // Pet minion (grab on exhausted Pet) — hard, they won't hold still
  if (button === 'button_grab' && types.includes('Pet') && eSta <= 0) {
    return { speed: Math.round(100 * ACTION_BAR_SPEED_MULT), successMin: 42, successMax: 58 };
  }

  // Attack Swift with stamina remaining — near-impossible, they dodge
  if (button === 'button_attack' && isSwift && eSta > 0) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Knockout on a not tired living creature — resists hard
  // Uses base enemyAtk (not eAtk) to ignore anger bonuses from prior actions this encounter.
  var _isCreatureMob = /Standard|Swift|Heavy|Pet|Spirit|Demon|Undead|Boss|Small|Stingy|Toxic|Hot|Tough|Reflective|Recruit|Friend/.test(types);
  if (button === 'button_grab' && _isCreatureMob && eSta > 0) {
    return { speed: Math.round(spdInsane * ACTION_BAR_SPEED_MULT), successMin: 47, successMax: 53 };
  }

  // Full-green: encounter has no ATK or MGK threat — automatic success
  var eAtkFull = Math.max(0, (enemyAtk || 0) + (enemyAtkBonus || 0));
  var eMgkFull = Math.max(0, (enemyMgk || 0) - (enemyMgkLost || 0));
  if (eAtkFull === 0 && eMgkFull === 0) {
    return { speed: Math.round(30 * ACTION_BAR_SPEED_MULT), successMin: 5, successMax: 95 };
  }

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
      eStat     = (isSmall  ? eSta * 3 : eSta * 2)   // unspent enemy STA scales grab difficulty
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

  var zoneW = Math.round(baseW + pStat * 6 - eStat * 4 + (adjustment || 0));
  
  // 100% * difficulty: 1 = unchanged, 0.75 = (-25% success zone width)
  zoneW = Math.round(zoneW * 0.75);
  zoneW = Math.max(12, Math.min(72, zoneW));

  // Default speed multiplier * 5, scaled by ACTION_BAR_SPEED_MULT
  var speed = Math.round((baseSpeed + pStat * 20) * ACTION_BAR_SPEED_MULT);
  speed = Math.max(36, Math.min(169, speed));

  // Zone position: random, luck blends toward an easier left-centre placement
  var maxStart   = 100 - zoneW;
  var rawStart   = Math.random() * maxStart;
  var luckTarget = 15 + Math.random() * 30;
  var luckBlend  = Math.min(0.8, pLck * 0.12);
  var zoneStart  = Math.round(rawStart * (1 - luckBlend) + luckTarget * luckBlend);
  zoneStart = Math.max(4, Math.min(maxStart - 4, zoneStart));

  return { speed: speed, successMin: zoneStart, successMax: zoneStart + zoneW };
}
