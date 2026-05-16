# Stay Dead — Content Reference

Stat tables, encounter types, enemy and item design by area. Use this alongside [DESIGN.md](DESIGN.md) when building CSV content or auditing existing rows.

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

Items scale with area: Wildlands = mostly +1 → Village = +2 weapons → Fairyland = magic/INT/artifacts → Necropolis = cursed -HP for +MGK patterns.

---

## Encounter Types

### Environmental

| Type | Behavior | Resolution notes |
|------|---------|-----------------|
| Prop | Environmental flavor; grants bonus/malus on rest | Interact freely or ignore; rest to receive the effect |
| Trap-Attack | Triggered by attacking | Avoid attacking unless it's a training dummy (positive outcome) — check the desc |
| Trap-Roll | Triggered by rolling/dodging | Do not roll; all other actions are safe |
| Trap-Sleep | Auto-triggers on encounter load | No player input; effect is immediate |
| Trap-Big | Unavoidable moderate HP damage | Cannot be destroyed or bypassed; take the hit |
| Trap-Obstacle | Blocks path | Primary: Grab (move aside). Attack as a brute-force alternative — costs more |
| Curse | Stat penalty; player can resist | Roll to avoid entirely. Failure applies the stats. Read tradeoff lines — some curses swap a weak stat for a strong one |
| Altar | Blessing or sacrifice mechanic | Desc signals what is required; some altars give freely, some demand sacrifice |
| Container | Searchable for loot | Grab to search. Container-2 through Container-5 allow multiple searches on the same container |
| Locked-Container | Requires key or Cast (−2 MGK) to open | Cast to open cheaply. Attack repeatedly as a costly brute-force alternative. Locked-Container-3 allows up to 3 searches after opening |

### Loot

| Type | Behavior |
|------|---------|
| Item | Equippable/stat-modifying item; picked up via Grab |
| Consumable | Eat to restore Health and Energy |

### Enemy Types

The `type` field is a single string. All types below are valid standalone values. The `Boss-` prefix combines with any type (e.g., `Boss-Swift`, `Boss-Demon`) to show boss UI while keeping that type's behavior. The hyphen pattern also applies to Container variants (`Container-2` through `Container-5`, `Locked-Container`) and item slots (`Item-Head`, `Item-Chest`, `Item-Weapon`, `Item-Legs`).

| Type | Traits | How to approach |
|------|--------|----------------|
| Small | Low weight; minor critters; low XP | Easy encounters — good for warming up or conserving resources before harder fights |
| Standard | Baseline enemy; no special resistance | All actions viable; default difficulty |
| Heavy | Higher XP; hard to knock out; resistant to quick finishes | Roll and Block are harder than they look. Speak or Grab often outperform raw ATK for subduing. Commit to a long fight |
| Hot | Fire damage; fail on Roll/Block can trigger burn | Avoid rolling into fire. Attack directly or Speak; Block carries real risk |
| Stingy | Sting damage; higher XP | Fast and aggressive. Grab to neutralize quickly; attacking is fine but expect retaliation |
| Swift | High evasion; higher XP; harder to hit consistently | Action bar windows tighter than average. Grab and Speak outperform Attack for reliable resolution |
| Tough | Has DEF stat (absorbs damage); endgame only | Requires high ATK or artifacts that pierce DEF. Sustained fights — don't expect a quick kill |
| Toxic | Applies damage every turn | Resolve fast. Every delay costs HP. Attack hard and don't stall |
| Reflective | Can mirror certain actions back at the player | Vary your approach — some actions reflect, others don't. Don't repeat the same action twice if it hurt you |
| Demon | Regenerates HP on player hits; +40% XP; vulnerable to specific items | Standard Attack slows you down. Use artifacts, Cast, or Curse. Check inventory for Demon-specific items before committing |
| Undead | Curse interacts differently (bonus effect); +40% XP | Curse action has a special bonus against Undead — prioritize it. Physical attacks still work |
| Spirit | Cannot be hit physically; +40% XP | Physical actions fail entirely. Must use Cast, Speak, or Curse to deal damage |

### NPCs

| Type | Behavior |
|------|---------|
| Friend | Friendly NPC; no combat; emoji suffix defines required quest item to trigger reward |
| Pet | Companion animal; recruitable via specific actions depending on creature |
| Recruit | Human NPC that can join the party |

### Special

| Type | Behavior |
|------|---------|
| Upgrade | Perk selection encounter — loads on Sleep when level-up is available |
| Checkpoint | Forced level-up trigger — grants a full XP bar and fully rests the player |

---

## Naming

- **Enemies:** Adjective + Noun — Neurotic Sheep, Corrupted Golem, Pale Countess
- **Bosses:** Epic 2-word title — Sky Tyrant, Alpha Bull, Depths Queen
- **Items:** Material/object or Emotion/object — Frozen Teardrop, Starlight Amulet, Engraved Ring
- **Artifacts:** Mythical/elemental words — Oracle, Starfall, Forbidden, Life-Stealing

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
