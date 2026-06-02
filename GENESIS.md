# GENESIS.md — Content Generation Process

Full workflow for generating Stay Dead CSV content: enemies, items, encounters, containers, curses. Read alongside `DESIGN.md` and `CONTENT.md`.

---

## Before Writing Anything

1. Read `.claude/skills/content-design.md` — schema, stat ranges, type strings, rarity formula, writing voice, calibration examples.
2. Identify: area, type, stats. If any are missing, make reasonable calls based on the progression curve rather than asking.

---

## Schema

`encounters.csv` and `story.csv` are semicolon-delimited, 15 columns:

```
area;emoji;name;type;hp;atk;sta;lck;int;mgk;def;note;desc;message;achiev
```

Always end with `;none` or `;achievement_id`. Never use commas as delimiter.

---

## Emoji Rules

- Use the exact emoji provided. No substitutions.
- Same emoji can appear on multiple rows, even in the same area.
- Only avoid: same emoji AND same type in the same area (confusing in-game). Different types (enemy vs item) are fine.

---

## Rarity Formula

```
net = (atk×3) + (mgk×2) + (hp×1.5) + (sta×1.5) + (lck×0.5) + (int×0.5) + def
```

| Net | Tier |
|-----|------|
| < 0 | Cursed |
| 0.0-0.49 | Common |
| 0.5-1.49 | Uncommon |
| 1.5-2.99 | Rare |
| >= 3.0 | Legendary |

To force a tier: add `[Rare]`, `[Uncommon]` etc. anywhere in the `note` field. Adding `Artifact` or `<b>Artifact</b>` also forces Legendary. Tags are stripped from UI display automatically.

---

## Progression Curve

Two axes:

**Across areas** (weakest to hardest):
`Fading Wildlands -> Forsaken Village -> Twisted Fairyland -> River of Sorrows -> Shrouded Necropolis`

**Within each area** (story.csv sequence position):
- Earlier rows: weaker gear, lighter enemies, grounded tone
- Later rows: stronger gear, harder enemies, more unsettling and creepy

A +1 weapon belongs early in an area or in an early area. A +2 belongs late in that area or in the next. Always ask: does this stat and tone match where in the full run the player would hit it? Would they actually swap their current slot for this here?

---

## Writing Voice

**Fundamental:** Write as if the world is already lost and the text knows it. Dark fantasy, melancholic, occasionally ironic. Never whimsy. Never generic. If it could appear in any other fantasy game, revise it.

**Lore frame:** The player is a man who botched a resurrection spell. The overworld (NOT underworld) is rotting from it. He reincarnates endlessly pushing toward his dead bride, Rosabel. Enemies are victims or byproducts. Items are things left behind, not crafted rewards. The tone is grief wearing armor.

When in doubt: would a survivor of this world say this, or would a game designer? Write what the survivor would say.

---

## Field Rules

### `name` - exactly 2 words

- Enemies: Adjective + Noun. Good: Stray, Lost, Pale, Hollow, Forsaken, Wretched, Rotten, Blighted. Avoid: Dark, Evil, Big, Strong.
- Bosses: epic proper-noun title. "Sky Tyrant", not "Dark Lord".
- Items: Material + object or Emotion + object. "Frozen Teardrop", "Sharp Stone".

### `note` - short flavor label

Never repeats the name. Shown in-game as a tag.

### `desc` - two lines joined by `<br>`

- Enemy: observation about what the creature *is*, not what it does. Declarative or poetic. No bold tags.
- Item/consumable: line 1 = what it looks like (poetic, 5-10 words). Line 2 = mechanic text in `<b></b>`.
- **Line 2 is optional.** If line 1 lands clean, leave line 2 empty (`<br>`). Don't pad.
- **When line 2 ends with a stat indicator** (`+1 🍀`, `-2 🟢`), the text before it is 2-4 words max. The indicator carries the weight - the text just points at it.

### `message` - 2-8 words, single punch

- Enemy rows: how the player died. Direct, physical, grim.
- Item rows: what gaining it felt like. Short and felt, not literary.
- Container rows: mandatory short past-tense verb phrase. "Opened up the insides." Never blank.
- Prefer visceral over clever. If it sounds like wordplay, cut it for something physical or felt.
- Present tense works. Short fragments work. No flourish.

---

## Stat Rules

- `INT = -1` only when communication is genuinely impossible (insects, mindless creatures).
- `MGK > 0` only from Twisted Fairyland onward.
- `DEF > 0` only on Tough-type enemies, endgame areas only.
- Curses should bite hard - don't soft-pedal penalties. -3 INT, -5 HP are valid.
- Demons: HP ~1 lower than area floor (they regen on hit).
- Boss HP must exceed the area's standard midpoint.

---

## Writing to File

Write directly - no approval loop needed.

- **Staging (default):** prepend new rows at the **top** of `data/staging.csv`. This is the review/distribution step — the user moves rows from staging into the correct area block of `encounters.csv` themselves.
- **Quick testing:** insert rows into `data/story.csv` right after the `//Debug Section` comment (line 12) - they appear early in a run.
- After writing, run `bash scripts/validate-csv.sh`.

---

## Batch Limits

- Max 10 new rows per batch.
- Work area by area - don't mix areas in one batch unless asked.
- For enemies: Small/Standard first, only add Heavy/Boss after the base tier is approved.

---

## Common Mistakes to Avoid

- Using commas instead of semicolons
- Swapping out provided emojis for "safer" alternatives
- Leaving container message blank
- Writing long literary messages when a stat indicator follows
- Padding desc line 2 when line 1 already lands
- Placing items without checking the progression curve
- Adding MGK to early-area enemies
- Adding DEF to non-Tough or early enemies
- Using em-dashes in any game text
- Soft-pedaling curse penalties
