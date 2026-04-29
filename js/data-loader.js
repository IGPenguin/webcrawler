// ── CSV Loading ───────────────────────────────────────────────────────────────
// Loads story.csv, encounters.csv, and origins.csv via jQuery AJAX on page ready.
// Menu is shown immediately while CSVs load in the background.
// startGame() can be called before loading completes — it queues the start.

var _csvStoryLoaded = false;
var _pendingStart   = null; // null | true (continue) | false (new game)
var linesOrigins    = [];

$(document).ready(function() {
  Menu.init();

  $.ajax({ type: "GET", url: "data/story.csv", dataType: "text",
    success: function(data) {
      storyData = data;
      _csvStoryLoaded = true;
      if (_pendingStart !== null) _doStartGame(_pendingStart);
    }
  });

  $.ajax({ type: "GET", url: "data/encounters.csv", dataType: "text",
    success: function(data) { processEncounterData(data); }
  });

  $.ajax({ type: "GET", url: "data/origins.csv", dataType: "text",
    success: function(data) { processOriginsData(data); }
  });
});

// Called by menu buttons. Defers if story CSV isn't ready yet.
function startGame(isContinue) {
  if (_csvStoryLoaded) {
    _doStartGame(isContinue);
  } else {
    _pendingStart = isContinue;
    var btn = document.getElementById(isContinue ? 'menu_continue' : 'menu_new_game');
    if (btn && !btn.innerHTML.includes('…')) btn.innerHTML += ' …';
  }
}

function _doStartGame(isContinue) {
  _pendingStart = null;

  transitionToGame(function() {
    Menu.hide();

    if (isContinue) {
      var saved = SaveManager.loadGameState();
      if (saved) {
        SaveManager.restoreGameState(saved);
        // linesGenerator / linesLoot are rebuilt from encounters.csv on every load — no restore needed
        redraw();
        registerClickListeners(0);
        registerClickListenersTechnical();
        animateUIElement(emojiUIElement, "animate__pulse", "2", false, "", true);
        return;
      }
    }

    resetSeenEncounters();
    processStoryData(storyData);
    registerClickListeners(0);
    registerClickListenersTechnical();
  });
}

// ── CSV Parsers ───────────────────────────────────────────────────────────────
// All CSVs are semicolon-delimited. Each row becomes an array of "header:value" strings.
// The "((" token is replaced at runtime with ":" (workaround for colons in CSV fields).

function processStoryData(allText, initNextEncounter=true, encounterIndex=0) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesStory = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    if (data.length == headers.length) {
      var tarr = [];
      for (var j = 0; j < headers.length; j++) {
        tarr.push(headers[j] + ":" + data[j]);
      }
      linesStory.push(tarr);
    }
  }

  if (initNextEncounter) {
    loadEncounter(1 + initialEncounterOverride + encounterIndex); // 0 is the death screen

    if (savedCoins != NaN && savedCoins > 0) { // Returning player — skip tutorial, show shop
      logAction("♻️&nbsp;▸&nbsp;❤️ Seems like this is <b>not your first time.</b>");
      playerSta = playerStaMax;
      loadEncounter(5);
      drachmaShop[0] = "area:" + "Fading Wildlands";
      linesStory.splice(encounterIndex + 1, 1); // Remove realization encounter
      pushEncounter(drachmaShop);
    }
    if (savedCoins == 0) {
      loadEncounter(5);
      enemyName  = "Familiar Moment";
      enemyEmoji = "🤔";
      playerSta  = playerStaMax;
      logAction("♻️&nbsp;▸&nbsp;❤️ Seems like this is <b>not your first time.</b>");
    }

    redraw();
    animateUIElement(emojiUIElement, "animate__pulse", "2", false, "", true);
  }
}

// Splits encounters.csv into linesGenerator (all encounter types) and linesLoot (Fishing rows).
function processEncounterData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesGenerator = [];
  linesLoot = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    if (data.length == headers.length) {
      var tarr = [];
      for (var j = 0; j < headers.length; j++) {
        tarr.push(headers[j] + ":" + data[j]);
      }
      if (data[0] === "Fishing") {
        linesLoot.push(tarr);
      } else {
        linesGenerator.push(tarr);
      }
    }
  }
}

function processOriginsData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';').map(function(h) { return h.trim(); });
  linesOrigins = [];
  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    if (data.length === headers.length) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[j];
      }
      linesOrigins.push(row);
    }
  }
}

// ── Encounter Queue ───────────────────────────────────────────────────────────

function getNextEncounterIndex() {
  encountersTotal = linesStory.length - 1;
  var nextItemIndex = encounterIndex + 1;
  if (nextItemIndex >= encountersTotal) {
    gameEnd();
    return encounterIndex + 1;
  }
  adventureEncounterCount += 1;
  return nextItemIndex;
}

// Inserts an encounter string array into linesStory at encounterIndex+index.
function pushEncounter(encounterStringArray=[], index=1, areaNameOverride="") {
  if (encounterStringArray == []) encounterStringArray = ["area:Encounter Error","emoji:⚠️","name:Missing Encounter","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Error","desc:Missing data for pushing new encounter.","message:"];

  if (areaNameOverride != "") {
    linesStory.splice(encounterIndex + index, 0, encounterStringArray, areaNameOverride);
  } else {
    linesStory.splice(encounterIndex + index, 0, encounterStringArray);
  }
}

// ── Random Encounter Picker ───────────────────────────────────────────────────
// Filters linesGenerator by area, type, include strings, exclude strings, and seen names.

function getRandomEncounter(encounterTypes=[], includeStrings=[], areaNameOverride="", excludeStrings=[]) {
  var tempLinesGenerator = linesGenerator;
  var generatorAreaName = areaName;

  if (areaNameOverride != "") generatorAreaName = areaNameOverride;
  if (areaNameOverride != "ALL") tempLinesGenerator = $.grep(tempLinesGenerator, function(item) {
    return item.indexOf("area:" + generatorAreaName) === 0;
  });

  // Filter by type (OR match across all requested types)
  var matchingTypeLines = [];
  encounterTypes.forEach(function(type) {
    $.grep(tempLinesGenerator, function(item) {
      return item[3].includes("type:" + type);
    }).forEach(function(line) { matchingTypeLines.push(line); });
  });
  tempLinesGenerator = matchingTypeLines;

  // Filter to only lines containing any of the includeStrings
  if (includeStrings.length != 0) {
    var includesStringLines = [];
    includeStrings.forEach(function(string) {
      $.grep(tempLinesGenerator, function(item) {
        return String(item).includes(string);
      }).forEach(function(line) { includesStringLines.push(line); });
    });
    tempLinesGenerator = includesStringLines;
  }

  // Remove lines containing any of the excludeStrings
  if (excludeStrings.length !== 0) {
    tempLinesGenerator = tempLinesGenerator.filter(function(line) {
      return !excludeStrings.some(function(s) { return String(line).includes(s); });
    });
  }

  // Remove already-seen encounter names
  seenEncounters.forEach(function(seenName) {
    tempLinesGenerator = tempLinesGenerator.filter(function(line) {
      return line[2].split("name:")[1] !== seenName;
    });
  });

  // Achievement filter — skip entries locked behind unearned achievements.
  // Falls back to unfiltered pool to prevent hard blocks.
  var _achievFiltered = tempLinesGenerator.filter(_achievUnlocked);
  if (_achievFiltered.length > 0) tempLinesGenerator = _achievFiltered;

  var randomEncounterIndex = Math.floor(Math.random() * tempLinesGenerator.length);
  var randomEncounter = tempLinesGenerator[randomEncounterIndex];

  if (!randomEncounter) {
    randomEncounter = ["area:Encounter Error","emoji:⚠️","name:Type Not Available","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Critical Error","desc:No encounters for types -> "+String(encounterTypes).replaceAll(","," ")+"<br>","message:","achiev:none"];
  }

  console.log("Type:" + encounterTypes + "\nOpts:" + tempLinesGenerator.length + "→#" + randomEncounterIndex + ":\n" + (randomEncounter[2] || "").split(":")[1]);
  return randomEncounter;
}

// Rarity-weighted encounter picker. Same filters as getRandomEncounter, then groups
// the filtered pool by rarity tier and draws from a luck/karma-weighted tier roll.
// Falls back to flat random if the rolled tier has no candidates in the pool.
function getWeightedEncounter(encounterTypes, includeStrings, areaNameOverride, excludeStrings) {
  includeStrings   = includeStrings   || [];
  areaNameOverride = areaNameOverride || '';
  excludeStrings   = excludeStrings   || [];

  var tempLines = linesGenerator;
  var generatorAreaName = areaNameOverride || areaName;

  if (areaNameOverride !== 'ALL') {
    tempLines = $.grep(tempLines, function (item) {
      return item.indexOf('area:' + generatorAreaName) === 0;
    });
  }

  var matchingTypeLines = [];
  (encounterTypes || []).forEach(function (type) {
    $.grep(tempLines, function (item) {
      return item[3].includes('type:' + type);
    }).forEach(function (line) { matchingTypeLines.push(line); });
  });
  tempLines = matchingTypeLines;

  if (includeStrings.length > 0) {
    var inclLines = [];
    includeStrings.forEach(function (s) {
      $.grep(tempLines, function (item) { return String(item).includes(s); })
        .forEach(function (line) { inclLines.push(line); });
    });
    tempLines = inclLines;
  }

  if (excludeStrings.length > 0) {
    tempLines = tempLines.filter(function (line) {
      return !excludeStrings.some(function (s) { return String(line).includes(s); });
    });
  }

  seenEncounters.forEach(function (seenName) {
    tempLines = tempLines.filter(function (line) {
      return line[2].split('name:')[1] !== seenName;
    });
  });

  var unlockedLines = tempLines.filter(_achievUnlocked);
  if (unlockedLines.length > 0) tempLines = unlockedLines;

  if (tempLines.length === 0) return getRandomEncounter(encounterTypes, includeStrings, areaNameOverride, excludeStrings);

  // Group by rarity tier
  var buckets = {};
  tempLines.forEach(function (line) {
    var tier = _rarityFromRow(line);
    if (!buckets[tier]) buckets[tier] = [];
    buckets[tier].push(line);
  });

  var tier = RarityManager.rollTier(playerLck, playerKarma);
  var bucket = buckets[tier];
  if (!bucket || bucket.length === 0) {
    console.log('RarityRoll:' + tier + ' → no pool, flat fallback');
    return tempLines[Math.floor(Math.random() * tempLines.length)];
  }
  console.log('RarityRoll:' + tier);
  return bucket[Math.floor(Math.random() * bucket.length)];
}

// Rarity-weighted fishing loot picker. Buckets linesLoot by tier, rolls a weighted
// tier, then picks from that bucket (preferring unseen entries).
function getWeightedLootIndex(luck, karma) {
  var buckets = {};
  linesLoot.forEach(function (line, idx) {
    if (!_achievUnlocked(line)) return;
    var tier = _rarityFromRow(line);
    if (!buckets[tier]) buckets[tier] = [];
    buckets[tier].push(idx);
  });

  var tier = RarityManager.rollTier(luck, karma);
  var pool = buckets[tier];

  // Fall back to full available pool if rolled tier has no entries
  if (!pool || pool.length === 0) {
    console.log('FishRarityRoll:' + tier + ' → no pool, flat fallback');
    pool = Object.keys(buckets).reduce(function (acc, t) { return acc.concat(buckets[t]); }, []);
  } else {
    console.log('FishRarityRoll:' + tier);
  }
  if (pool.length === 0) return getUnseenLootIndex();

  // Prefer unseen within pool
  var unseen = pool.filter(function (i) { return !seenLoot.includes(i); });
  var finalPool = unseen.length > 0 ? unseen : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

// ── Loot Tracking ─────────────────────────────────────────────────────────────

// Returns a random fishing loot index not yet seen this session.
function getUnseenLootIndex() {
  var max = linesLoot.length;
  var randomLootIndex;
  do {
    randomLootIndex = Math.floor(Math.random() * max);
    if (seenLoot.length >= max) {
      console.log("ERROR: No more loot left.");
      break;
    }
  } while (seenLoot.includes(randomLootIndex));
  return randomLootIndex;
}

// Returns an artifact loot index, preferring unseen ones.
function getArtifactLootIndex() {
  var artifactIndices = [];
  for (var i = 0; i < linesLoot.length; i++) {
    if (String(linesLoot[i]).includes('note:<b>Artifact</b>')) artifactIndices.push(i);
  }
  if (artifactIndices.length === 0) return getUnseenLootIndex();
  var unseen = artifactIndices.filter(function(i) { return !seenLoot.includes(i); });
  var pool = unseen.length > 0 ? unseen : artifactIndices;
  return pool[Math.floor(Math.random() * pool.length)];
}

function markAsSeen(seenName) {
  seenName = seenName.replace(" (Crispy)", "").replace(" (Salty)", ""); // Avoid re-seeing the same food after cooking
  if (!seenEncounters.includes(seenName)) seenEncounters.push(seenName);
}

function markAsSeenFishing(seenID) {
  if (!seenLoot.includes(seenID)) {
    seenLoot.push(seenID);
    localStorage.setItem("seenLoot", JSON.stringify(seenLoot));
  }
}

function resetSeenEncounters() {
  seenEncounters = [];
}

// ── Origins ───────────────────────────────────────────────────────────────────

function getOrigins() {
  return linesOrigins.map(function(row) {
    return {
      emoji:      row.emoji || '🃏',
      originName: row.name  || '?',
      desc:       row.desc  || '',
      hp:  parseInt(row.hp)  || 0,
      atk: parseInt(row.atk) || 0,
      sta: parseInt(row.sta) || 0,
      lck: parseInt(row.lck) || 0,
      int: parseInt(row.int) || 0,
      mgk: parseInt(row.mgk) || 0,
      def: parseInt(row.def) || 0,
      achiev: row.achiev || 'none'
    };
  });
}

// ── Rarity Helpers ─────────────────────────────────────────────────────────────

// Compute weighted net stat value from a raw encounter row array.
// Mirrors _originNet() in menu.js — keep in sync if weights change.
function _netFromRow(row) {
  function v(i) { return parseFloat((row[i] || '').split(':')[1]) || 0; }
  // columns: 4=hp, 5=atk, 6=sta, 7=lck, 8=int, 9=mgk, 10=def
  return v(5)*3 + v(9)*2 + v(4)*1.5 + v(6)*1.5 + v(7)*0.5 + v(8)*0.5 + v(10);
}

// Determine rarity tier for a raw encounter row: explicit [Tag] in note wins, then stat net, then Artifact fallback.
function _rarityFromRow(row) {
  var noteRaw = (row[11] || '').split(':').slice(1).join(':');
  var tier = RarityManager.getTierFromNote(noteRaw);
  if (tier) return tier;
  if (noteRaw.toLowerCase().includes('artifact')) return 'Legendary';
  return RarityManager.getTierForNet(_netFromRow(row));
}

// Achievement filter: returns true if the row's achiev field is unlocked (or none).
function _achievUnlocked(row) {
  var entry = row.length > 14 ? row[14] : null;
  if (!entry) return true;
  var id = entry.split(':').slice(1).join(':').trim();
  return !id || id === 'none' || AchievementManager.isUnlocked(id);
}
