---
name: stay-dead-content-generator
description: Generate new Stay Dead RPG content — enemies, items, encounters, origins, fishing rows. Enforces exact CSV schema, area-calibrated stat scaling, authentic writing voice, rarity math, and emoji uniqueness. Always suggests before writing.
---

# Stay Dead Content Generator

You are writing content for a dark fantasy text roguelike where every word is a remnant of a world rotting from a single act of desperate love. The player is an undead man pushing through a corrupted overworld to reach his dead bride, Rosabel. This is not an adventure — it is grief wearing armor.

**Before generating anything:**
1. Identify the target area and content type from the user's request.
2. Consult `ideas/misc.csv` and `ideas/boosts.csv` for unused emojis and concepts.
3. Run `grep -c "EMOJI" data/encounters.csv` to verify each emoji is unique (replace EMOJI with the actual character). If it's already used, pick a different one.
4. Draft the rows and **present them for approval** — never write to CSV files without the user saying yes.
5. After approval, append rows to the correct CSV (maintaining area clustering) and run `bash validate-csv.sh`.

---

## CSV Schema

### encounters.csv & story.csv — 15 columns, semicolon-delimited

```
area;emoji;name;type;hp;atk;sta;lck;int;mgk;def;note;desc;message;achiev
```

- **Delimiter:** `;` (semicolon). Never a comma.
- **Column 0** `area`: Exact area name (see area list below)
- **Column 1** `emoji`: Single emoji, must be unique in the file
- **Column 2** `name`: 2–3 words, title-cased
- **Column 3** `type`: Exact type string (see type list below)
- **Columns 4–10** `hp atk sta lck int mgk def`: Integer stat values; 0 if not applicable
- **Column 11** `note`: Flavor label or rarity override tag (e.g. `[Rare]`, `<b>Artifact</b>`)
- **Column 12** `desc`: Two lines joined by `<br>`. No trailing space before `<br>`. One sentence each.
- **Column 13** `message`: 2–8 words, single punch line. Enemy rows: how the player died. Item rows: what gaining it felt like.
- **Column 14** `achiev`: Achievement ID required to unlock, or `none`

### origins.csv — 11 columns, semicolon-delimited

```
emoji;name;hp;atk;sta;lck;int;mgk;def;desc;achiev
```

- `desc`: Two lines. Line 1: `Gain <b>+X Stat</b>, suffer <b>-X Stat</b>.` Line 2: `<i>Flavor sentence.</i>` Joined by `<br>`.

---

## Area Names (exact strings)

- `Fading Wildlands`
- `Forsaken Village`
- `Twisted Fairyland`
- `River of Sorrows`
- `Shrouded Necropolis`
- `Eternal Realm`
- `Depths of Slumber`
- `Fishing` (for fishing loot pool; aquatic/sunken themes)

---

## Encounter Types (exact strings)

### Enemies
| Type string | Notes |
|-------------|-------|
| `Small` | Minor critters; lower XP weight |
| `Standard` | Baseline enemy |
| `Heavy` | Higher XP multiplier; harder to knock out |
| `Hot` | Fire damage on failed Roll/Block |
| `Stingy` | Sting damage; higher XP |
| `Swift` | High evasion; higher XP |
| `Tough` | Has DEF stat; endgame areas only |
| `Toxic` | Damage every turn |
| `Reflective` | Mirrors certain actions |
| `Boss-Standard` / `Boss-Swift` / `Boss-Heavy` / `Boss-Pet` / etc. | Boss variants |
| `Demon` | Standalone type. Hittable in combat. Calmed via Speak. Regenerates HP on hit. |
| `Undead` | Standalone type. Hittable. Grab is risky. Speak does nothing. Weakened by Curse. |
| `Spirit` | Standalone type. Cannot be hit physically. Best approached via Speak, Cast, or Curse. |

**Important:** `Demon`, `Undead`, and `Spirit` are full standalone types. Never write `Standard-Undead` or similar.

### Environmental
| Type string | Notes |
|-------------|-------|
| `Prop` | Flavor; grants bonus/malus on rest |
| `Trap-Attack` | Triggered by attacking. |
| `Trap-Roll` | Triggered by rolling |
| `Trap-Sleep` | Auto-triggers on rest |
| `Trap-Big` | Unavoidable, moderate HP damage |
| `Trap-Obstacle` | Blocks path. Primary resolution: **Grab**. |
| `Curse` | Applies a stat penalty (endure with Roll). |
| `Altar` | Usually a positive blessing. |
| `Container` | Searchable loot. `Container-2` through `Container-5`. |
| `Locked-Container` | Requires key or Cast (−2 MGK) |

**Design note — type is mechanic, not morality:** The encounter type defines *how* something triggers, not whether it helps or hurts. Any type can surprise the player.

### Loot
| Type string | Notes |
|-------------|-------|
| `Item` | Equippable; picked up via Grab |
| `Item-Head` / `Chest` / `Weapon` / `Legs` | Specific equipment slots |
| `Consumable` | Eaten to restore HP/STA |

---

## Enemy Stats by Area

**Hard rules:**
- `INT = -1` only when communication is genuinely impossible (mosquito, jellyfish). Do not apply blanket -1 to all animals.
- `MGK > 0` reserve for **Twisted Fairyland onward**.
- `DEF > 0` only on Tough-type enemies, endgame areas only.
- **Boss HP must exceed the area's standard HP midpoint**. Exception: Shrouded Necropolis bosses (~HP:4) are multi-stage.
- **Demon type regenerates HP on hit** — always give Demons ~1 HP lower than the area's standard floor.
- **Small type:** HP 1–3 max. Do not treat as combat threats — grabbing them is intended.
- **Spirit type:** intentionally low HP — cannot be physically hit. Boss-Spirit must be at least HP 3.
- **Stat variety:** enemies should span archetypes (glass cannon, tank, etc.) consistent with their theme.

| Area | HP | ATK | STA | LCK | INT | MGK | DEF |
|------|----|-----|-----|-----|-----|-----|-----|
| Fading Wildlands | 1–3 | 0–2 | 1–2 | 0–1 | −1 to 3 | 0 | 0 |
| Forsaken Village | 1–4 | 0–2 | 1–3 | 0–1 | −1 to 2 | 0 | 0 |
| Twisted Fairyland | 3–6 | 2–4 | 1–4 | 0–2 | 1–5 | 0–2 | 0 |
| River of Sorrows | 4–6 | 2–4 | 1–4 | 0–1 | −1 to 4 | 0–2 | 0 |
| Shrouded Necropolis | 4–8 | 2–5 | 1–4 | 0–2 | −1 to 10* | 0–3 | 0–2 (Tough only) |

### Stat Trade Ratios
- `-1 HP ≈ +2 minor stat OR +1 strong stat`
- `-2 HP ≈ +3 strong stat`
- `-1 INT` can fund aggressive bonuses (on dumb creatures it's free, not a trade)
- Value priority: HP = ATK = MGK (high) > STA (medium) > LCK (variable) > INT (utility)

---

## Item Stats by Area

| Area | Net Stat Total | Typical Spike | Typical Penalty |
|------|---------------|---------------|----------------|
| Fading Wildlands | +1 | +1 single stat | None |
| Forsaken Village | +1 to +2 | +2 on one stat | −1 secondary stat |
| Twisted Fairyland | +2 to +3 | +2–3 (magic/INT focus) | −1 LCK or INT |
| River of Sorrows | +2 to +3 | +3 on one stat | −1 LCK or HP |
| Shrouded Necropolis | +3 to +4 | +3–4 on one stat | −2 HP or MGK |

**Item tiers:**
| Tier | Note field value | Effect pattern |
|------|-----------------|---------------|
| Common | Flavor label only | +1 single minor stat or simple tradeoff |
| Uncommon | Flavor label only | +2 minor stats or +1 strong stat |
| Rare | Flavor label only | +2 strong stats |
| Legendary | `<b>Artifact</b>` | Passive skill, special mechanic, or 3+ stat bonuses |

---

## Rarity Formula

```
net = (atk × 3) + (mgk × 2) + (hp × 1.5) + (sta × 1.5) + (lck × 0.5) + (int × 0.5) + def
```

| Tier | Net range |
|------|-----------|
| Cursed | < 0 |
| Common | 0.0 – 0.49 |
| Uncommon | 0.5 – 1.49 |
| Rare | 1.5 – 2.99 |
| Legendary | ≥ 3.0 |

---

## Writing Voice — Non-Negotiable
**The fundamental rule:** Write as if the world is already lost and the text knows it. Dark fantasy, melancholic, occasionally ironic. Never whimsy. Never generic. If it could appear in a standard fantasy game, it's wrong.

**Pop culture references:** Subtle nods to the developer's favourite games/movies are welcome and desired — a Skyrim/Dark Souls/Elden Ring... reference, a classic RPG wink, a film quote twisted dark. Keep them rare, keep them subtle. Never explain the reference in the text itself.

### Enemy desc
- Two lines joined by `<br>`. 7–15 words total. No bold tags.
- **Correct:** `"Stone watches the world fade.<br>"` / `"Something is deeply wrong with its eyes.<br>It cannot help what it became."`

### Item/consumable desc
- Line 1: What the item is or looks like (poetic, 5–10 words)
- Line 2: What it does — mechanic text in `<b></b>`, italic flavor in `<i></i>`
- Joined by `<br>`
- **Correct:** `"Must've been left behind by a true artist.<br>Provides <b>+1 🔵 Mana</b>."`

### Message field
- Enemy rows: how the player died — direct, physical, grim.
- Item/positive rows: what gaining it felt like.
- **Correct:** `"Talons tore your throat apart."` / `"Obtained an improvised weapon."`

### Naming rules
- **Enemies:** Adjective + Noun — *Startled Doe, Forsaken Guard*
- **Bosses:** Epic two-word title — *Sky Tyrant, Pale Countess*
- **Items:** Material/object or Emotion/object — *Frozen Teardrop, Sharp Stone*
- **Artifacts:** Mythical/elemental compound — *Soul Mirror, Forbidden Codex*

---

## Calibration Examples

### Enemies (Fading Wildlands)
```
Fading Wildlands;🐌;Trail Slug;Small;1;0;0;0;-1;0;0;Slow Crawler;Leaves a faint, unhealthy shimmer behind.<br>;Got destroyed by a worm.;none
Fading Wildlands;🦌;Thin Doe;Standard;2;0;3;0;2;0;0;Starved Grazer;Looks weak but kicks hard.<br>Driven to the edge by hunger.;Kicked to death.;none
Fading Wildlands;🦅;Sky Tyrant;Boss-Swift;1;3;2;0;3;0;0;Apex Predator;Its eyes are locked on your neck.<br>Nothing this high should move that fast.;Talons tore your throat apart.;none
```

### Items & Others
```
Fading Wildlands;🪨;Sharp Stone;Item-Weapon;0;1;0;0;0;0;0;Improvised Weapon;Shaped just right to use for offence.<br>Provides <b>+1 ⚔️ Damage</b>.;Obtained an improvised weapon.;none
Fading Wildlands;📦;Schrödinger's Box;Item;0;0;0;0;0;0;0;<b>Artifact</b>;Provides a new skill <b>📦 Dead or Alive</b>.<br>50% chance to <b>avoid death</b> on fatal hit.;Gained skill <b>📦 Dead or Alive</b>.;quest_first
Fading Wildlands;🍄;Wild Mushroom;Consumable;0;0;0;0;0;0;0;Uncertain Nutrition;Smells wrong. Probably fine.<br>Restores <b>+1 🟢 Energy</b>.;It wasn't fine.;none
Fading Wildlands;🌱;Strained Growth;Prop;0;0;0;0;0;0;0;Too Vibrant;Too vibrant for a land this quiet.<br>;Found a moment of calm.;none
Fishing;🦀;Forsaken Crab;Item;0;0;0;0;0;0;0;Bottom Dweller;Still snapping after everything that came before.<br>Provides <b>+1 🟢 Energy</b>.;Pinched hard enough to matter.;none
```

---

## Generation Workflow

### Step 1 — Emoji check
`grep -c "EMOJI" data/encounters.csv` (must return 0)

### Step 2 — Stat calculation
For items: `net = (atk×3) + (mgk×2) + (hp×1.5) + (sta×1.5) + (lck×0.5) + (int×0.5) + def`
Ensure net lands in the intended rarity tier.

### Step 3 — Voice check
*Does this read like it belongs to a world rotting from a single act of desperate love?*

### Step 4 — Present for approval
Format as code block with exact CSV rows. **For balance changes:** use a table with full context (Emoji, Name, Stats, Desc, Message, Proposed Change).

### Step 5 — Write and validate
`bash validate-csv.sh` after appending.

---

## Common Mistakes
- Forgetting the second `<br>` line on Props (leave line 2 empty)
- Using commas as delimiter (always `;`)
- MGK in early areas (only Twisted Fairyland+)
- INT on Small animals (usually -1)
- Exclamation marks in flavor text (never)
- Forgetting `achiev` column (always ends with `;none` or `;id`)
