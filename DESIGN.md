# Stay Dead — Design Reference

Dark fantasy text roguelike with a melancholic, slightly ironic tone. Not whimsy. Never verbose.

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
- `INT = -1` on dumb creatures (animals, small critters) — they cannot be communicated with
- `MGK` only appears on Undead, Demon, Spirit types
- `DEF` reserved for Tough type only — endgame areas only (value 1 mid-game, 2 late)
- Boss stats mirror area enemies, slightly elevated; Boss HP rarely exceeds 4

---

## Enemy Design

Stat ranges by area:

| Area | HP | ATK | STA | INT | MGK |
|------|----|-----|-----|-----|-----|
| Fading Wildlands | 1–3 | 0–2 | 1–2 | −1 to 3 | 0 |
| Forsaken Village | 1–3 | 0–2 | 1–3 | −1 to 2 | 0–1 (Undead/Demon) |
| Twisted Fairyland | 2–5 | 2–4 | 1–4 | 1–5 | 0–1 |
| River of Sorrows | 1–4 | 1–3 | 1–3 | −1 to 4 | 0–2 (Undead/Demon) |
| Shrouded Necropolis | 1–4 | 2–4 | 1–4 | −1 to 10* | 0–3 |

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

| Type | Behavior |
|------|---------|
| Prop | Environmental flavor; grants bonus/malus on rest |
| Trap-Attack | Triggered by attacking (training dummies = positive, hazards = negative) |
| Trap-Roll | Triggered by rolling/dodging |
| Trap-Sleep | Auto-triggers, applies stat effect |
| Trap-Big | Unavoidable, cannot be destroyed — moderate HP damage |
| Trap-Obstacle | Blocks path, harmless, resolved by attacking |
| Curse | Negative or tradeoff, auto-applies |
| Altar | Positive blessing or sacrifice mechanic |
| Container / Container-2 | Searchable, may contain loot |
| Locked-Container | Requires key or Cast (−2 MGK) to open; force-unlockable by repeated attacks |
