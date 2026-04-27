// ── Difficulty Presets ────────────────────────────────────────────────────────
// speedMult:             action bar speed multiplier — >1 faster cursor (harder), <1 slower (easier)
// zoneMult:              success zone width multiplier — 1.0 = standard, 0.8 = 20% narrower (harder), 1.2 = 20% wider (easier)
// spawnItemDropBonus:    additive % bonus to item spawn chances in encounter generators
// spawnConsumableDropBonus: additive % bonus to consumable spawn chances in encounter generators
// killItemDropChance:    base % chance for an item to drop on kill/knockout (luck added at runtime)
// killConsumableDropChance: base % chance for a consumable to drop on kill/knockout if no item dropped

var DIFFICULTY_MODES = {
  Standard: {
    label:                    "Standard",
    speedMult:                1.0,
    zoneMult:                 1.0,
    spawnItemDropBonus:       0,
    spawnConsumableDropBonus: 0,
    killItemDropChance:       5,
    killConsumableDropChance: 10
  },

  // Easy — forgiving bars, wider zones, better loot from generators and kills
  // Intended as a future optional mode accessible from the menu.
  Easy: {
    label:                    "Easy",
    speedMult:                0.8,
    zoneMult:                 1.2,
    spawnItemDropBonus:       5,
    spawnConsumableDropBonus: 8,
    killItemDropChance:       5,
    killConsumableDropChance: 10
  },

  // Hardcore — unlocked after completing a full run; punishing bars, scarce drops
  Hardcore: {
    label:                    "Hardcore",
    speedMult:                1.2,
    zoneMult:                 0.8,
    spawnItemDropBonus:       -4,
    spawnConsumableDropBonus: -4,
    killItemDropChance:       10,
    killConsumableDropChance: 15
  }
};

// Active difficulty. Standard is the only currently available mode.
// To switch: GAME_CONFIG = DIFFICULTY_MODES.Easy;
// SaveManager hook point for persistence: save GAME_CONFIG.label, restore on load.
var GAME_CONFIG = DIFFICULTY_MODES.Standard;
