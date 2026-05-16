# Stay Dead — Design Reference

Dark fantasy text roguelike RPG with a melancholic, slightly ironic tone. Not whimsy. Never verbose.

For stat tables, encounter types, enemy traits, and area data — see [CONTENT.md](CONTENT.md).

---

## Lore Foundation

The player character botched a resurrection spell attempting to revive his dead bride. The spell didn't bring her back — it corrupted the overworld instead. The player is now undead, reincarnating endlessly, pushing through a world warped by his own mistake to reach her.

**This is not the underworld.** The areas are the corrupted overworld — familiar places (wildlands, a village, a fairyland, a river, a necropolis) twisted by the failed spell. The decay vocabulary exists because the world is literally falling apart around a singular act of desperate love.

The journey ends in the **Shrouded Necropolis** with a branching finale: 9 endings determined by how much love, karma, and magic the player carried through the run. Rosabel is the reason for everything — the corruption, the reincarnation loop, the whole game.

**Keep this in mind when writing content:** enemies aren't random fantasy creatures, they're things that belong in a world coming apart. Items aren't loot drops, they're remnants. The tone is grief wearing armor.

---

## Player Experience Philosophy

Everything in the game points toward one question: *did you deserve her?* The emotional design serves that spine. Every mechanic, every text beat, every shareable moment should either build toward the final choice or make the run feel like it mattered.

### Reads Like a Book, Feeds the Imagination

The game has no rendered world. Every scene exists only in the player's mind, assembled from a log line and an emoji. That makes the writing load-bearing in a way most games never are.

Write every line as if it is the only thing that will exist of that moment — not a summary of what happened, but the moment itself. Players don't read flavor text in a text roguelike. They inhabit it.

**What this means in practice:**
- Log lines place the player inside the action, not outside it. "The cold reaches your bones" not "you feel cold."
- Desc fields are the world seen through a traveler's eye — specific, economical, alive. One detail that earns the creature its existence.
- Death messages close something. They are the last sentence of a short story about this run.
- No mechanical language in flavor text. "You successfully attacked" is a tooltip. "The blow landed harder than you expected" is a sentence worth reading.

Rule: if a line could appear unchanged in any other game's status bar, it is not good enough. If it reads like a sentence from a novel that happens to describe what just occurred — keep it.

### The Craving Loop

Good features don't need to be explained — they need to be felt first. The player reaches for the mechanic before they understand it. By the time they can name what they're chasing, it's already a habit.

Design for desire, not for instruction.

**What players crave without knowing it:**

- **Closure they'll never quite get.** Something is always left unresolved — a companion still in the party when they died, a rival they never faced, an ending they didn't unlock. The next run isn't a fresh start; it's an unanswered question. Keep one thing visible and just out of reach per run.

- **Something to tell someone about.** Not a score — a sentence. "I died to a goat. The message said *violently headbutted to your death.*" That's the game's best ad. Every major beat should compress to one story sentence that fits in a screenshot.

- **One more thing, just barely in reach.** A locked origin one achievement away. A boss kill they almost pulled off. A companion they missed by two rooms. Never hide the carrot — keep it visible, keep it credibly close. Players come back for things they can see.

Rule: if a feature can be learned in the first run and ignored after, it's a tutorial, not a hook. Hooks reward the third run differently from the first. Design with that timeline in mind.

### The Familiarity Bond

The craving loop gets players back. Familiarity makes them stay — and eventually feel like the world is theirs.

- **Being recognized by the world.** Players name things they care about. When that name comes back — in a death message, on a Whispering Stone, in a rival encounter — the world sees them. That recognition lands harder than any stat bonus. Design for the moment of recognition, not just the moment of action.

- **The feeling of knowing something.** A veteran player has read the world. They know what Speak does on INT-locked enemies, when to let karma drop, how to carry companions through the last area. That knowledge should feel earned and worth passing on — the kind of thing you want to explain to a friend. Depth makes players want to teach others.

Rule: familiarity should deepen across runs, not reset. Every system that reveals new behavior on the third or fifth playthrough earns its place. Systems that have nothing left to show after the first do not.

### Emotional Spine

The journey is the approach to Rosabel. Progression means getting closer to her — not just accumulating stats. Gear finds, boss kills, and companion bonds should feel like chapters in that approach, not neutral resource events.

Every run ends in one of two states: you reached her, or you didn't. Both should feel earned. Failure should teach. The world should feel the weight of both outcomes.

### Death as Story

The death message field is the game's most powerful asset. It is the shareable unit — not the score. A well-written message outlasts a number. Design rule: every enemy row must earn its death message the way a poem earns its last line.

Death messages belong on the death screen, in the run history, and in the online scoreboard. If a player dies to something and the message is lost, the moment was wasted.

### Anticipation and Heavy-Hitting Reveal

The gap between hint and reveal is where investment lives. A loot drop in silence is a transaction. A loot drop after "something shifts inside" is a moment.

Apply this everywhere the game delivers value. The log should earn its own reveal. Let the world telegraph before it delivers.

**How to apply:**
- Boss arrival: describe the threat before the encounter loads. "A terrible stillness hangs in the air." The encounter is the payoff, not the opening line.
- Container loot: one line of discovery before the item surfaces. "Dust drifts as the lid gives way."
- Enemy loot: log the win before surfacing what they dropped. The reward lands harder after the beat.
- Rare item found: the acquisition line should feel heavier than a common pickup — phrasing should signal that something different just happened, without naming the tier.

Rule: if the first log line is the reveal, the reveal is wasted. One line of weight before every significant delivery.

### Companion Narrative Stakes

Companions are relationships, not trophy emojis. A dog that barks before danger is a companion. A dog that sits in the party string boosting LCK is furniture.

Rule: every companion needs a named moment before it can be lost. The emotional payload of loss scales with what was built first. The steal/kill/rescue loop only lands if the player already cares. Design companion encounters to build attachment before it can be tested.

**[FUTURE]** Enemies should be able to steal, injure, or kill companions, triggering a fight to recover or avenge them. This must be designed via Hades Gate when the companion system is otherwise stable. See [COMP-STAKES] in TODOs.

### Action Outcome Causality

Flavor text on action outcomes (crit/pass/fail) is not decoration — it is feedback. Each line should hint at *why* the outcome happened. "The dog saved you" is weaker than "Your bond sharpened its instincts." The stat that caused the result should be implied in the language, even when not stated directly.

Rule: outcome flavor must connect to the player's state (stats, companions, karma, love). Generic "you succeeded" lines are never acceptable.

### Accomplishment Loop

Bosses must be genuinely threatening. Players should expect to die. When they finally kill a boss, they should feel like they paid for it.

Design rules:
- Boss death messages must hint at what the player should have done differently (teaching through death)
- **[FUTURE]** On boss kill, display how many times the player died in that area before the kill — see [BOSS-TOLL] in TODOs
- Each area boss should feel meaningfully harder than the preceding area

### Progression as Proximity

Stronger stats and better gear should feel like getting closer to Rosabel, not just stat accumulation. The moment of finding a Legendary item should be textually distinct — the acquisition message should signal rarity, not just announce a pickup. Players should *feel* themselves getting stronger across a run.

### Shareable Tragedy

Players should want to tell their friends about their run — but in the key of this game: bragging about how they failed, what cost them, how close they got, not about a high score. "A ghost stole my dog and I fought to get her back" is the target. "I scored 847" is not.

Design test: for every major emotional beat (boss kill, companion event, death), ask what the one-sentence story is. If it takes more than one sentence, the text hook needs to be stronger.

### World Memory

The world should know you've been here before. Rivals, Whispering Stone epitaphs, and rival last words are the current implementation.

**[FUTURE]** This principle should expand: prior runs should cast shadows in the world, not disappear entirely on death. See [FIGHT-GHOST], [STONE-HINT] in TODOs for in-progress work toward this.

### Emotional Counterweight

Strong negative emotions require counterweight. For every cluster of brutal encounters, the game should offer one moment of genuine stillness — a memory that doesn't require combat, a prop that is simply beautiful, a log line that is quiet instead of threatening. Without this, the game becomes grimness without payoff.

---

## Tone & Voice

- desc fields: 7–15 words, declarative or poetic
- message fields: 2–8 words, punchy
- No modern slang, no generic filler phrases
- Preferred adjectives: Forgotten, Broken, Starved, Cursed, Diseased, Corrupted, Desperate, Forsaken, Hollow, Blighted, Tainted, Withered

**Enemy desc — good:**
- "Stone watches the world fade."
- "Capable of unfortunate headbutts."
- "Something is deeply wrong with its eyes."
- "Barely moves — means no harm."

**Enemy desc — do not write:**
- "A fearsome creature that will attack you on sight." (narrates, doesn't evoke)
- "Corrupted by dark magic." (generic; says nothing specific about this creature)
- "Dangerous. Proceed with caution." (tooltip voice)

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

## The 9 Endings

The game's finale is a choice at the foot of Rosabel's encounter. Nine answers to the question the whole run was asking. Each is gated behind the stats the player accumulated — love, karma, magic — making the available choices a reflection of the run itself.

Three endings are always available regardless of what the player did. The other six open only when the run earned them.

### Gating

| Ending | Button | Requires | Action bar |
|--------|--------|----------|------------|
| Kill | 🔪 | Nothing | Red zone |
| Leave | 💔 | Nothing | Red zone |
| Guard | 🔰 | Nothing | Green |
| Sleep | 💤 | Love ≥ 1 | Green |
| Hold | 🫂 | Love ≥ 4 | Green |
| Name | ❤️ | Love ≥ 6 and Karma ≥ 2 | Green |
| Cure | ❤️‍🩹 | MGK ≥ 4 | Green |
| Beg | 🙏 | Karma ≥ 4 | Green |
| Damn | 💀 | Karma ≤ -2 | Red zone |

### What each ending means

**Kill** — She finally rests. You walk on alone. The coward's exit dressed as mercy — or the only honest act a broken man could manage. Available to every player because any player might arrive without answers.

**Leave** — You turn your back. The cruelest choice because it is the most legible one. You came all this way and couldn't face her. The world rots behind you. She still waits. This is failure dressed as restraint.

**Guard** — You stay and slowly turn to stone beside her. Love as stasis: neither of you free, both of you together. For the player who couldn't leave and couldn't act — frozen by everything they felt.

**Sleep** — You lie beside her and the world goes quiet. Not salvation, but surrender. A small tenderness carried through the run earns a small peace. The quietest ending, and not a bad one.

**Hold** — You hold her close and the darkness takes you both. Together at last, at the cost of everything. Love deep enough to choose annihilation over separation. The player who felt enough — but not enough to save her.

**Name** — The hardest unlock. You say her name — Rosabel — and the spell that was never finished finally breaks. She remembers who she was. The only ending that could be called healing. The game's answer to the question the whole run was asking: did you deserve her?

**Cure** — You use the same magic that started all this to unmake what it made. Not love, not virtue — skill. The craftsman's ending. Available only to players who invested deeply in the power that caused the catastrophe.

**Beg** — You ask something larger than yourself for mercy and it is granted. She is taken gently. Not your act — the accumulated weight of every choice you made not to be cruel. The righteous ending, for players who walked through violence without becoming it.

**Damn** — You seal a dark pact. Darkness claims you both. None of you deserve peace. The run's cruelty was always pointing here — this ending is a mirror, not a surprise. Available only to players who earned it the wrong way.

### Design notes

The three ungated endings (Kill, Leave, Guard) are intentional: any player who reaches the end can still choose to be cowardly, destructive, or paralyzed. Love, karma, and magic don't grant access to the finale — they open the better answers once you arrive.

The action bar renders red on endings that represent moral failure or destruction (Kill, Leave, Damn) and green on all others. This is not a difficulty signal — it is a tone signal. Players who pay attention will feel it before they press.
