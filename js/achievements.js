var AchievementManager = (function () {
  var STORAGE_KEY = 'achievements';
  var STATS_KEY   = 'achievStats';

  var ACHIEVEMENTS = [
    { id: 'all_achievements',    emoji: '🏆', desc: "<b>Completed every single memory!</b>", hint: "<b>Gotta catch 'em all to get into Credits!</b>" },
    { id: 'boss_kill_first',     emoji: '♠️', desc: 'Unlocked <b>Origins</b> by beating a boss!', hint: "Defeat the first challenging enemy!" },
    { id: 'destiny_first',       emoji: '📜', desc: 'Picked an Origin for the first time!', hint: "Start over, this time different." },
    { id: 'coin_first',          emoji: '🪙', desc: 'Unlocked <b>Shade</b> to spend Drachmae!', hint: "Obtain the everlasting currency!" },
    { id: 'coin_3',              emoji: '💰', desc: 'Set up for success with 3 Drachmae!', hint: "Fill your pouch to the brim." },
    { id: 'game_win_first',      emoji: '👑', desc: 'Finished the game for the first time!', hint: "Understand how did everything begin."},
    { id: 'hardcore_win',        emoji: '☠️', desc: 'Finished the game on Hardcore difficulty!', hint: 'Prove your dedication and true skill.' },

    { id: 'kill_first',          emoji: '💔', desc: 'Defeated your first enemy!', hint: "Spill blood for the first time." },
    { id: 'knockout_first',      emoji: '💤', desc: 'Knocked out your first enemy!', hint: 'It does not have to hurt.' },
    { id: 'calm_first',          emoji: '💬', desc: 'Talked an enemy into submission!', hint: 'How about trying de-escalation?' },
    { id: 'survive_trap',        emoji: '💥', desc: 'Survived a deadly trap!', hint: 'Watch where you step.' },

    { id: 'died_first',          emoji: '💀', desc: 'Died for the first time!', hint: "Finally face the inevitable." },
    { id: 'death_trap',          emoji: '🪤', desc: 'Killed by a trap!', hint: 'Ooops... that was deadly.' },
    { id: 'death_sleep',         emoji: '💤', desc: 'Died in your sleep...', hint: 'Not the peaceful rest you hoped for.' },
    { id: 'reincarnated_first',  emoji: '✨', desc: 'Reincarnated for the first time!', hint: "Don't give up skeleton!" },
    { id: 'level_first',         emoji: '🎉', desc: 'Leveled up for the first time!', hint: 'Gain experience. Grow stronger.' },
    { id: 'level_5',             emoji: '🎊', desc: 'Reached level 5!', hint: 'The path ahead grows longer.' },
    { id: 'fish_bait_first',     emoji: '🎣', desc: 'Caught something for the first time!', hint: "Whaaat? There's fishing?" },
    { id: 'fish_no_bait_first',  emoji: '🪝', desc: 'Caught something without a bait!', hint: "Pffft... who needs a bait anyway?" },

    { id: 'mana_first',          emoji: '🔵', desc: 'Gained mana for the first time!', hint: 'Magic answers to the willing.' },
    { id: 'cast_first',          emoji: '💫', desc: 'Cast a spell for the first time!', hint: 'Keep your distance for an advantage.' },
    { id: 'heal_first',          emoji: '❤️‍🩹', desc: 'Healed yourself for the first time!', hint: 'Mend what can still be mended.' },
    { id: 'curse_first',         emoji: '🪬', desc: 'Cursed an enemy for the first time!', hint: 'Darkness may prove useful.' },

    { id: 'loot_first',          emoji: '📦', desc: 'Picked up your first item!', hint: 'There is always something to find.' },
    { id: 'key_first',           emoji: '🗝️', desc: 'Picked up a key for the first time!', hint: 'Some doors remain shut for now.' },
    { id: 'key_unlock_first',    emoji: '🔓', desc: 'Unlocked a door with a key for the first time!', hint: 'The right key for the right lock.' },
    { id: 'smash_door_first',    emoji: '🔨', desc: 'Smashed a door open for the first time!', hint: 'When keys fail, force prevails.' },
    { id: 'magic_unlock_first',  emoji: '🪄', desc: 'Unlocked a door with magic for the first time!', hint: 'Magic opens more than minds.' },
    { id: 'grab_exquisite',      emoji: '🟣', desc: 'Grabbed your first exquisite item!', hint: 'A mark of quality.' },
    { id: 'grab_artifact',       emoji: '🏺', desc: 'Found your first artifact!', hint: 'Some items are truly legendary.' },
    { id: 'grab_rubbish',        emoji: '🕸️', desc: 'Picked up something useless!', hint: 'Nothing wrong with low standards.' },

    { id: 'eat_hazardous',       emoji: '🤢', desc: 'Consumed something hazardous!', hint: 'Are you sure? Suit yourself...' },
    { id: 'eat_purple',          emoji: '💜', desc: 'Consumed a premium refreshment!', hint: 'The finer things in death.' },
    { id: 'eat_legendary',       emoji: '🍔', desc: 'Consumed a legendary refreshment!', hint: 'Become a certified gourmet.' },

    { id: 'pet_first',           emoji: '🐾', desc: 'Got your first pet!', hint: 'Befriend a furry being.' },
    { id: 'recruit_first',       emoji: '🤝', desc: 'Recruited your first ally!', hint: 'Talk someone to join your side.' },
    { id: 'full_party',          emoji: '👥', desc: 'Got a party of three companions!', hint: 'The more, the merrier, always.' },

    { id: 'discover_forsaken',   emoji: '🏚️', desc: 'Discovered: Forsaken Village!', hint: "Seek the long forgotten village." },
    { id: 'discover_fairyland',  emoji: '🍄', desc: 'Discovered: Twisted Fairyland!', hint: "Seek the home of supernatural beings." },
    { id: 'discover_river',      emoji: '🌊', desc: 'Discovered: River of Sorrows!', hint: "Sail the flows of eternal tears." },
    { id: 'discover_necropolis', emoji: '🪦', desc: 'Discovered: Shrouded Necropolis!', hint: "Where the deepest shadows dwell." },

    //Missing "Aspect buy" achiev
    { id: 'gamble_win_first',    emoji: '🍀', desc: 'Won the gamble for the first time!', hint: "Luck smiles upon the bold." },
    { id: 'gamble_lose_first',   emoji: '🥺', desc: 'Lost the gamble for the first time!', hint: "The house always wins." },
    { id: 'buy_item_first',      emoji: '⚖️', desc: 'Bought an item from the Shade!', hint: "A fair trade for a fair price." },
    { id: 'buy_artifact_first',  emoji: '💎', desc: 'Bought an artifact from the Shade!', hint: "An eye for the unusual antiques." },
    { id: 'buy_level_first',     emoji: '📈', desc: 'Bought a level up from the Shade!', hint: "Shortcut to power, at a cost." },
    { id: 'spent_10',            emoji: '💸', desc: 'Spent 10 Drachmae at the Shade!', hint: "A loyal customer of the shadows." },
    
    { id: 'letter_remember',     emoji: '💌', desc: 'Read a disturbing letter...', hint: 'Some things are better left in the past.' },
    { id: 'letter_grab',         emoji: '✉️', desc: 'Kept a disturbing letter with you.', hint: 'Could not bring yourself to leave it.' },
    { id: 'letter_ditch',        emoji: '💔', desc: 'Cast a disturbing letter aside.', hint: 'Letting go hurts more than holding on.' },
    
    { id: 'cook_food_first',     emoji: '🔥', desc: 'Cooked your first meal!', hint: 'Sometimes survival requires creativity.' },
    { id: 'salt_food_first',     emoji: '🧂', desc: 'Seasoned your first meal!', hint: 'A pinch of salt goes a long way.' },
    { id: 'fish_legendary_first',emoji: '🏺', desc: 'Reeled in a legendary find!', hint: 'The best things are worth waiting for.' },
    { id: 'fish_boss_first',     emoji: '🦕', desc: 'Fished out a legendary beast!', hint: 'The rumors were true after all.' },
    { id: 'spoke_boss',          emoji: '🗣️', desc: 'Spoke a Boss into submission!', hint: 'Could peace be an actual option?' },
    { id: 'quest_first',         emoji: '⭐️', desc: 'Completed your first quest!', hint: 'Bring them what they ask for.' },
    { id: 'touch_grass',         emoji: '🌿', desc: 'You finally touched the grass!', hint: 'Try going outside and then?' },

    { id: 'destiny_10',          emoji: '♻️', desc: 'Started over again 10 times!', hint: "Repeat the cycle again and again." },
    { id: 'kill_50',             emoji: '🔪', desc: 'Defeated 50 enemies!', hint: "A growing trail of broken spirits." },
    { id: 'knockout_50',         emoji: '✌️', desc: 'Knocked out 50 enemies!', hint: "Mercy becomes your second nature." },
    { id: 'boss_kill_10',        emoji: '🎖️', desc: 'Defeated 10 bosses!', hint: "Giant slayer, born in struggle." },
    { id: 'fish_bait_50',        emoji: '🎏', desc: 'Caught something 50 times!', hint: "Master the haunted waters." },
    { id: 'fish_no_bait_50',     emoji: '😎', desc: 'Caught something with no bait 50 times!', hint: "Pure skill always beats the odds." },
    { id: 'gamble_win_10',       emoji: '🎰', desc: 'Won the gamble 10 times!', hint: "Become a seasoned gambler." },

    { id: 'use_cheat',           emoji: '⚠️', desc: 'Used a cheat for the first time!', hint: 'Try using a secret name...' }
  ];
  // hint: optional short clue shown on locked entries (omit or leave empty to show nothing)

  var _defaultStats = {
    totalDeaths:         0,
    totalReincarnations: 0,
    maxSavedCoins:       0,
    totalCoinsSpent:     0,
    totalGambleWins:     0,
    totalGambleLosses:   0,
    totalDestinyAccepts: 0,
    totalKills:          0,
    totalBossKills:      0,
    totalKnockouts:      0,
    calmedEnemy:         false,
    gotPet:              false,
    gotRecruit:          false,
    completedQuest:      false,
    spokeBoss:           false,
    survivedTrap:        false,
    fullParty:           false,
    totalFishBait:       0,
    totalFishNoBait:     0,
    boughtItem:          false,
    boughtArtifact:      false,
    boughtLevel:         false,
    wonGame:             false,
    discoveredAreas:     [],
    grabbedArtifact:     false,
    grabbedExquisite:    false,
    grabbedRubbish:      false,
    lootFirst:           false,
    keyFirst:            false,
    keyUnlockFirst:      false,
    smashDoorFirst:      false,
    magicUnlockFirst:    false,
    manaFirst:           false,
    castFirst:           false,
    healFirst:           false,
    curseFirst:          false,
    ateHazardous:        false,
    atePurple:           false,
    ateLegendary:        false,
    leveledFirst:        false,
    reachedLevel5:       false,
    usedCheat:           false,
    fishedBoss:          false,
    fishedLegendary:     false,
    cookedFood:          false,
    saltedFood:          false,
    letterRemember:      false,
    letterGrab:          false,
    letterDitch:         false,
    diedByTrap:          false,
    diedBySleep:         false
  };

  var _unlocked       = {};
  var _stats          = {};
  var _sessionUnlocked = [];
  var _toastQueue     = [];
  var _toastActive    = false;

  // ── Persistence ──────────────────────────────────────────────────────────

  function _load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      _unlocked = raw ? JSON.parse(raw) : {};
    } catch(e) { _unlocked = {}; }
    try {
      var rawStats = localStorage.getItem(STATS_KEY);
      _stats = rawStats ? JSON.parse(rawStats) : {};
    } catch(e) { _stats = {}; }
    Object.keys(_defaultStats).forEach(function(k) {
      if (_stats[k] === undefined) {
        _stats[k] = JSON.parse(JSON.stringify(_defaultStats[k]));
      }
    });
  }

  function _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_unlocked)); } catch(e) {}
    try { localStorage.setItem(STATS_KEY,   JSON.stringify(_stats));    } catch(e) {}
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  function _showNextToast() {
    if (_toastQueue.length === 0) { _toastActive = false; return; }
    _toastActive = true;
    var achievement = _toastQueue.shift();
    var ts = AchievementManager.getUnlockTime(achievement.id);
    showAchievementToast(achievement, ts, function() {
      _toastActive = false;
      _showNextToast();
    });
  }

  // ── Unlock ────────────────────────────────────────────────────────────────

  function _checkAllAchievements() {
    if (_unlocked['all_achievements']) return;
    var allDone = ACHIEVEMENTS.every(function(a) {
      return a.id === 'all_achievements' || !!_unlocked[a.id];
    });
    if (allDone) _unlock('all_achievements');
  }

  function _unlock(id) {
    if (_unlocked[id]) return;
    _unlocked[id] = Date.now();
    _sessionUnlocked.push(id);
    _save();
    var achievement = null;
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (ACHIEVEMENTS[i].id === id) { achievement = ACHIEVEMENTS[i]; break; }
    }

    // Add log
    if (achievement) setTimeout(function () {
      var MAX_LENGTH = 45;
      var text = achievement.desc;
      if (text.length > MAX_LENGTH) text = achievement.desc.substring(0,MAX_LENGTH)+"..."
      
      logAction("🧩 ▸ "+achievement.emoji+" <b style=\"color:"+colorGold+"\";>"+text+"</b>");
      redraw();
    },1) //Hehehehe, hack to log after logging action done

    // Show toast
    if (achievement) {
      _toastQueue.push(achievement);
      if (!_toastActive) _showNextToast();
    }

    if (id !== 'all_achievements') _checkAllAchievements();
  }

  function dismissToast() {
    var toast = document.getElementById('achievement_toast');
    if (!toast) return;
    toast.style.transition = 'opacity 0.25s';
    toast.style.opacity = '0';
    setTimeout(function() {
      if (document.getElementById('achievement_toast') === toast) toast.remove();
      _toastActive = false;
      _showNextToast();
    }, 260);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function check(trigger, value) {
    switch (trigger) {

      case 'death':
        _stats.totalDeaths++;
        _save();
        if (_stats.totalDeaths === 1) _unlock('died_first');
        break;

      case 'reincarnate':
        _stats.totalReincarnations++;
        _save();
        if (_stats.totalReincarnations === 1) _unlock('reincarnated_first');
        break;

      case 'coin_pickup':
        // value = current savedCoins after pickup
        if (value > _stats.maxSavedCoins) { _stats.maxSavedCoins = value; _save(); }
        if (_stats.maxSavedCoins >= 1) _unlock('coin_first');
        if (_stats.maxSavedCoins >= 3) _unlock('coin_3');
        break;

      case 'gamble_win':
        _stats.totalGambleWins++;
        _save();
        if (_stats.totalGambleWins === 1)  _unlock('gamble_win_first');
        if (_stats.totalGambleWins >= 10)  _unlock('gamble_win_10');
        break;

      case 'gamble_lose':
        _stats.totalGambleLosses++;
        _save();
        if (_stats.totalGambleLosses === 1) _unlock('gamble_lose_first');
        break;

      case 'destiny':
        _stats.totalDestinyAccepts++;
        _save();
        if (_stats.totalDestinyAccepts === 1)  _unlock('destiny_first');
        if (_stats.totalDestinyAccepts >= 10)  _unlock('destiny_10');
        break;

      case 'buy_item':
        if (!_stats.boughtItem) { _stats.boughtItem = true; _save(); _unlock('buy_item_first'); }
        break;

      case 'buy_artifact':
        if (!_stats.boughtArtifact) { _stats.boughtArtifact = true; _save(); _unlock('buy_artifact_first'); }
        break;

      case 'buy_level':
        if (!_stats.boughtLevel) { _stats.boughtLevel = true; _save(); _unlock('buy_level_first'); }
        break;

      case 'spend_coins':
        _stats.totalCoinsSpent += (value || 0);
        _save();
        if (_stats.totalCoinsSpent >= 10) _unlock('spent_10');
        break;

      case 'kill':
        _stats.totalKills++;
        _save();
        if (_stats.totalKills === 1)  _unlock('kill_first');
        if (_stats.totalKills >= 50)  _unlock('kill_50');
        break;

      case 'boss_kill':
        _stats.totalBossKills++;
        _save();
        if (_stats.totalBossKills === 1)  _unlock('boss_kill_first');
        if (_stats.totalBossKills >= 10)  _unlock('boss_kill_10');
        break;

      case 'knockout':
        _stats.totalKnockouts++;
        _save();
        if (_stats.totalKnockouts === 1)  _unlock('knockout_first');
        if (_stats.totalKnockouts >= 50)  _unlock('knockout_50');
        break;

      case 'calm_enemy':
        if (!_stats.calmedEnemy) { _stats.calmedEnemy = true; _save(); _unlock('calm_first'); }
        break;

      case 'get_pet':
        if (!_stats.gotPet) { _stats.gotPet = true; _save(); _unlock('pet_first'); }
        break;

      case 'get_recruit':
        if (!_stats.gotRecruit) { _stats.gotRecruit = true; _save(); _unlock('recruit_first'); }
        break;

      case 'quest_complete':
        if (!_stats.completedQuest) { _stats.completedQuest = true; _save(); _unlock('quest_first'); }
        break;

      case 'calm_boss':
        if (!_stats.spokeBoss) { _stats.spokeBoss = true; _save(); _unlock('spoke_boss'); }
        break;

      case 'survive_trap':
        if (!_stats.survivedTrap) { _stats.survivedTrap = true; _save(); _unlock('survive_trap'); }
        break;

      case 'full_party':
        if (!_stats.fullParty) { _stats.fullParty = true; _save(); _unlock('full_party'); }
        break;

      case 'fish_bait':
        _stats.totalFishBait++;
        _save();
        if (_stats.totalFishBait === 1)   _unlock('fish_bait_first');
        if (_stats.totalFishBait >= 50)  _unlock('fish_bait_50');
        break;

      case 'fish_no_bait':
        _stats.totalFishNoBait++;
        _save();
        if (_stats.totalFishNoBait === 1)   _unlock('fish_no_bait_first');
        if (_stats.totalFishNoBait >= 50)  _unlock('fish_no_bait_50');
        break;

      case 'discover_area': {
        var _areaMap = {
          'Forsaken Village':    'discover_forsaken',
          'Twisted Fairyland':   'discover_fairyland',
          'River of Sorrows':    'discover_river',
          'Shrouded Necropolis': 'discover_necropolis'
        };
        var _achId = _areaMap[value];
        if (_achId && !_stats.discoveredAreas.includes(value)) {
          _stats.discoveredAreas.push(value);
          _save();
          _unlock(_achId);
        }
        break;
      }

      case 'grab_artifact':
        if (!_stats.grabbedArtifact) { _stats.grabbedArtifact = true; _save(); _unlock('grab_artifact'); }
        break;

      case 'grab_exquisite':
        if (!_stats.grabbedExquisite) { _stats.grabbedExquisite = true; _save(); _unlock('grab_exquisite'); }
        break;

      case 'grab_rubbish':
        if (!_stats.grabbedRubbish) { _stats.grabbedRubbish = true; _save(); _unlock('grab_rubbish'); }
        break;

      case 'loot_first':
        if (!_stats.lootFirst) { _stats.lootFirst = true; _save(); _unlock('loot_first'); }
        break;

      case 'key_first':
        if (!_stats.keyFirst) { _stats.keyFirst = true; _save(); _unlock('key_first'); }
        break;

      case 'key_unlock_first':
        if (!_stats.keyUnlockFirst) { _stats.keyUnlockFirst = true; _save(); _unlock('key_unlock_first'); }
        break;

      case 'smash_door_first':
        if (!_stats.smashDoorFirst) { _stats.smashDoorFirst = true; _save(); _unlock('smash_door_first'); }
        break;

      case 'magic_unlock_first':
        if (!_stats.magicUnlockFirst) { _stats.magicUnlockFirst = true; _save(); _unlock('magic_unlock_first'); }
        break;

      case 'mana_first':
        if (!_stats.manaFirst) { _stats.manaFirst = true; _save(); _unlock('mana_first'); }
        break;

      case 'cast_first':
        if (!_stats.castFirst) { _stats.castFirst = true; _save(); _unlock('cast_first'); }
        break;

      case 'heal_first':
        if (!_stats.healFirst) { _stats.healFirst = true; _save(); _unlock('heal_first'); }
        break;

      case 'curse_first':
        if (!_stats.curseFirst) { _stats.curseFirst = true; _save(); _unlock('curse_first'); }
        break;

      case 'eat_hazardous':
        if (!_stats.ateHazardous) { _stats.ateHazardous = true; _save(); _unlock('eat_hazardous'); }
        break;

      case 'eat_purple':
        if (!_stats.atePurple) { _stats.atePurple = true; _save(); _unlock('eat_purple'); }
        break;

      case 'eat_legendary':
        if (!_stats.ateLegendary) { _stats.ateLegendary = true; _save(); _unlock('eat_legendary'); }
        break;

      case 'level_up':
        if (!_stats.leveledFirst) { _stats.leveledFirst = true; _save(); _unlock('level_first'); }
        if ((value >= 5) && !_stats.reachedLevel5) { _stats.reachedLevel5 = true; _save(); _unlock('level_5'); }
        break;

      case 'use_cheat':
        if (!_stats.usedCheat) { _stats.usedCheat = true; _save(); _unlock('use_cheat'); }
        break;

      case 'game_win':
        if (!_stats.wonGame) { _stats.wonGame = true; _save(); _unlock('game_win_first'); }
        break;

      case 'hardcore_win':
        _unlock('hardcore_win');
        break;

      case 'touch_grass':
        _unlock('touch_grass');
        break;

      case 'fish_boss':
        if (!_stats.fishedBoss) { _stats.fishedBoss = true; _save(); _unlock('fish_boss_first'); }
        break;

      case 'fish_legendary':
        if (!_stats.fishedLegendary) { _stats.fishedLegendary = true; _save(); _unlock('fish_legendary_first'); }
        break;

      case 'cook_food':
        if (!_stats.cookedFood) { _stats.cookedFood = true; _save(); _unlock('cook_food_first'); }
        break;

      case 'salt_food':
        if (!_stats.saltedFood) { _stats.saltedFood = true; _save(); _unlock('salt_food_first'); }
        break;

      case 'letter_remember':
        if (!_stats.letterRemember) { _stats.letterRemember = true; _save(); _unlock('letter_remember'); }
        break;

      case 'letter_grab':
        if (!_stats.letterGrab) { _stats.letterGrab = true; _save(); _unlock('letter_grab'); }
        break;

      case 'letter_ditch':
        if (!_stats.letterDitch) { _stats.letterDitch = true; _save(); _unlock('letter_ditch'); }
        break;

      case 'death_trap':
        if (!_stats.diedByTrap) { _stats.diedByTrap = true; _save(); _unlock('death_trap'); }
        break;

      case 'death_sleep':
        if (!_stats.diedBySleep) { _stats.diedBySleep = true; _save(); _unlock('death_sleep'); }
        break;
    }
  }

  function resetSession() {
    _sessionUnlocked = [];
  }

  function getSessionUnlocked() {
    return _sessionUnlocked.slice();
  }

  function isUnlocked(id) {
    return !!_unlocked[id];
  }

  function getUnlockTime(id) {
    var ts = _unlocked[id];
    if (!ts || ts === true) return null; // backwards-compat: old saves stored `true`
    return ts;
  }

  function getAll() {
    return ACHIEVEMENTS;
  }

  function clearAll() {
    _unlocked = {};
    _stats = JSON.parse(JSON.stringify(_defaultStats));
    _save();
  }

  _load();

  return {
    check:               check,
    dismissToast:        dismissToast,
    resetSession:        resetSession,
    getSessionUnlocked:  getSessionUnlocked,
    isUnlocked:          isUnlocked,
    getUnlockTime:       getUnlockTime,
    getAll:              getAll,
    clearAll:            clearAll
  };
})();
