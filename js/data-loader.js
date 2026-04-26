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
      loadEncounter(4);
      drachmaShop[0] = "area:" + "Fading Wildlands";
      linesStory.splice(encounterIndex + 1, 1); // Remove realization encounter
      pushEncounter(drachmaShop);
    }
    if (savedCoins == 0) {
      loadEncounter(4);
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

  var randomEncounterIndex = Math.floor(Math.random() * tempLinesGenerator.length);
  var randomEncounter = String(tempLinesGenerator[randomEncounterIndex]);

  if (randomEncounter == "undefined") {
    randomEncounter = String(["area:Encounter Error","emoji:⚠️","name:Type Not Available","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Critical Error","desc:No encounters for types -> "+String(encounterTypes).replaceAll(","," ")+"<br>","message:"]);
  }

  console.log("Type:" + encounterTypes + "\nOpts:" + tempLinesGenerator.length + "→#" + randomEncounterIndex + ":\n" + randomEncounter.split(",t")[0].split("i:")[1]);
  return randomEncounter;
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
      def: parseInt(row.def) || 0
    };
  });
}
