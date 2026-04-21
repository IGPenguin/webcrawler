var SaveManager = (function () {
  var HISTORY_KEY  = 'sessionHistory';
  var STATE_KEY    = 'gameState';
  var MAX_SESSIONS = 20;

  // ── Session history ────────────────────────────────────────────────────────

  function saveSession(session) {
    var history = listSessionHistory();
    history.unshift(session);
    if (history.length > MAX_SESSIONS) history.length = MAX_SESSIONS;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.log('SaveManager: history write failed', e);
    }
  }

  function listSessionHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  // ── Mid-run game state ─────────────────────────────────────────────────────
  // Called from redraw() after every action. Snapshots all runtime globals
  // that are not re-derivable from the CSV files on the next page load.
  // linesGenerator / linesLoot are rebuilt from encounters.csv — not saved.

  function saveGameState() {
    if (typeof linesStory === 'undefined' || !linesStory || !linesStory.length) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        // ── Player ──────────────────────────────────────────────────────────
        playerName:         playerName,
        playerNumber:       playerNumber,
        playerKills:        playerKills,
        playerLootString:   String(playerLootString),
        playerPartyString:  String(playerPartyString),
        playerHpMax:        playerHpMax,   playerStaMax:      playerStaMax,
        playerMgkMax:       playerMgkMax,
        playerHp:           playerHp,      playerSta:         playerSta,
        playerLck:          playerLck,     playerInt:         playerInt,
        playerAtk:          playerAtk,     playerAtkBonus:    playerAtkBonus,
        playerDef:          playerDef,     playerMgk:         playerMgk,
        playerXP:           playerXP,      playerLevel:       playerLevel,
        playerXPThreshold:  playerXPThreshold,
        playerLove:         playerLove,    playerKarma:       playerKarma,
        playerRested:       playerRested,  playerCooked:      playerCooked,
        playerShopped:      playerShopped, playerDestined:    playerDestined, playerEmoji: playerEmoji,
        bubblesUsed:        bubblesUsed,
        playerAttackType:   playerAttackType, playerRollType: playerRollType,
        playerBlockType:    playerBlockType,  playerSleepType: playerSleepType,
        playerSpeakType:    playerSpeakType,  playerCastType: playerCastType,
        playerHealType:     playerHealType,   playerCurseType: playerCurseType,
        savedCoins:         savedCoins,    spentCoins:        spentCoins,
        // ── Progression / logging ────────────────────────────────────────────
        adventureStartTime:    adventureStartTime,
        adventureLog:          adventureLog,
        adventureEncounterCount: adventureEncounterCount,
        adventureEndReason:    adventureEndReason,
        seenLoot:              seenLoot,
        seenEncounters:        seenEncounters,
        usedShopMessages:      usedShopMessages,
        // ── Current encounter ────────────────────────────────────────────────
        enemyEmoji:            enemyEmoji,  enemyName:   enemyName,
        enemyHp:               enemyHp,     enemyAtk:    enemyAtk,
        enemySta:              enemySta,    enemyLck:    enemyLck,
        enemyInt:              enemyInt,    enemyMgk:    enemyMgk,
        enemyDef:              enemyDef,
        enemyType:             enemyType,   previousEnemyType: previousEnemyType,
        enemyContainerNumber:  enemyContainerNumber,
        enemyTeam:             String(enemyTeam),
        enemyDesc:             enemyDesc,   enemyMsg:    enemyMsg,
        enemyQuestItems:       String(enemyQuestItems),
        enemyHpLost:           enemyHpLost, enemyStaLost: enemyStaLost,
        enemyAtkBonus:         enemyAtkBonus, enemyIntBonus: enemyIntBonus,
        enemyMgkLost:          enemyMgkLost,
        enemyEmojiScaleX:      enemyEmojiScaleX,
        enemyBossType:         enemyBossType,
        enemyCursed:           enemyCursed,
        totalBonus:            totalBonus,  totalMalus:  totalMalus,
        isFishing:             isFishing,   encounterUsed: encounterUsed,
        // ── Area / story queue ───────────────────────────────────────────────
        areaName:              areaName,    previousArea: previousArea,
        encounterIndex:        encounterIndex,
        lastEncounterIndex:    lastEncounterIndex,
        lastGeneratorName:     lastGeneratorName,
        linesStory:            linesStory
      }));
    } catch (e) {
      console.log('SaveManager: gameState write failed', e);
    }
  }

  function loadGameState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function restoreGameState(s) {
    // Player
    playerName        = s.playerName;       playerNumber      = s.playerNumber;
    playerKills       = s.playerKills;
    playerLootString  = s.playerLootString; playerPartyString = s.playerPartyString;
    playerHpMax       = s.playerHpMax;      playerStaMax      = s.playerStaMax;
    playerMgkMax      = s.playerMgkMax;
    playerHp          = s.playerHp;         playerSta         = s.playerSta;
    playerLck         = s.playerLck;        playerInt         = s.playerInt;
    playerAtk         = s.playerAtk;        playerAtkBonus    = s.playerAtkBonus;
    playerDef         = s.playerDef;        playerMgk         = s.playerMgk;
    playerXP          = s.playerXP;         playerLevel       = s.playerLevel;
    playerXPThreshold = s.playerXPThreshold;
    playerLove        = s.playerLove;       playerKarma       = s.playerKarma;
    playerRested      = s.playerRested;     playerCooked      = s.playerCooked;
    playerShopped     = s.playerShopped;    playerDestined    = s.playerDestined;    playerEmoji       = s.playerEmoji || '';
    bubblesUsed       = s.bubblesUsed;
    playerAttackType  = s.playerAttackType; playerRollType    = s.playerRollType;
    playerBlockType   = s.playerBlockType;  playerSleepType   = s.playerSleepType;
    playerSpeakType   = s.playerSpeakType;  playerCastType    = s.playerCastType;
    playerHealType    = s.playerHealType;   playerCurseType   = s.playerCurseType;
    savedCoins        = s.savedCoins;       spentCoins        = s.spentCoins;
    // Progression
    adventureStartTime      = s.adventureStartTime;
    adventureLog            = s.adventureLog;
    adventureEncounterCount = s.adventureEncounterCount;
    adventureEndReason      = s.adventureEndReason;
    seenLoot                = s.seenLoot       || [];
    seenEncounters          = s.seenEncounters || [];
    usedShopMessages        = s.usedShopMessages || [];
    // Enemy
    enemyEmoji           = s.enemyEmoji;   enemyName          = s.enemyName;
    enemyHp              = s.enemyHp;      enemyAtk           = s.enemyAtk;
    enemySta             = s.enemySta;     enemyLck           = s.enemyLck;
    enemyInt             = s.enemyInt;     enemyMgk           = s.enemyMgk;
    enemyDef             = s.enemyDef;
    enemyType            = s.enemyType;    previousEnemyType  = s.previousEnemyType;
    enemyContainerNumber = s.enemyContainerNumber;
    enemyTeam            = s.enemyTeam;    enemyDesc          = s.enemyDesc;
    enemyMsg             = s.enemyMsg;     enemyQuestItems    = s.enemyQuestItems;
    enemyHpLost          = s.enemyHpLost;  enemyStaLost       = s.enemyStaLost;
    enemyAtkBonus        = s.enemyAtkBonus; enemyIntBonus     = s.enemyIntBonus;
    enemyMgkLost         = s.enemyMgkLost;
    enemyEmojiScaleX     = s.enemyEmojiScaleX;
    enemyBossType        = s.enemyBossType;
    enemyCursed          = s.enemyCursed;
    totalBonus           = s.totalBonus;   totalMalus         = s.totalMalus;
    isFishing            = s.isFishing;    encounterUsed      = s.encounterUsed;
    // Area / story
    areaName           = s.areaName;      previousArea       = s.previousArea;
    encounterIndex     = s.encounterIndex;
    lastEncounterIndex = s.lastEncounterIndex;
    lastGeneratorName  = s.lastGeneratorName;
    linesStory         = s.linesStory;
  }

  function clearGameState() {
    localStorage.removeItem(STATE_KEY);
  }

  // Saves the active run as an abandoned session, then clears it.
  // Called when the player confirms New Game while a run is in progress.
  function abandonCurrentRun() {
    var saved = loadGameState();
    if (!saved) return;
    saveSession({
      date:         saved.adventureStartTime,
      playerName:   saved.playerName,
      level:        saved.playerLevel,
      kills:        saved.playerKills,
      area:         saved.areaName,
      causeOfDeath: '❌ Given up',
      outcome:      'abandoned',
      actionLog:    saved.adventureLog,
      playerHpMax:       saved.playerHpMax,
      playerStaMax:      saved.playerStaMax,
      playerAtk:         saved.playerAtk,
      playerMgkMax:      saved.playerMgkMax,
      playerLootString:  String(saved.playerLootString  || ''),
      playerPartyString: String(saved.playerPartyString || ''),
      sessionAchievements: (typeof AchievementManager !== 'undefined' ? AchievementManager.getSessionUnlocked() : [])
    });
    clearGameState();
  }

  // ── Meta-save (coins) ──────────────────────────────────────────────────────

  // Wipes active run and fishing loot — coins are intentionally preserved
  function clearSave() {
    localStorage.removeItem('seenLoot');
    clearGameState();
  }

  function clearAll() {
    localStorage.removeItem('coins'); // full wipe only
    clearSave();
    localStorage.removeItem(HISTORY_KEY);
  }

  // Continue is available whenever an active run snapshot exists
  function hasContinue() {
    return loadGameState() !== null;
  }

  // Patches only playerName in the existing save — safe to call without linesStory loaded.
  function patchPlayerName(newName) {
    var s = loadGameState();
    if (!s) return;
    s.playerName = newName;
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  return {
    hasContinue:        hasContinue,
    saveGameState:      saveGameState,
    loadGameState:      loadGameState,
    restoreGameState:   restoreGameState,
    clearGameState:     clearGameState,
    abandonCurrentRun:  abandonCurrentRun,
    saveSession:        saveSession,
    listSessionHistory: listSessionHistory,
    clearSave:          clearSave,
    clearAll:           clearAll,
    patchPlayerName:    patchPlayerName
  };
})();
