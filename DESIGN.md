# Stay Dead — Design Reference

Dark fantasy text roguelike RPG with a melancholic, slightly ironic tone. Not whimsy. Never verbose.

---

## Lore Foundation

The player character botched a resurrection spell attempting to revive his dead bride. The spell didn't bring her back — it corrupted the overworld instead. The player is now undead, reincarnating endlessly, pushing through a world warped by his own mistake to reach her.

**This is not the underworld.** The areas are the corrupted overworld — familiar places (wildlands, a village, a fairyland, a river, a necropolis) twisted by the failed spell. The decay vocabulary exists because the world is literally falling apart around a singular act of desperate love.

The journey ends in the **Shrouded Necropolis** with a branching finale: 9 endings determined by how much love, karma, and magic the player carried through the run. Rosabel is the reason for everything — the corruption, the reincarnation loop, the whole game.

**Keep this in mind when writing content:** enemies aren't random fantasy creatures, they're things that belong in a world coming apart. Items aren't loot drops, they're remnants. The tone is grief wearing armor.

---

## Tone & Voice

- desc fields: 7–15 words, declarative or poetic
- message fields: 2–8 words, punchy
- No modern slang, no generic filler phrases
- Preferred adjectives: Forgotten, Broken, Starved, Cursed, Diseased, Corrupted, Desperate, Forsaken, Hollow, Blighted, Tainted, Withered

**Enemy desc examples:**
- "Stone watches the world fade."
- "Capable of unfortunate headbutts."
- "Something is deeply wrong with its eyes."
- "Barely moves — means no harm."

**Item desc examples:**
- "Must've been left behind by a true artist."
- "Lying next to a corpse — handle with care."

**Message examples:**
- "Talons tore your throat apart." (enemy kill — direct, grim)
- "Felt a surge of godlike clarity." (positive — elevated)
- "The temptation took its toll." (tradeoff cost)
- "Finally found peace?" (quirky/ironic — use sparingly)

---

## Writing Rules

- Desc fields always have two lines separated by `<br>` — no exceptions
- Bold tags `<b></b>` only in item/consumable desc, for mechanic text — never in enemy desc
- One emoji per entry
- message on enemy rows = how the player died (not a kill confirmation)
- River of Sorrows: player is on a boat — use "sail", not "walk", in flavor text

---

## Vocabulary

**Corruption/decay:** corrupted, desecrated, tainted, forsaken, fallen, rotted, withered, hollowed  
**Ancient/lost:** remnants, unravelling, forgotten, buried, sealed, bound, ancient, faded  
**Threat/doom:** foul, banished, eternal, inescapable, condemned, wretched  
**Spiritual:** damned, unholy, sanctified, wicked, defiled, blighted, consecrated

**Sentence structures:**
- Simple + final: "The beast has taken enough from us already."
- Subject has fallen: "Once one of our finest — now the first corrupted."
- Warning without over-explaining: "Beyond lies mortal danger for the likes of you."

---

## Naming

- **Enemies:** Adjective + Noun — Neurotic Sheep, Corrupted Golem, Pale Countess
- **Bosses:** Epic 2-word title — Sky Tyrant, Alpha Bull, Depths Queen
- **Items:** Material/object or Emotion/object — Frozen Teardrop, Starlight Amulet, Engraved Ring
- **Artifacts:** Mythical/elemental words — Oracle, Starfall, Forbidden, Life-Stealing

---

## World Areas

| Area | Flavor words | Notes |
|------|-------------|-------|
| Fading Wildlands | Trail, Pond, Field, Wild | Nature-rooted |
| Forsaken Village | Rotten, Grave, Cultist, Possessed | Decay |
| Twisted Fairyland | Malevolent, Warlock, Daunting, Twisted | Dark magic |
| River of Sorrows | Depths, Drowned, Pale, Pearlescent | Water/grief; use "sail" not "walk" |
| Shrouded Necropolis | Crypt, Ghastly, Tainted, Grave | Death |

**Boss coin farming limits** (cumulative `savedCoins` cap per run):
Fading Wildlands = 0 · Forsaken Village = 1 · Twisted Fairyland = 2 · River of Sorrows = 3

---

## Stat System

Column order: `HP | ATK | STA | LCK | INT | MGK | DEF`

Value priority: HP = ATK = MGK (high) > STA (medium) > LCK (variable) > INT (utility/scaling)

**Trade ratios:**
- `-1 HP ≈ +2 minor stat OR +1 strong stat`
- `-2 HP ≈ +3 strong stat`
- `-1 INT` can fund aggressive bonuses

**Type-specific rules:**
- `INT = -1` only when communication is genuinely impossible — a mosquito or possessed chair cannot understand language; a stray dog might back off. Use judgment per creature, not a blanket rule for all animals. Positive INT on enemies = speech difficulty threshold for the player's Speak action.
- `MGK > 0` on any enemy where it makes thematic sense (mages, possessed objects, fey creatures). Reserve MGK for Twisted Fairyland onward — no MGK in early areas.
- `DEF` reserved for Tough type only — endgame areas only (value 1 mid-game, 2 late)
- Boss HP must exceed the area's standard HP midpoint — bosses are longer fights by design. Exception: Shrouded Necropolis brides are intentionally ~HP 4 because the fight is multi-stage (player faces her twice, ~8 total effective HP).

---

## Enemy Design

Stat ranges by area:

| Area | HP | ATK | STA | LCK | INT | MGK | DEF |
|------|----|-----|-----|-----|-----|-----|-----|
| Fading Wildlands | 1–3 | 0–2 | 1–2 | 0–1 | −1 to 3 | 0 | 0 |
| Forsaken Village | 1–4 | 0–2 | 1–3 | 0–1 | −1 to 2 | 0 | 0 |
| Twisted Fairyland | 3–6 | 2–4 | 1–4 | 0–2 | 1–5 | 0–2 | 0-1 (Tough only) |
| River of Sorrows | 4–6 | 2–4 | 1–4 | 0–1 | −1 to 4 | 0–2 | 0-1 (Tough only) |
| Shrouded Necropolis | 4–8 | 2–5 | 1–4 | 0–2 | −1 to 10* | 0–3 | 0–2 (Tough mostly) |

*INT spikes to 10 only on specific enemies that cannot be fooled — outlier, not the norm.

Tough enemies (DEF stat) are endgame-only — do not add Tough type to early/mid areas.

---

## Item Design

| Tier | Effect | Examples |
|------|--------|---------|
| Common | +1 single minor stat or a tradeoff | Cool Hat, Hefty Hammer |
| Uncommon | +2 minor stats or +1 strong stat | Lucky Gloves, Kitchen Knife |
| Rare | +2 strong stat | Sharpshooter Bow (+2 Damage) |
| Artifact | Passive skill or special mechanic | Cheat Death, 33% bait-save, Bonus damage vs Demons |

Items scale with area: Wildlands = mostly +1 → Village = +2 weapons → Fairyland = magic/INT/artifacts → Necropolis = cursed −HP for +MGK patterns.

---

## Encounter Types

### Environmental

| Type | Behavior |
|------|---------|
| Prop | Environmental flavor; grants bonus/malus on rest |
| Trap-Attack | Triggered by attacking (training dummies = positive, hazards = negative) |
| Trap-Roll | Triggered by rolling/dodging |
| Trap-Sleep | Auto-triggers, applies stat effect |
| Trap-Big | Unavoidable, cannot be destroyed — moderate HP damage |
| Trap-Obstacle | Blocks path. Primary resolution: Grab (move it aside). Attack can smash through as a brute-force alternative. |
| Curse | Applies a stat penalty, but not auto-apply. Player can Roll to avoid entirely; failure applies the stats. Can also have tradeoff stats. |
| Altar | Positive blessing or sacrifice mechanic |
| Container | Searchable; contains loot. Variants: `Container-2` through `Container-5` for multi-search containers |
| Locked-Container | Requires key or Cast (−2 MGK) to open; force-unlockable by repeated attacks. Variant: `Locked-Container-3` |

### Loot

| Type | Behavior |
|------|---------|
| Item | Equippable/stat-modifying item; picked up via Grab |
| Consumable | Eat to restore Health and Energy |

### Enemy Types

The `type` field is a single string. All types below are valid standalone values. The `Boss-` prefix can combine with any type to show the boss UI while keeping that type's behavior (e.g. `Boss-Swift`, `Boss-Undead`, `Boss-Demon`). The hyphen pattern also applies to Container variants (`Container-2` through `Container-5`, `Locked-Container`) and item slots (`Item-Head`, `Item-Chest`, `Item-Weapon`, `Item-Legs`).

| Type | Effect |
|------|--------|
| Small | Lower weight; typically minor critters |
| Standard | Baseline enemy |
| Heavy | Higher XP multiplier; harder to knock out |
| Hot | Fire damage; fail on Roll/Block can burn |
| Stingy | Sting damage; higher XP multiplier |
| Swift | High evasion; higher XP multiplier |
| Tough | Has DEF stat (damage absorption); endgame areas only |
| Toxic | Applies damage on every turn |
| Reflective | Can mirror certain actions back at the player |
| Demon | +40% XP multiplier; regenerates HP on hit; vulnerable to specific items/artifacts |
| Undead | +40% XP multiplier; interacts with Curse action differently |
| Spirit | +40% XP multiplier; cannot be hit physically — must be defeated via Cast, Speak, or Curse |

### NPCs

| Type | Behavior |
|------|---------|
| Friend | Friendly NPC; no combat; emoji suffix defines required quest item |
| Pet | Companion animal; recruitable via specific actions |
| Recruit | Human NPC that can join the party |

### Special

| Type | Behavior |
|------|---------|
| Upgrade | Perk selection encounter — loads on Sleep when level up available |
| Checkpoint | Forced level-up trigger — grants a full XP bar and rests the player |

---

## Telemetry — Design Data

Anonymous gameplay events are submitted to a Google Sheet via Google Forms. Use this data to inform balancing and content decisions — not as ground truth, but as signal.

**Tracked events and their payloads:**

| Event | Payload format | Useful for |
|-------|---------------|-----------|
| `run_start` | `charName` | Run volume over time |
| `run_end` | `causeOfDeath\|endType` | Death distribution, win rate, where runs end |
| `achievement` | `achievement_id` | Which milestones players reach; which are never unlocked |
| `cheat_used` | cheat message | Cheat popularity |

**Every event also includes:** `level`, `origin`, `difficulty`, `karma`, `stats`, `inventory`, `encounterCount`, `playtime`, `score`, `gameVersion`, `userId`, `sessionId`, `browserInfo`.

**Balancing questions the data can answer:**
- Which items appear most vs. their generator weight — spot overused/underused generators
- Which enemies players encounter vs. area reach — dead zones in the world
- Achievement unlock rates — calibrate difficulty gates and hint text
- Run length (`encounterCount`, `playtime`) by difficulty and origin — pacing check
- Death causes by area — identify stat walls or spike encounters
- Loot source split (drop/gen/fishing/story) — generator weight tuning
- `gameVersion` column — compare metrics across releases to catch regressions

**Access:** Google Sheet linked to the telemetry form. Filter by `gameVersion` to isolate a specific build. CI and Playwright test runs are automatically excluded via the `sd_is_test` localStorage flag.
