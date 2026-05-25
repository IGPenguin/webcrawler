// ── Enemy type pools ──────────────────────────────────────────────────────────
var easyEnemies        = ["Standard","Stingy"];
var mediumEnemies      = ["Standard","Stingy","Hot","Toxic"];
var hardEnemies        = ["Toxic","Heavy","Swift","Reflective","Demon","Undead","Spirit","Tough"];
var softEnemies        = ["Small","Standard","Stingy","Hot","Toxic","Undead","Recruit","Pet"];
var allEnemies         = ["Small","Standard","Stingy","Hot","Toxic","Heavy","Swift","Reflective","Demon","Undead","Spirit","Tough","Pet","Recruit"];
var allBosses          = ["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Spirit","Boss-Undead","Boss-Toxic","Boss-Tough","Boss-Hot","Boss-Stingy","Boss-Reflective","Boss-Pet","Boss-Recruit"];
var allTraps           = ["Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle","Curse"];
var allEnemiesAndTraps = allEnemies.concat(allTraps);

// ── Loot helpers ──────────────────────────────────────────────────────────────

// Independent item + consumable checks — used by field encounters
function pushFieldLoot(itemChance, consumableChance) {
  if (procAbilityChance("", itemChance + playerLck + GAME_CONFIG.spawnItemDropBonus))
    pushEncounter(getWeightedEncounter(["Item"]));
  if (procAbilityChance("", consumableChance + playerLck + GAME_CONFIG.spawnConsumableDropBonus))
    pushEncounter(getWeightedEncounter(["Consumable"]));
}

// Exclusive item → consumable → prop/small fallback — used by house small/mid
function pushHouseLoot(itemChance, consumableChance) {
  if (procAbilityChance("", itemChance + playerLck + GAME_CONFIG.spawnItemDropBonus)) {
    pushEncounter(getWeightedEncounter(["Item"]));
  } else if (procAbilityChance("", consumableChance + playerLck + GAME_CONFIG.spawnConsumableDropBonus)) {
    pushEncounter(getWeightedEncounter(["Consumable"]));
  } else {
    generateNextEncounters(0, false); // Prop or Contained Small
  }
}

// Item or altar fallback, always paired with a consumable — used by house hard/big
function pushHouseHardLoot(itemChance) {
  if (procAbilityChance("", itemChance + playerLck + GAME_CONFIG.spawnItemDropBonus)) {
    pushEncounter(getWeightedEncounter(["Item"]));
  } else {
    pushEncounter(getRandomEncounter(["Altar"]));
  }
  pushEncounter(getWeightedEncounter(["Consumable"]));
}

// ── Generator ─────────────────────────────────────────────────────────────────

// Pre-expands a Generator row in linesStory without calling nextEncounter().
// Use when you need to teleport past a generator and land on its first prop.
// Returns true if expanded, false if the row isn't a generator.
function resolveGeneratorRow(idx) {
  var row = linesStory[idx];
  if (!row) return false;
  var type = String(row[3]).split(":").slice(1).join(":");
  if (!type.includes("Generator")) return false;
  var numMatch = type.match(/\d+$/);
  var num = numMatch ? parseInt(numMatch[0], 10) : 0;
  var savedArea = areaName;
  areaName = String(row[0]).split(":").slice(1).join(":");
  encounterIndex = idx;
  generateNextEncounters(num);
  areaName = savedArea;
  return true;
}

function generateNextEncounters(generatorID=0, logCall=true) {
  if (logCall) _generationBuffer = [];

  if (logCall && areaName === 'Shrouded Necropolis' && typeof RivalManager !== 'undefined') {
    var _wallRow = RivalManager.buildWallPropRow();
    if (_wallRow) pushEncounter(_wallRow);
  }

  switch (generatorID) {

    case 0: // Prop / Small / Lockbox
      if (logCall) logGenerator("prop/small");

      if (procAbilityChance("", 3)) generateNextEncounters(32, false); // ~4% shrine, flat — fires too often to scale with luck

      var type = "Prop";
      if (procAbilityChance("", 10+playerLck)) type = "Small"; // 10% Small

      var _propRow = null;
      if (procAbilityChance("", 5-playerLck)) { // 5% Trap, lowers with luck
        pushEncounter(getRandomEncounter(allTraps));
      } else {
        if (procAbilityChance("", 5-playerLck)) {
          _propRow = getRandomEncounter(["Prop"],["-1"]);
          pushEncounter(_propRow);                                        // 5%-  Bad flavoured
        } else if (procAbilityChance("", 5+playerLck)) {
          _propRow = getRandomEncounter(["Prop"],["1"]);
          pushEncounter(_propRow);                                        // 5%+  Good flavoured
        } else {
          _propRow = getRandomEncounter(["Prop"],[],"",["-1","1"]);
          pushEncounter(_propRow);                                        // Neutral
        }
      }

      if (type == "Small") {
        pushEncounter(getRandomEncounter(["Small"]));
        if (_propRow && logCall) pushEncounter(_propRow); // logCall=false means sub-generator call — skip repeat
        pushEncounter(getRandomEncounter(["Container"]));
      }

      if (!areaName.includes("Fading") && procAbilityChance("", 3+playerLck)) { // 3% Artifact lockbox (not in Fading)
        pushEncounter(getWeightedEncounter(["Item"],["Artifact"]));
        pushEncounter(getRandomEncounter(["Locked-Container"]));
      }
      break;

    case 1: // Random story letter
      var randomSlot = chooseFrom([5,6,7]);
      pushEncounter(getRandomEncounter(["Item"],["Memento","Piece of History"]), randomSlot);
      if (chooseFrom([true,false])) pushEncounter(getRandomEncounter(["Container"]), randomSlot);
      dbg("pushing letter at pos: " + randomSlot);
      break;

    case 2: // Easy Encounter
      if (logCall) logGenerator("easy (5% pet)");
      var encounterPool = procAbilityChance("", 5+playerLck) ? ["Pet"] : easyEnemies;
      pushEncounter(getRandomEncounter(encounterPool));
      break;

    case 3: // Mid Encounter
      if (logCall) logGenerator("mid (10% recruit/pet)");
      if (procAbilityChance("", 50+playerLck)) generateNextEncounters(0, false); // 50% Prop or Contained Small
      pushFieldLoot(3, 10);
      var encounterPool = procAbilityChance("", 10+playerLck) ? ["Recruit","Pet"] : mediumEnemies;
      pushEncounter(getRandomEncounter(encounterPool));
      break;

    case 4: // Hard Encounter
      if (logCall) logGenerator("hard");
      if (procAbilityChance("", 70+playerLck)) generateNextEncounters(0, false); // 70% Prop or Contained Small
      pushFieldLoot(5, 30);
      if (typeof RivalManager !== 'undefined') RivalManager.tryPushRival(areaName);
      pushEncounter(getRandomEncounter(hardEnemies));
      break;

    case 5: // Very Hard Encounter — no safety net, no item, high consumable chance
      if (logCall) logGenerator("very-hard");
      if (procAbilityChance("", 50+playerLck+GAME_CONFIG.spawnConsumableDropBonus))
        pushEncounter(getWeightedEncounter(["Consumable"])); // 50%+: you'll need it
      pushEncounter(getRandomEncounter(hardEnemies));
      break;

    case 9: // Boss
      if (logCall) logGenerator("boss");
      if (!areaName.includes("Shrouded")) {
        generateNextEncounters(0, false); // Prop/Small after fight (not Necropolis)
        if (procAbilityChance("", 20+playerLck)) {
          pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
        } else {
          pushEncounter(getWeightedEncounter(["Item"],[],"",["Artifact","Lost Possession"]));
        }
      }

      drachmaCoin[0] = "area:" + areaName;
      var _fishBonus = AchievementManager.isUnlocked('fish_boss_kill') ? 1 : 0;
      var bossCoinsLimit = {"Fading Wildlands": _fishBonus, "Forsaken Village": 1+_fishBonus, "Twisted Fairyland": 2+_fishBonus, "River of Sorrows": 3+_fishBonus};
      if (!areaName.includes("Shrouded Necropolis") && savedCoins < (bossCoinsLimit[areaName] || 0)) pushEncounter(drachmaCoin);
      pushEncounter(getRandomEncounter(allBosses));
      break;

    case 11: // Any Enemy
      if (logCall) logGenerator("any");
      if (procAbilityChance("", 50+playerLck)) generateNextEncounters(0, false); // 50% Prop or Contained Small
      pushFieldLoot(5, 20);
      pushEncounter(getRandomEncounter(allEnemies));
      break;

    case 20: // House Small
      if (logCall) logGenerator("h-small");
      pushHouseLoot(10, 20);
      pushEncounter(getRandomEncounter(mediumEnemies));
      pushEncounter(getRandomEncounter(["Container-2"]));
      break;

    case 30: // House Mid — two enemies guaranteed of different types
      if (logCall) logGenerator("h-mid");
      pushHouseLoot(15, 25);

      var pool = [...allEnemies];
      var firstEncounter = getRandomEncounter(pool);
      if (firstEncounter) {
        pushEncounter(firstEncounter);
        var usedType = firstEncounter[3].split(":")[1];
        pushEncounter(getRandomEncounter(pool.filter(t => t !== usedType)));
      }
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 31: // House Locked — artifact or NPC guarded by a trap and enemy
      if (logCall) logGenerator("h-lock");
      var type = chooseFrom(["Item","Pet","Friend"]);
      pushEncounter(type === "Item" ? getWeightedEncounter(["Item"],["Artifact"]) : getRandomEncounter([type,"Checkpoint"]));
      pushEncounter(getRandomEncounter(allTraps));
      pushEncounter(getRandomEncounter(allEnemies));
      pushEncounter(getRandomEncounter(["Locked-Container-3"]));
      break;

    case 32: // Shrine — luck-gated Friend or Checkpoint; altar + consumable fallback
      if (logCall) logGenerator("shrine");
      if (procAbilityChance("", 20+playerLck*4)) { // ~20% base, scales to ~60% at lck 10
        pushEncounter(getRandomEncounter(["Friend","Checkpoint"]));
      } else {
        pushEncounter(getRandomEncounter(["Altar","Curse"]));
        pushEncounter(getWeightedEncounter(["Consumable"]));
      }
      break;

    case 40: // House Hard
      if (logCall) logGenerator("h-hard");
      pushHouseHardLoot(20);
      pushEncounter(getRandomEncounter(allEnemiesAndTraps));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 50: // House Big
      if (logCall) logGenerator("h-big");
      pushHouseHardLoot(30);
      pushEncounter(getRandomEncounter(hardEnemies));
      pushEncounter(getRandomEncounter(allTraps));
      pushEncounter(getRandomEncounter(["Container-4"]));
      break;

    case 60: // House Huge
      if (logCall) logGenerator("h-huge");
      pushHouseHardLoot(40);
      pushEncounter(getRandomEncounter(hardEnemies));
      pushEncounter(getRandomEncounter(allTraps));
      pushEncounter(getRandomEncounter(softEnemies));
      pushEncounter(getRandomEncounter(["Container-5"]));
      break;

    case 68: // Fishing (fixed)
      if (logCall) logGenerator("fish");
      linesStory.splice(encounterIndex+1, 0, getRandomEncounter(["Fishing"]));
      break;

    case 69: // Fishing (random slot)
      if (logCall) logGenerator("fish");
      pushEncounter(getRandomEncounter(["Fishing"]), chooseFrom([5, 6, 7]));
      break;

    case 75: // Mirror (random slot, Twisted Fairyland)
      if (logCall) logGenerator("mirror");
      if (procAbilityChance("",33)) pushEncounter(getRandomEncounter(["Mirror"]), chooseFrom([5, 6, 7]));
      break;

    case 70: // Island Small — shore cache, one soft enemy
      if (logCall) logGenerator("island-small");
      pushHouseLoot(10, 20);
      pushEncounter(getRandomEncounter(softEnemies));
      pushEncounter(getRandomEncounter(["Container-2"]));
      break;

    case 71: // Island Beach — two different soft enemies, mid loot
      if (logCall) logGenerator("island-beach");
      pushHouseLoot(15, 25);
      var pool71 = [...softEnemies];
      var first71 = getRandomEncounter(pool71);
      if (first71) {
        pushEncounter(first71);
        var used71 = first71[3].split(":")[1];
        pushEncounter(getRandomEncounter(pool71.filter(t => t !== used71)));
      }
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 72: // Island Cliff — trap + enemy, locked reward
      if (logCall) logGenerator("island-cliff");
      pushEncounter(getRandomEncounter(["Trap-Obstacle"]));
      pushEncounter(getRandomEncounter(allEnemies));
      pushEncounter(getRandomEncounter(["Locked-Container-3"]));
      break;

    case 73: // Island Reeds — hard loot, trap, soft enemy, container
      if (logCall) logGenerator("island-reeds");
      pushHouseHardLoot(20);
      pushEncounter(getRandomEncounter(allTraps));
      pushEncounter(getRandomEncounter(softEnemies));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 98: // Random island — luck-gated shrine chance (~6% at lck 0, ~16% at lck 10)
      if (logCall) logGenerator("rand-island");
      if (procAbilityChance("", 5+playerLck)) {
        generateNextEncounters(32, false);
      } else {
        generateNextEncounters(chooseFrom([70,71,72,73]));
      }
      break;

    case 99: // Random house — luck-gated shrine chance (~6% at lck 0, ~16% at lck 10)
      if (logCall) logGenerator("rand");
      if (procAbilityChance("", 5+playerLck)) {
        generateNextEncounters(32, false);
      } else {
        generateNextEncounters(chooseFrom([20,30,31,40,50,60]));
      }
      break;

    default:
      dbg("ERROR: Missing generator definition!");
  }
}
