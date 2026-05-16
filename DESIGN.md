# Stay Dead — Design Reference

Dark fantasy text roguelike RPG with a melancholic, slightly ironic tone. Not whimsy. Never verbose.

---

## Lore Foundation

The player character botched a resurrection spell attempting to revive his dead bride. The spell didn't bring her back — it corrupted the overworld instead. The player is now undead, reincarnating endlessly, pushing through a world warped by his own mistake to reach her.

**This is not the underworld.** The areas are the corrupted overworld — familiar places (wildlands, a village, a fairyland, a river, a necropolis) twisted by the failed spell. The decay vocabulary exists because the world is literally falling apart around a singular act of desperate love.

The journey ends in the **Shrouded Necropolis** with a branching finale: 9 endings determined by how much love, karma, and magic the player carried through the run. Rosabel is the reason for everything — the corruption, the reincarnation loop, the whole game.

**Keep this in mind when writing content:** enemies aren't random fantasy creatures, they're things that belong in a world coming apart. Items aren't loot drops, they're remnants. The tone is grief wearing armor.

---

## Player Experience Philosophy

Everything in the game points toward one question: *did you deserve her?* The emotional design serves that spine. Every mechanic, every text beat, every shareable moment should either build toward the final choice or make the run feel like it mattered.

### Emotional Spine

The journey is the approach to Rosabel. Progression means getting closer to her -- not just accumulating stats. Gear finds, boss kills, and companion bonds should feel like chapters in that approach, not neutral resource events.

Every run ends in one of two states: you reached her, or you didn't. Both should feel earned. Failure should teach. The world should feel the weight of both outcomes.

### Death as Story

The death message field is the game's most powerful asset. It is the shareable unit -- not the score. A well-written message outlasts a number. Design rule: every enemy row must earn its death message the way a poem earns its last line.

Death messages belong on the death screen, in the run history, and in the online scoreboard. If a player dies to something and the message is lost, the moment was wasted.

### Companion Narrative Stakes

Companions are relationships, not trophy emojis. A dog that barks before danger is a companion. A dog that sits in the party string boosting LCK is furniture.

Rule: every companion needs a named moment before it can be lost. The emotional payload of loss scales with what was built first. The steal/kill/rescue loop only lands if the player already cares. Design companion encounters to build attachment before it can be tested.

Long-term goal: enemies should be able to steal, injure, or kill companions, triggering a fight to recover or avenge them. This must be designed via Hades Gate when the companion system is otherwise stable.

### Action Outcome Causality

Flavor text on action outcomes (crit/pass/fail) is not decoration -- it is feedback. Each line should hint at *why* the outcome happened. "The dog saved you" is weaker than "Your bond sharpened its instincts." The stat that caused the result should be implied in the language, even when not stated directly.

Rule: outcome flavor must connect to the player's state (stats, companions, karma, love). Generic "you succeeded" lines are never acceptable.

### Accomplishment Loop

Bosses must be genuinely threatening. Players should expect to die. When they finally kill a boss, they should feel like they paid for it.

Design rules:
- Boss death messages must hint at what the player should have done differently (teaching through death)
- On boss kill, display how many times the player died in the area in total before
- Each area boss should feel meaningfully harder than the preceding area

### Progression as Proximity

Stronger stats and better gear should feel like getting closer to Rosabel, not just stat accumulation. The moment of finding a Legendary item should be textually distinct -- the acquisition message should signal rarity, not just announce a pickup. Players should *feel* themselves getting stronger across a run.

### Shareable Tragedy

Players should want to tell their friends about their run -- but in the key of this game: bragging about how they failed, what cost them, how close they got, not about a high score. "A ghost stole my dog and I fought to get her back" is the target. "I scored 847" is not.

Design test: for every major emotional beat (boss kill, companion event, death), ask what the one-sentence story is. If it takes more than one sentence, the text hook needs to be stronger.

### World Memory

The world should know you've been here before. Rivals, Whispering Stone epitaphs, and rival last words are the current implementation. This principle should expand: prior runs should cast shadows in the world, not disappear entirely on death.

### Emotional Counterweight

Strong negative emotions require counterweight. For every cluster of brutal encounters, the game should offer one moment of genuine stillness -- a memory that doesn't require combat, a prop that is simply beautiful, a log line that is quiet instead of threatening. Without this, the game becomes grimness without payoff.

### The Craving Loop

Good features don't need to be explained -- they need to be felt first. The player reaches for the mechanic before they understand it. By the time they can name what they're chasing, it's already a habit.

Design for desire, not for instruction.

**What players crave without knowing it:**

- **Closure they'll never quite get.** Something is always left unresolved -- a companion still in the party when they died, a rival they never faced, an ending they didn't unlock. The next run isn't a fresh start; it's an unanswered question. Keep one thing visible and just out of reach per run.

- **Something to tell someone about.** Not a score -- a sentence. "I died to a goat. The message said *violently headbutted to your death.*" That's the game's best ad. Every major beat should compress to one story sentence that fits in a screenshot.

- **One more thing, just barely in reach.** A locked origin one achievement away. A boss kill they almost pulled off. A companion they missed by two rooms. Never hide the carrot -- keep it visible, keep it credibly close. Players come back for things they can see.

Rule: if a feature can be learned in the first run and ignored after, it's a tutorial, not a hook. Hooks reward the third run differently from the first. Design with that timeline in mind.

### The Familiarity Bond

The craving loop gets players back. Familiarity makes them stay -- and eventually feel like the world is theirs.

- **Being recognized by the world.** Players name things they care about. When that name comes back -- in a death message, on a Whispering Stone, in a rival encounter -- the world sees them. That recognition lands harder than any stat bonus. Design for the moment of recognition, not just the moment of action.

- **The feeling of knowing something.** A veteran player has read the world. They know what Speak does on INT-locked enemies, when to let karma drop, how to carry companions through the last area. That knowledge should feel earned and worth passing on -- the kind of thing you want to explain to a friend. Depth makes players want to teach others.

Rule: familiarity should deepen across runs, not reset. Every system that reveals new behavior on the third or fifth playthrough earns its place. Systems that have nothing left to show after the first do not.

### Anticipation and Heavy-Hitting Reveal

The gap between hint and reveal is where investment lives. A loot drop in silence is a transaction. A loot drop after "something shifts inside" is a moment.

Apply this everywhere the game delivers value. The log should earn its own reveal. Let the world telegraph before it delivers.

**How to apply:**
- Boss arrival: describe the threat before the encounter loads. "A terrible stillness hangs in the air." The encounter is the payoff, not the opening line.
- Container loot: one line of discovery before the item surfaces. "Dust drifts as the lid gives way."
- Enemy loot: log the win before surfacing what they dropped. The reward lands harder after the beat.
- Rare item found: the acquisition line should feel heavier than a common pickup — phrasing should signal that something different just happened, without naming the tier.

Rule: if the first log line is the reveal, the reveal is wasted. One line of weight before every significant delivery.

### Reads Like a Book, Feeds the Imagination

The game has no rendered world. Every scene exists only in the player's mind, assembled from a log line and an emoji. That makes the writing load-bearing in a way most games never are.

Write every line as if it is the only thing that will exist of that moment — not a summary of what happened, but the moment itself. Players don't read flavor text in a text roguelike. They inhabit it.

**What this means in practice:**
- Log lines place the player inside the action, not outside it. "The cold reaches your bones" not "you feel cold."
- Desc fields are the world seen through a traveler's eye — specific, economical, alive. One detail that earns the creature its existence.
- Death messages close something. They are the last sentence of a short story about this run.
- No mechanical language in flavor text. "You successfully attacked" is a tooltip. "The blow landed harder than you expected" is a sentence worth reading.

Rule: if a line could appear unchanged in any other game's status bar, it is not good enough. If it reads like a sentence from a novel that happens to describe what just occurred — keep it.

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
