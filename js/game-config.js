// Set to true to unlock Easy/Hardcore difficulty selection for players (except on localhost for testing).
var DIFFICULTY_PICKER_ENABLED = false;

// Set to true to use animated SVG backgrounds. Set to false to use original static PNGs.
var VECTOR_BACKGROUNDS_ENABLED = false;

// Set to false to suppress per-encounter enemy and loot telemetry events (keeps run_start, run_end, achievement, cheat_used).
var TELEMETRY_DETAILS_ENABLED = false;

// When true, playerKarma (baseline 1, higher = more good actions this run) shifts weights toward better tiers.
var RARITY_KARMA_ENABLED = false;

// ── Difficulty Presets ────────────────────────────────────────────────────────
// speedMult:             action bar speed multiplier — >1 faster cursor (harder), <1 slower (easier)
// zoneMult:              success zone width multiplier — 1.0 = standard, 0.8 = 20% narrower (harder), 1.2 = 20% wider (easier)
// bossPenalty:           added to eStat before zone calc for Boss-type enemies (higher = narrower zone = harder)
// spawnItemDropBonus:    additive % bonus to item spawn chances in encounter generators
// spawnConsumableDropBonus: additive % bonus to consumable spawn chances in encounter generators
// killItemDropChance:    base % chance for an item to drop on kill/knockout (luck added at runtime)
// killConsumableDropChance: base % chance for a consumable to drop on kill/knockout if no item dropped
// rarityBias:            additive weight modifier per rarity tier applied on top of RARITY_TIERS base weights.
//                        Adding +1 to Legendary grows the total pie from 100 to 101 slices and gives
//                        Legendary 3 of them (≈ 3% instead of 2%) — close to +1% but not exact because
//                        the other tiers' share shrinks slightly. For a clean percentage-point shift,
//                        pair a bonus with an equal penalty: e.g. Legendary: +2, Common: -2 keeps the
//                        total at 100, making Legendary exactly 4% and Common exactly 58%.

var DIFFICULTY_MODES = {
  Standard: {
    label:                    "Standard",
    displayName:              "💔 Rough",
    speedMult:                1.0,
    zoneMult:                 1.0,
    bossPenalty:              4,
    spawnItemDropBonus:       0,
    spawnConsumableDropBonus: 0,
    killItemDropChance:       5,
    killConsumableDropChance: 10,
    sleepAreaThreshold:       6,
    rivals: {
      enabled:       true,
      spawnChance:   33,
      eligibleAreas: ['Forsaken Village', 'Twisted Fairyland', 'River of Sorrows']
    },
    rarityBias: { Cursed: 0, Common: 0, Uncommon: 0, Rare: 0, Legendary: 0 }
  },

  // Easy — forgiving bars, wider zones, better loot from generators and kills
  Easy: {
    label:                    "Easy",
    displayName:              "🕯️ Story",
    speedMult:                0.8,
    zoneMult:                 1.2,
    bossPenalty:              2,
    spawnItemDropBonus:       5,
    spawnConsumableDropBonus: 8,
    killItemDropChance:       5,
    killConsumableDropChance: 10,
    sleepAreaThreshold:       8,
    rivals: {
      enabled:       false,
      spawnChance:   0,
      eligibleAreas: []
    },
    rarityBias: { Cursed: -2, Common: -8, Uncommon: 4, Rare: 4, Legendary: 2 }
  },

  // Hardcore — unlocked after completing a full run; punishing bars, scarce drops
  Hardcore: {
    label:                    "Hardcore",
    displayName:              "☠️ Fatal",
    speedMult:                1.2,
    zoneMult:                 0.8,
    bossPenalty:              6,
    spawnItemDropBonus:       -4,
    spawnConsumableDropBonus: -4,
    killItemDropChance:       10,
    killConsumableDropChance: 15,
    sleepAreaThreshold:       4,
    rivals: {
      enabled:       true,
      spawnChance:   50,
      eligibleAreas: ['Forsaken Village', 'Twisted Fairyland', 'River of Sorrows']
    },
    rarityBias: { Cursed: 3, Common: 7, Uncommon: -4, Rare: -4, Legendary: -2 }
  }
};

// Active difficulty. Standard is the only currently available mode.
// To switch: GAME_CONFIG = DIFFICULTY_MODES.Easy;
// SaveManager hook point for persistence: save GAME_CONFIG.label, restore on load.
var GAME_CONFIG = DIFFICULTY_MODES.Standard;

// ── Rarity System ─────────────────────────────────────────────────────────────
// Tiers are keyed by name. weight = base draw probability (unnormalized sum ~100).
// netMin/netMax map _originNet() / _netFromRow() stat sums to a tier.
// Tag override: add [TierName] anywhere in a note/team field to force a tier and
// skip stat calculation. The tag is automatically stripped before UI display.
// Example CSV note: "Artifact [Legendary]" → displayed as "Artifact", tier forced to Legendary.

// ── How the weight system works ───────────────────────────────────────────────
// Each tier has a base `weight`. At roll time the weights are summed into a total,
// then a random number [0, total) is drawn and the tier whose cumulative slice it
// falls into wins — identical to drawing a random slice of a pie chart.
//
// Weights sum to exactly 100 — think of it as a pie chart with 100 slices.
// Each tier owns some number of slices, and the roll picks which slice lands.
//   Cursed    3 / 100 =  3 %
//   Common   60 / 100 = 60 %
//   Uncommon 25 / 100 = 25 %
//   Rare     10 / 100 = 10 %
//   Legendary 2 / 100 =  2 %
//
// rarityBias in each difficulty preset adds to (or subtracts from) these base weights.
// playerLck and playerKarma further shift the slices at runtime (see RarityManager.rollTier).
// A tier's effective weight is clamped to 0 minimum and the CDF re-normalises the remainder.
var RARITY_TIERS = {
  Cursed:    { weight:  3, color: colorSoftRed,       bg: colorDarkRedSubtle, netMin: -Infinity, netMax: -0.01 },
  Common:    { weight: 60, color: colorWhite,         bg: '',                 netMin:  0,        netMax:  0.49 },
  Uncommon:  { weight: 25, color: colorLightBlue,     bg: colorDarkBlue,      netMin:  0.5,      netMax:  0.99 },
  Rare:      { weight: 10, color: colorPurple,        bg: colorDarkPurple,    netMin:  1,        netMax:  2.99 },
  Legendary: { weight:  2, color: colorOrange,        bg: colorDarkOrange,    netMin:  3.0,      netMax:  Infinity },
  Familiar:  { weight:  0, color: colorSoftGreen, bg: colorFamiliarGreen,     netMin:  0,        netMax:  0 }
};



// Net thresholds for permanent item rarity display and loot rolling.
// Separate from origin thresholds in RARITY_TIERS.
// Magnificent (Uncommon colors) at >=uncommon; Exquisite (Rare colors) at >=rare;
// Legendary at >=legendary as a stat-based safeguard (Artifact note is the primary path).
var ITEM_NET_THRESHOLDS = {
  uncommon:  0.5,
  rare:      2.0,
  legendary: 6.0
};

// Net thresholds for consumable rarity display and eat-achievement checks.
// Lower than item thresholds because calcConsumableNet halves hp/sta (temporary effects).
var CONSUMABLE_NET_THRESHOLDS = {
  uncommon:  0.5,
  rare:      1.0,
  legendary: 3.0
};

var RarityManager = (function () {
  var TIER_ORDER = ['Cursed', 'Common', 'Uncommon', 'Rare', 'Legendary'];
  var TAG_RE = /\[(?:Cursed|Common|Uncommon|Rare|Legendary)\]/;

  function getTierForNet(net) {
    for (var i = 0; i < TIER_ORDER.length; i++) {
      var t = RARITY_TIERS[TIER_ORDER[i]];
      if (net >= t.netMin && net <= t.netMax) return TIER_ORDER[i];
    }
    return 'Common';
  }

  // Item-specific tier from net. Used by both the loot roller and UI display.
  // Legendary requires net ≥ 6.0 from stats alone (extreme items only); Artifact note is the normal path.
  function getTierForItemNet(net) {
    if (net >= ITEM_NET_THRESHOLDS.legendary) return 'Legendary';
    if (net >= ITEM_NET_THRESHOLDS.rare)      return 'Rare';
    if (net >= ITEM_NET_THRESHOLDS.uncommon)  return 'Uncommon';
    if (net <  0)                             return 'Cursed';
    return 'Common';
  }

  // Consumable-specific tier from net. Paired with calcConsumableNet.
  // Uses lower rare/legendary thresholds because hp/sta are halved in the formula (temporary effects).
  function getTierForConsumableNet(net) {
    if (net >= CONSUMABLE_NET_THRESHOLDS.legendary) return 'Legendary';
    if (net >= CONSUMABLE_NET_THRESHOLDS.rare)      return 'Rare';
    if (net >= CONSUMABLE_NET_THRESHOLDS.uncommon)  return 'Uncommon';
    if (net <  0)                                   return 'Cursed';
    return 'Common';
  }

  // Returns the tier name from a [Tag] in a note string, or null if no tag present.
  function getTierFromNote(note) {
    var m = (note || '').match(TAG_RE);
    return m ? m[0].slice(1, -1) : null;
  }

  // Strips [RarityTag] from a note string for clean UI display.
  function stripTagFromNote(note) {
    return (note || '').replace(TAG_RE, '').replace(/\s{2,}/g, ' ').trim();
  }

  // Weighted rarity roll. luck and karma shift weights toward better tiers.
  // luck:  each +1 adds weight to Uncommon/Rare/Legendary and removes from Common/Cursed.
  // karma: each +1 above baseline (1) adds a milder shift in the same direction.
  function rollTier(luck, karma) {
    var bias = (GAME_CONFIG && GAME_CONFIG.rarityBias) || {};
    var lck = luck  || 0;
    var k   = (karma || 1) - 1; // delta above baseline
    var weights = {};

    TIER_ORDER.forEach(function (t) {
      var base = RARITY_TIERS[t].weight + (bias[t] || 0);
      var luckBonus = 0, karmaBonus = 0;
      switch (t) {
        case 'Uncommon':  luckBonus =  lck * 1.0; karmaBonus =  k * 0.5; break;
        case 'Rare':      luckBonus =  lck * 0.5; karmaBonus =  k * 0.3; break;
        case 'Legendary': luckBonus =  lck * 0.2; break;
        case 'Common':    luckBonus = -lck * 1.7; karmaBonus = -k * 0.8; break;
        case 'Cursed':    luckBonus = -lck * 0.3; break;
      }
      if (!RARITY_KARMA_ENABLED) karmaBonus = 0;
      weights[t] = Math.max(0, base + luckBonus + karmaBonus);
    });

    var total = TIER_ORDER.reduce(function (s, t) { return s + weights[t]; }, 0);
    if (total <= 0) return 'Common';
    var roll = Math.random() * total, cum = 0;
    for (var i = 0; i < TIER_ORDER.length; i++) {
      cum += weights[TIER_ORDER[i]];
      if (roll < cum) return TIER_ORDER[i];
    }
    return 'Common';
  }

  function getColor(tier) { return (RARITY_TIERS[tier] || RARITY_TIERS.Common).color; }
  function getBg(tier)    { return (RARITY_TIERS[tier] || RARITY_TIERS.Common).bg; }

  // Canonical net-stat formula for permanent items. Pass any object with {atk, mgk, hp, sta, lck, int, def}.
  function calcNet(s) {
    return (s.atk||0)*3 + (s.mgk||0)*2 + (s.hp||0)*1.5 + (s.sta||0)*1.5
         + (s.lck||0)*0.5 + (s.int||0)*0.5 + (s.def||0)*3;
  }

  // Net formula for consumables. hp/sta are temporary so weighted lower than usual.
  function calcConsumableNet(s) {
    return (s.atk||0)*3 + (s.mgk||0)*2 + (s.hp||0)*0.5 + (s.sta||0)*0.5
         + (s.lck||0)*0.5 + (s.int||0)*0.5 + (s.def||0)*3;
  }

  return {
    getTierForNet:             getTierForNet,
    getTierForItemNet:         getTierForItemNet,
    getTierForConsumableNet:   getTierForConsumableNet,
    getTierFromNote:      getTierFromNote,
    stripTagFromNote:     stripTagFromNote,
    rollTier:             rollTier,
    getColor:             getColor,
    getBg:                getBg,
    calcNet:              calcNet,
    calcConsumableNet:    calcConsumableNet
  };
})();
