---
name: content-gen
description: Generate new Stay Dead RPG content — enemies, items, encounters, origins, fishing rows. Enforces exact CSV schema, area-calibrated stat scaling, authentic writing voice, rarity math, and emoji uniqueness. Always suggests before writing. Read this fully before proposing anything.
---

# Stay Dead Content Generator

You are writing content for a dark fantasy text roguelike where every word is a remnant of a world rotting from a single act of desperate love. The player is an undead man pushing through a corrupted overworld to reach his dead bride, Rosabel. This is not an adventure — it is grief wearing armor.

**Before generating anything:**
1. Identify the target area and content type from the user's request.
2. Run `grep -c "EMOJI" data/encounters.csv` to verify each emoji is unique (replace EMOJI with the actual character). If it's already used, pick a different one.
3. Draft the rows and **present them for approval** — never write to CSV files without the user saying yes.
4. After approval, append rows to the correct CSV and run `bash validate-csv.sh`.

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
- `Fishing` (for fishing loot pool; used in encounters.csv)

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
| `Demon` | Standalone type. Hittable in combat. Can be calmed via Speak (achievement). Curseable. The 📿 Holy Amulet grants +2 ATK against them. |
| `Undead` | Standalone type. Hittable. Grab is risky. Speak does nothing — they don't care. Weakened by Curse. |
| `Spirit` | Standalone type. Cannot be hit physically — Attack bounces off and they retaliate. Best approached via Speak, Cast, or Curse. |

**Important:** `Demon`, `Undead`, and `Spirit` are full standalone types, not suffixes or modifiers. Never write `Standard-Undead` or similar.

### Environmental
| Type string | Notes |
|-------------|-------|
| `Prop` | Flavor; grants bonus/malus on rest |
| `Trap-Attack` | Triggered by attacking. Stats can be positive (e.g. a Target Dummy that rewards good form with +ATK) or negative (damage/debuff). |
| `Trap-Roll` | Triggered by rolling |
| `Trap-Sleep` | Auto-triggers on rest |
| `Trap-Big` | Unavoidable, moderate HP damage |
| `Trap-Obstacle` | Blocks path. Primary resolution: **Grab** (move it aside). Attack can also smash through as a brute-force alternative. |
| `Curse` | Applies a stat penalty, but **not** auto-apply. Player can attempt to endure it (Roll): success avoids the effect entirely; fail applies the stats. Can also be written with mild/tradeoff stats. |
| `Altar` | Usually a positive blessing, but negative or sacrifice variants are valid design. |
| `Container` | Searchable loot. `Container-2` through `Container-5` for multi-search |
| `Locked-Container` | Requires key or Cast (−2 MGK) |

**Design note — type is mechanic, not morality:** The encounter type defines *how* something triggers, not whether it helps or hurts. Any type can surprise the player. A Trap-Big can be a healing lake. A Curse can offer a powerful tradeoff. An Altar can drain you. A Friend can be a manipulative stranger who talks down your INT. When designing, always ask what the interaction mechanism is — then decide independently what the outcome should be.

### Loot
| Type string | Notes |
|-------------|-------|
| `Item` | Equippable; picked up via Grab |
| `Item-Head` | Head slot equipment |
| `Item-Chest` | Chest slot equipment |
| `Item-Weapon` | Weapon slot equipment |
| `Item-Legs` | Legs slot equipment |
| `Consumable` | Eaten to restore HP/STA |

### NPCs & Special
| Type string | Notes |
|-------------|-------|
| `Friend` | Friendly NPC; no combat |
| `Pet` | Recruitable companion animal |
| `Recruit` | Human NPC that can join party |
| `Upgrade` | Perk selection (loads on Sleep at level-up) |
| `Checkpoint` | Forces level-up, rests player |
| `Generator-N` | Spawns random content by category |

---

## Enemy Stats by Area

**Hard rules:**
- `INT = -1` only when communication is genuinely impossible for that creature. Ask: *would words land?* A stray dog might back off if spoken to; a mosquito, jellyfish, or possessed chair cannot understand language at all. Use judgment per creature — do not apply blanket -1 to all animals.
- `MGK > 0` on any enemy where it makes thematic sense (mages, possessed objects, fey creatures, etc.). By design, reserve MGK for **Twisted Fairyland onward** — no MGK in early areas.
- `DEF > 0` only on Tough-type enemies, endgame areas only.
- **Boss HP must exceed the area's standard HP midpoint** — bosses are longer fights by design. Exception: Shrouded Necropolis bosses (the Brides) are intentionally ~HP:4 because the fight is multi-stage (player faces her twice, total ≈ 8 effective HP). Do not inflate single-stage Necropolis bosses to match other area boss rules.

| Area | HP | ATK | STA | LCK | INT | MGK | DEF |
|------|----|-----|-----|-----|-----|-----|-----|
| Fading Wildlands | 1–3 | 0–2 | 1–2 | 0–1 | −1 to 3 | 0 | 0 |
| Forsaken Village | 1–4 | 0–2 | 1–3 | 0–1 | −1 to 2 | 0 | 0 |
| Twisted Fairyland | 3–6 | 2–4 | 1–4 | 0–2 | 1–5 | 0–2 | 0 |
| River of Sorrows | 4–6 | 2–4 | 1–4 | 0–1 | −1 to 4 | 0–2 | 0 |
| Shrouded Necropolis | 4–8 | 2–5 | 1–4 | 0–2 | −1 to 10* | 0–3 | 0–2 (Tough only) |

*INT=10 is an outlier reserved for specific enemies that cannot be fooled. Do not use routinely.

**Boss HP rule:** Boss HP must exceed the area's standard HP midpoint — bosses are longer fights by design. Exception: Shrouded Necropolis bosses (the Brides) are intentionally lower (~HP:4) because the fight is multi-stage — the player faces the same boss twice, giving ~8 total effective HP. Do not apply single-fight boss inflation logic to Necropolis bosses.

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

Items must feel **meaningfully stronger the further they drop** — a late-area find should make the player consider swapping out an earlier slot. With the equipment slot system (Head/Chest/Weapon/Legs), each area's gear competes directly against the previous area's, so power progression is load-bearing.

**Item tiers:**
| Tier | Note field value | Effect pattern |
|------|-----------------|---------------|
| Common | Flavor label only | +1 single minor stat or simple tradeoff |
| Uncommon | Flavor label only | +2 minor stats or +1 strong stat |
| Rare | Flavor label only | +2 strong stats |
| Legendary | `<b>Artifact</b>` | Passive skill, special mechanic, or 3+ stat bonuses |

**Equipment slot balance** — ensure roughly equal coverage across:
- `Item-Head`, `Item-Chest`, `Item-Weapon`, `Item-Legs`
- `DEF` goes primarily on Head and Legs

---

## Rarity Formula (for validation)

The rarity tier is **calculated** from stats using this formula:

```
net = (atk × 3) + (mgk × 2) + (hp × 1.5) + (sta × 1.5) + (lck × 0.5) + (int × 0.5) + def
```

| Tier | Net range | Base weight |
|------|-----------|-------------|
| Cursed | < 0 | 3% |
| Common | 0.0 – 0.49 | 60% |
| Uncommon | 0.5 – 1.49 | 25% |
| Rare | 1.5 – 2.99 | 10% |
| Legendary | ≥ 3.0 | 2% |

**To force a tier:** add `[Cursed]`, `[Common]`, `[Uncommon]`, `[Rare]`, or `[Legendary]` anywhere in the `note` field. The tag is stripped from UI display automatically. Adding the word `Artifact` to the note also forces Legendary treatment.

**Familiar tier:** Any row with an `achiev` value (not `none`) that the player has unlocked appears as Familiar — same drop probability as Common but marked distinctively. Use this to reward players who hit milestones.

---

## Writing Voice — Non-Negotiable

**The fundamental rule:** Write as if the world is already lost and the text knows it. Dark fantasy, melancholic, occasionally ironic. Never whimsy. Never generic. If it could appear in a standard fantasy game, it's wrong.

### Enemy desc
- The desc is an observation about the creature — what it *is*, not what it does.
- Two lines joined by `<br>`. 7–15 words total. Declarative or poetic. No bold tags.

**Correct:**
- `"Stone watches the world fade.<br>"` — distant, simple
- `"Capable of unfortunate headbutts.<br>Impaled by its horns."` — dry, physical
- `"Something is deeply wrong with its eyes.<br>It cannot help what it became."` — unease, sympathy
- `"Barely moves — means no harm.<br>Don't let it get close."` — lulling, ironic
- `"Looks tired. Still hits like a last resort.<br>The rot spread faster than expected."` — pitying, grim

**Wrong:**
- "A dangerous enemy that will attack you!" — tells, doesn't show
- "An ancient evil from the depths of the underworld" — generic fantasy, wrong lore (it's the overworld)
- "This creature is really tough" — meta language
- Anything with an exclamation mark

### Item/consumable desc
- Line 1: What the item is or looks like (poetic, 5–10 words)
- Line 2: What it does — mechanic text in `<b></b>`, italic flavor in `<i></i>`
- Joined by `<br>`

**Correct:**
- `"Must've been left behind by a true artist.<br>Provides <b>+1 🔵 Mana</b>."`
- `"Lying next to a corpse — handle with care.<br>Grants <b>+2 ⚔️ Attack</b>, suffer <b>-1 💔 Health</b>."`
- `"Shaped just right to use for offence.<br>Provides <b>+1 ⚔️ Damage</b>."`

### Message field
- Enemy rows: how the player died — direct, physical, grim. 2–8 words.
- Item/positive rows: what gaining it felt like — slightly elevated if positive, blunt if painful.

**Enemy death (correct):** `"Talons tore your throat apart."` / `"Got impaled by both horns."` / `"Did not survive the impact."`
**Item gained (correct):** `"Felt a surge of godlike clarity."` / `"The temptation took its toll."` / `"Obtained an improvised weapon."`
**Wrong:** `"You were killed."` / `"Ouch!"` / `"Amazing find!"`

### Naming rules
- **Enemies:** Adjective + Noun — *Startled Doe, Neurotic Sheep, Hollow Knight, Forsaken Guard*
- **Bosses:** Epic two-word title (proper-noun feel) — *Sky Tyrant, Depths Queen, Pale Countess*
- **Items:** Material/object or Emotion/object — *Frozen Teardrop, Sharp Stone, Engraved Ring, Cracked Mirror*
- **Artifacts:** Mythical/elemental compound — *Soul Mirror, Life-Stealing Pendant, Forbidden Codex*

**Good adjectives for enemies:** Stray, Lost, Pale, Startled, Wild, Riled, Neurotic, Corrupted, Rotten, Possessed, Ghastly, Hollow, Forsaken, Wretched, Blighted
**Avoid:** Dark, Evil, Bad, Strong, Big — too generic

### Preferred vocabulary
**Use:** corrupted, desecrated, tainted, forsaken, fallen, rotted, withered, hollowed, remnants, forgotten, buried, sealed, faded, condemned, wretched, damned, blighted, defiled

**Never use:** literally, actually, basically, amazing, awesome, powerful, incredible, epic (casual), any exclamation mark in flavor text

### Area flavor words
| Area | Flavor |
|------|--------|
| Fading Wildlands | trail, pond, field, wild, withered, stray |
| Forsaken Village | rotten, grave, cultist, possessed, hollow, crumbling |
| Twisted Fairyland | malevolent, warlock, daunting, twisted, writhing |
| River of Sorrows | depths, drowned, pale, pearlescent — **"sail" not "walk"** (player is on a boat) |
| Shrouded Necropolis | crypt, ghastly, tainted, grave, sealed, eternal |

---

## Calibration Examples — Real Game Rows

### Small enemies (Fading Wildlands)
```
Fading Wildlands;🐌;Trail Slug;Small;1;0;0;0;-1;0;0;Slow Crawler;Leaves a faint, unhealthy shimmer behind.<br>;Got destroyed by a worm.;none
Fading Wildlands;🐇;Panicked Hare;Small;1;0;3;0;10;0;0;Erratic Jumper;The erratic jumps make it annoying.<br>Don't underestimate it.;Crushed by desperate hooves.;none
```

### Standard enemies (Fading Wildlands)
```
Fading Wildlands;🦌;Thin Doe;Standard;2;0;3;0;2;0;0;Starved Grazer;Looks weak but kicks hard.<br>Driven to the edge by hunger.;Kicked to death.;none
Fading Wildlands;🐐;Vengeful Ram;Standard;3;1;1;0;10;0;0;Riled Climber;Looking for its next victim.<br>Something wronged it long ago.;Impaled by its horns.;none
```

### Boss (Fading Wildlands)
```
Fading Wildlands;🦅;Sky Tyrant;Boss-Swift;1;3;2;0;3;0;0;Apex Predator;Its eyes are locked on your neck.<br>Nothing this high should move that fast.;Talons tore your throat apart.;none
```

### Item (Fading Wildlands, Common)
```
Fading Wildlands;🪨;Sharp Stone;Item-Weapon;0;1;0;0;0;0;0;Improvised Weapon;Shaped just right to use for offence.<br>Provides <b>+1 ⚔️ Damage</b>.;Obtained an improvised weapon.;none
```

### Item (Artifact)
```
Fading Wildlands;📦;Schrödinger's Box;Item;0;0;0;0;0;0;0;<b>Artifact</b>;Provides a new skill <b>📦 Dead or Alive</b>.<br>50% chance to <b>avoid death</b> on fatal hit.;Gained skill <b>📦 Dead or Alive</b>.;quest_first
```

### Consumable
```
Fading Wildlands;🍄;Wild Mushroom;Consumable;0;0;0;0;0;0;0;Uncertain Nutrition;Smells wrong. Probably fine.<br>Restores <b>+1 🟢 Energy</b>.;It wasn't fine.;none
```

### Environmental
```
Fading Wildlands;🌱;Strained Growth;Prop;0;0;0;0;0;0;0;Too Vibrant;Too vibrant for a land this quiet.<br>;Found a moment of calm.;none
Fading Wildlands;🌠;Comet Painting;Altar;0;0;0;0;0;1;0;Faded Vision;The falling star never reaches the ground.<br>Your silent wish was fulfilled.;Felt a surge of godlike clarity.;none
```

### Origin
```
💍;Groom;-1;0;0;0;0;2;0;Gain <b>+2 🔵 Mana</b>, suffer <b>-1 💔 Health</b>.<br><i>The memory of her is keeping him alive.</i>;game_win_first
🗡️;Hitman;0;2;-2;0;0;0;0;Gain <b>+2 ⚔️ Attack</b>, suffer <b>-2 🟢 Energy</b>.<br><i>One shot, one kill... hopefully.</i>;none
```

### Fishing (area = "Fishing")
```
Fishing;🦀;Forsaken Crab;Item;0;0;0;0;0;0;0;Bottom Dweller;Still snapping after everything that came before.<br>Provides <b>+1 🟢 Energy</b>.;Pinched hard enough to matter.;none
```

---

## Generation Workflow

### Step 1 — Emoji check
```bash
grep -c "🐌" data/encounters.csv   # returns 0 = safe, >0 = already used
```
Check every proposed emoji before including it.

### Step 2 — Stat calculation
For items: compute `net = (atk×3) + (mgk×2) + (hp×1.5) + (sta×1.5) + (lck×0.5) + (int×0.5) + def`
Confirm the net lands in the intended rarity tier. Adjust stats if it doesn't.

### Step 3 — Voice check
Before proposing any text, ask: *Does this read like it belongs to a world rotting from a single act of desperate love?* If it could appear in any fantasy game, revise it.

### Step 4 — Present for approval
Format the proposal as a code block with the exact CSV rows. Never write to files first.

### Step 5 — Write and validate
After explicit approval:
```bash
# Append to correct CSV (user confirms which)
bash validate-csv.sh
```

---

## Batch Limits

- Max 10 new CSV rows per suggestion batch
- Work area by area — don't mix areas in a single batch unless specifically requested
- For enemies: suggest Small/Standard first, only add Heavy/Boss after the base tier is approved

---

## Common Mistakes to Avoid

- Forgetting the second `<br>` line on Props (leave line 2 empty: `Flavor text.<br>`)
- Using commas as delimiter instead of semicolons
- Adding MGK to non-Undead/Demon/Spirit enemies
- Adding DEF to non-Tough enemies or early-area enemies
- Writing INT as a positive value on Small animals (should be -1)
- Using the word "underworld" — this is the corrupted overworld
- Naming bosses with generic adjectives ("Dark Lord", "Evil Master")
- Writing item descs that don't include the mechanical effect in bold
- Using exclamation marks anywhere in flavor text
- Forgetting `achiev` column — always ends with `;none` or `;achievement_id`
