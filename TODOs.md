# Styx Flow — 2026-05-15 — Stay Dead

*114 items · 2026-05-16: +1 (BARK-CTX) — contextual companion barks; prior: +2 (LOOT-TEAS, LOOT-ANIM) — lootbox anticipation system; prior: +2 (PET-ENCNTR, PET-SLOT), 3 expanded (COMP-PLAY, ENC-PREGEN, PATH-CHOICE) — pet interaction system, companion barks, crossroads; prior: SPRINT block from Perseus 2026-05-15, dog bark / encounter pre-gen*

---

## SPRINT — Creative Polish Day *(one man, one day — max fun, max hook)*

### [DEATH-MSG] Improvement: Feature enemy death message prominently on game-over screen
- The `message` field on enemy rows describes how the player died and some are devastating — e.g. "You became the grief you were running from." — but it's buried in the log when the death screen has already transitioned.
- In `gameOver()` (game-loop.js), grab `enemyMessage` and render it as hero text on the game-over screen — above the stat summary, below the enemy emoji; one new DOM element or repurpose an existing panel in `ui-render.js`.
- Zero new writing required — the content is already in the CSV.
- Priority: SPRINT — highest emotional punch per effort on the list; makes every death feel like a line from the game's soul.
- Type: Improvement
- Effort: S | Gain: XL
- Source: Perseus creative sprint 2026-05-15 — Narrative Writer, confirmed by Hardcore Fan vote

### [FLASH-CRIT] Improvement: .flash-crit CSS animation on critical hits
- Brief card flash on critical hit — hook into existing ui-effects.js animation infrastructure.
- Bundle with [CRIT-SHAKE] for full crit feedback; guard every `animationend` handler with `if (e.target !== e.currentTarget) return` to prevent child element bubbling bugs.
- Priority: SPRINT — the action bar's crit moment is completely silent right now; highest-leverage feel fix for every encounter.
- Type: Improvement
- Effort: XS | Gain: M

### [CRIT-SHAKE] Improvement: Crit attack shakes enemy card; crit walk bounces player card
- On crit-pass Attack: shake enemy card only (not full screen). On crit-pass Walk: slight bounce on player card only.
- Bundle with [FLASH-CRIT]; guard `animationend` with `if (e.target !== e.currentTarget) return`.
- Priority: SPRINT — targeted micro-feedback that makes the skill check feel like it mattered; paired with FLASH-CRIT for full crit moment.
- Type: Improvement
- Effort: S | Gain: M

### [COMP-PLAY] Feature: Companion passive gameplay effects
- Companions in the party should have passive gameplay effects beyond score contribution; even one passive trigger per companion type transforms the party string from a trophy into a living team.
- Start with 3 companion types: 🐱 cat = +1 LCK per encounter (`playerPartyString.includes('🐱')` check), 🧙 monk = small prayer success bonus, 🐶 dog = barks a warning to the log when the next encounter is dangerous (high-ATK enemy, trap, boss) — requires the next encounter to already be resolved before navigation; see [ENC-PREGEN].
- Pure `includes()` checks at existing decision points — no new state objects needed.
- Recruit companion = human-pet variant: speech-style tips in the log instead of barks — same emoji check, different string pool. See [PET-ENCNTR] for the CSV-encounter approach (spawns actual encounter rows per party composition, parallel to this item's passive log effects).
- Priority: SPRINT — "my cat saved me" is a story the game currently cannot tell; this is a retention hook hiding in plain sight.
- Type: Feature
- Effort: M | Gain: M
- Needs: Define what passive effects companions should grant before implementing.

### [SEQ-DELAY] Improvement: Sequential action display — delay 0.5s per log entry
- Add a 0.5s delay between log entries in multi-step action sequences; wait for effects to complete before re-enabling player input.
- Wrap the `logAction()` call chain in a `setTimeout` queue; 500ms between entries; block player input until the chain resolves; scope to multi-step sequences only — single actions stay instant.
- Priority: SPRINT — grab/speak/companion sequences currently dump as a text wall; staggering makes each beat land and companions saving the player become a moment rather than a footnote.
- Type: Improvement
- Effort: S | Gain: M

### [STORY-FADE] Improvement: Story fades — longer and smoother
- Increase duration and smooth easing on game-start, invader, memory, and final boss fade transitions.
- Priority: SPRINT — transitions are functional but thin; polish here signals craft to first-time beta players.
- Type: Improvement
- Effort: S | Gain: M

### [CRIT-PULSE] Improvement: Crit zone CSS pulse animation while action bar is active
- While the action bar animates, add a slow CSS `@keyframes` brightness pulse (1s loop) on the crit zone element — telegraphs "hitting this is special" before the result lands; remove on bar stop.
- Pure CSS change in `action-bar.js`; no logic changes.
- Priority: SPRINT — trains players to chase crits without a tooltip; makes the skill check feel alive before they hit it.
- Type: Improvement
- Effort: XS | Gain: M
- Source: Perseus creative sprint 2026-05-15 — VFX Artist, confirmed by Genre Fan vote

### [ENEM-TELL] Improvement: Enemy tell — pre-attack log hint for high-ATK enemies
- For enemies with ATK ≥ 4, log a brief flavor hint before their attack resolves — e.g. "The Revenant raises its arm..." — rewards veteran players who've learned to read it.
- In `encounter-loader.js` or `enemy-skills.js`, add a pre-attack log entry before damage resolution; can be generic per enemy type or pull from a small flavor pool in `string-generator.js`.
- Priority: SPRINT — veteran recognition loops drive replayability; doesn't change mechanics but makes experienced players feel smart.
- Type: Improvement
- Effort: S | Gain: M
- Source: Perseus creative sprint 2026-05-15 — Game Design Lead + Game Director

### [CRIT-SLEEP] Improvement: Crit sleep outside combat → extra STA
- A critical success on a sleep action outside combat (e.g., falling leaves) should grant bonus STA beyond the standard recovery.
- In `action-resolver.js` sleep case: if `result === 'crit-pass'` AND `!inCombat`, add `+1 STA` on top of standard recovery and log a flavor line — e.g. "You rest so deeply something comes loose."
- Priority: SPRINT — small discovery moment that extends crit reward to a new emotional beat; players who find it will talk about it.
- Type: Improvement
- Effort: S | Gain: M

### [STONE-HINT] Feature: Whispering Stone — one stone surfaces a true hint from player data *(fan wildcard)*
- Currently both Whispering Stones show flavor epitaphs; make one of the two occasionally surface something true — a stat hint or next-area warning derived from real player submission data.
- Infrastructure already in `rival-manager.js` (`buildWallPropRow()`); pull from the existing pool entries and filter for a "wisdom" subset rather than pure epitaph.
- Priority: SPRINT — near-zero cost on existing infrastructure; the moment a player reads something true from the dead is unforgettable and shareable.
- Type: Feature
- Effort: S | Gain: L
- Source: Perseus creative sprint 2026-05-15 — Hardcore Fan wildcard

### [KILL-LINE] Improvement: Post-run kill summary line on game-over screen *(fan wildcard)*
- Add one generated sentence on the game-over screen summarizing a notable run moment — e.g. "You killed 12 enemies. The Revenant was not among them." Pull from run encounter data; filter by encountered-but-survived enemies.
- In `gameOver()` / `ui-render.js`: pull encounter history or equivalent run state; find a high-ATK enemy the player met but didn't kill; generate one flavor sentence via `string-generator.js`.
- Note: this is the beta-tier delivery of the run summary feature. [RUN-IMPACT] (Backlog) is the full future version.
- Priority: SPRINT — makes every run feel like a specific story that didn't quite finish; the unresolved enemy line is the kind of detail players screenshot.
- Type: Improvement
- Effort: S | Gain: M
- Source: Perseus creative sprint 2026-05-15 — Genre Fan wildcard

### [BOSS-TOLL] Improvement: Boss death counter — show area death toll on boss kill
- On killing an area boss, display how many times the player died in that area before the kill — e.g. "After 3 deaths in the Twisted Fairyland." Zero deaths gets its own line — e.g. "First blood. Somehow." Bosses are drawn from a pool per area, so the counter is per area, not per specific enemy.
- Track `areaDeathCount` (reset each area) in `gameOver()` keyed to current area; read and display on boss kill resolution in `action-resolver.js` or `game-loop.js`.
- Priority: SPRINT — the DS accomplishment moment depends on the number being visible; reframes repeated death as paying the price for an area, not just failing.
- Type: Improvement
- Effort: S | Gain: L

### [LOOT-TEAS] Improvement: Pre-reveal anticipation moment for loot — obscured card + roll text + snap reveal
- During the anticipation phase, the encounter card is fully veiled: placeholder emoji (e.g. `✨` or `?`), obscured name ("..."), no description visible. A brief flavored log line runs ("Searching through the remains...", "Reeling in..."). Then the snap reveals emoji, name, and desc all at once.
- The veil is a transient UI state — likely a CSS class toggle (`.loot-veiled`) on the encounter card element in `ui-render.js`, removed after a `setTimeout` delay.
- Triggers: enemy corpse loot (`encounter-loader.js`); shop buy; fishing pull (`game-loop.js` / `getRandomFish()`); navigating to a pre-generated loot encounter.
- Roll text pool lives in `string-generator.js`; vary by source (enemy drop vs. fishing vs. shop).
- Priority: SPRINT — hiding the outcome until the snap transforms every loot moment from a log update into an event; one of the oldest engagement tricks and it works.
- Type: Improvement
- Effort: M | Gain: L
- Details: Beta-tier delivery of [LOOT-ANIM]; full animation version is Backlog/Hades Gate.

---

## P0 — Hard Blockers *(drop everything)*

*(none)*

---

## P1 — Serious Issues & Big Wins

### [PLAY-GATE] Chore: ME — Personal playtesting gate before beta
- Finish the game at least 3x; upload data to leaderboard and confirm score appears within 35 min; test fishing boss summon via Curse in the same session (repeat) and across sessions; verify Rankings and Chronicles UI flow end-to-end.
- Priority: P1 — hard gate; nothing ships to friends before this is done
- Type: Chore
- Effort: M | Gain: XL

---

## P2 — Release-Gating

### [DEATH-HIST] Improvement: Death message in run history and online scoreboard
- The enemy death message (how the player died) should be visible in the Chronicles run history detail view and on the online scoreboard entry — not just on the death screen.
- Death message is already stored in telemetry (`causeOfDeath` in `run_end`); surface it in the Chronicles detail panel (`ui-render.js`) and in the scoreboard stat card (Rankings screen / `score-manager.js`). Rankings pipeline may need the field passed through `ghostLink` payload if not already present.
- Priority: P2 — death messages are the game's best writing; burying them after the death screen wastes the asset and removes the social hook.
- Type: Improvement
- Effort: M | Gain: L

### [MIRR-ENCNTR] Feature: 🪞 Mirror encounter type — hidden stat reveal
- New encounter type displaying one hidden stat's current value (mirror-luck, mirror-int, mirror-karma) + a contextual hint string about what the stat does (e.g., "3🍀 — Luck tips the scales"). Mirror can be broken for a negative effect, or spoken to at INT mirror for a +1 INT boost. Start by mimicking prop activity handling; expand per mirror variant.
- Priority: P2 — directly addresses the single most-flagged design gap: players have no signal on hidden stats mid-run
- Type: Feature
- Effort: M | Gain: XL

### [TUTOR-REVAMP] Feature: Tutorial revamp
- Current tutorial is hardcoded in story.csv — needs feature-level improvement: explain the action bar mechanic on first encounter, hint that moral choices accumulate, clarify drachma persistence across runs.
- Priority: P2 — onboarding is the #1 beta risk; wrong mental models form in the first 3 minutes
- Type: Feature
- Effort: M | Gain: XL

### [ACHIEV-UNLCK] Feature: Complete missing achievement unlocks + unique origin powers
- Wire all remaining achievement unlock triggers; for unlockable origins, add or replace flat stat grants with unique starting powers (e.g., starting Legendary item, passive ability — check head of origins.csv for candidates).
- Priority: P2 — achievement system is a retention hook; broken unlocks and flat origins undermine it
- Type: Feature
- Effort: L | Gain: L

### [RANK-UI] Improvement: ME — Rankings and Chronicles UI tweak
- Refine Rankings list + detail and Chronicles list + detail — layout, readability, endgame polish.
- Priority: P2 — endgame screens are the social product; unfinished here reads as abandoned
- Type: Improvement
- Effort: M | Gain: L

### [ENLCK-FUNC] Improvement: Make enemy LCK stat functional
- Enemy LCK currently does nothing visible — wire it to counter player LCK on crit chance and/or action bar intervals; optionally affect fishing spot chances.
- Priority: P2 — dead stat on a UI-visible field erodes trust in every other hidden system
- Type: Improvement
- Effort: M | Gain: L

### [PET-ENCNTR] Feature: Pet interaction encounter spawns — companion-triggered CSV encounters
- If a pet emoji is in `playerPartyString`, enable a pool of pet-specific encounter rows to spawn in that area — purely an emoji `includes()` check, no new state objects.
- Works like existing Toga artifact-style encounters: a random slot in the area encounter sequence can be a pet-interaction row matched to the party's pet type.
- Dog example rows: "Kerberos requests belly rubs.<br>Shaking tail full of excitement." / "Kerberos barks loud a lot.<br>Seems like danger ahead." (boss-warning variant — requires [ENC-PREGEN] to peek at next encounter type).
- Recruit companion (human type) = same system but speech-style: "The stranger pauses. 'Something doesn't feel right ahead.'" — actual words, not barks.
- Start with dog and recruit; add cat/bird/lizard pools as a follow-up content pass.
- Priority: P2 — quick beta win; companions go from trophy emojis to reactive characters with near-zero architecture; warmup for the full [PET-SLOT] vision.
- Type: Feature
- Effort: S | Gain: L
- Needs: Write encounter CSV rows per pet type (dog belly rub, nuisance, boss-warning). Boss-warning variant gates on [ENC-PREGEN]. Long-term bark pool vision: see [PET-SLOT].

### [BARK-CTX] Improvement: Contextual companion barks — split bark pools by encounter type
- Refactor the bark system in `companion-manager.js` to fire different bark pools based on the current encounter context instead of generic barks regardless of situation.
- Trigger mapping: negative trap/curse encounter → warn barks; neutral prop → standard barks; boss proximity → alert barks; positive encounter (passive mob, altar, friend) → wonder/curiosity barks; etc.
- Flagged in multiple reviews as the single biggest gap in companion feel — generic barks break immersion and undercut the "companions as relationships" design principle in DESIGN.md.
- Related items: [COMP-PLAY] (companion passives, SPRINT), [PET-ENCNTR] (companion encounter rows, P2); bark context is what makes both of those land emotionally.
- Priority: P2 — multi-review flag; contextual firing is the difference between a companion that *reads* the world and one that just makes noise.
- Type: Improvement
- Effort: S | Gain: L

---

## P3 — Should-Fix

### [ACTN-FLAVOR] Feature: Action outcome flavor text — per-outcome log lines
- Each action result (crit-pass / pass / fail / crit-fail) on an encounter should have a distinct flavor log line beyond the current generic text. Lines must hint at *why* the outcome happened — the stat or companion that tipped it — not just describe the result.
- Add outcome-variant strings to `string-generator.js` or per-encounter-type pools; call from `action-resolver.js` after result resolution. Start with the highest-volume encounter types: Standard enemies and Props.
- Priority: P3 — flavor text without causality hint is decoration; this is what closes the feedback loop between player stats and moment-to-moment feel.
- Type: Feature
- Effort: M | Gain: L

### [COMP-STAKES] Feature: Companion narrative stakes — full system (Hades Gate)
- Full companion stakes design: companion individuation (a logged "named moment" when a companion joins), enemy steal/kill mechanic, rescue/revenge fight. Companions must feel like relationships with a story, not emoji bonuses.
- Do NOT implement until [COMP-PLAY] is stable and companions have demonstrated passive gameplay value first. Design via Hades Gate when ready.
- Priority: P3 — companion individuation before the steal/kill mechanic is a hard prerequisite; loss only lands if attachment was built.
- Type: Feature
- Effort: XL | Gain: XL
- Needs: Full design via Hades Gate. Prerequisite: [COMP-PLAY] stable.

### [STAT-DISP] Improvement: Stat display — show numeric when over 5
- If a stat value exceeds 5, display it as a number (e.g., ❤️ 4/6) instead of the icon-count style — UI space is limited.
- Priority: P3 — clarity for high-stat builds; not common enough to block beta
- Type: Improvement
- Effort: S | Gain: M

### [NAME-QUAL] Improvement: Generator name rolls quality pass
- Revise name generation to avoid "unliving" words on living enemies; consider adding actual proper names in Rosabel-style tone — believable styling takes priority over stat matching.
- Priority: P3 — tonal immersion; name mismatch breaks the register
- Type: Improvement
- Effort: S | Gain: M

### [CURSE-REFAC] Improvement: Curse refactor — better branching per stat type
- Curses should have branching button options matched to the stat they affect — e.g., "Howling Wind" endure should not share the action button with INT-based curses.
- Priority: P3 — mechanical consistency; curses currently all feel the same
- Type: Improvement
- Effort: M | Gain: M

### [COLOR-BLIND] Improvement: Colorblind-safe crit/success zones
- Ensure crit and success zones on the action bar are distinguishable without color — brightness difference or pattern.
- Priority: P3 — accessibility; not gating beta
- Type: Improvement
- Effort: S | Gain: M

### [MIN-CLICK] Improvement: Minimize 1-click encounters
- Reduce encounters that resolve in a single click with no decision — use encounterUsed to create at least one action opportunity before resolution.
- Priority: P3 — player agency; 1-click encounters feel like dead zones
- Type: Improvement
- Effort: M | Gain: M

### [AMB-FX] Feature: Area ambient UI effects — falling leaves, rain, fog per area
- Pixel-styled, black-outlined ambient effects per area (falling leaves, blue/purple leaves, rain, fog). Expose per-area config: effect type, density, frequency, speed.
- Priority: P3 — atmosphere; L effort and not blocking beta
- Type: Feature
- Effort: L | Gain: L

### [ORIG-UNIQ] Feature: More unique origins with gameplay implications
- Add origins with real mechanical effects beyond stat distribution — passives, starting conditions, unique interactions.
- Priority: P3 — origin depth; builds on the achiev-origin work in P2
- Type: Feature
- Effort: M | Gain: M

### [ITEM-RARITY] Feature: Item/Origin — increases higher rarity drop chance
- New item or origin that shifts loot probability toward Uncommon/Rare/Legendary.
- Priority: P3 — build variety; rarity system is already wired for this
- Type: Feature
- Effort: S | Gain: M

### [ITEM-CRIT] Feature: Item/Origin — bigger crit chance interval
- New item or origin that widens the crit success zone on the action bar.
- Priority: P3 — build variety
- Type: Feature
- Effort: S | Gain: M

### [HOUR-SLOW] Feature: ⏳ Strange Hourglass — 10% slower action bar
- New item: globally slows action bar speed by 10%.
- Priority: P3 — accessible build option; interesting tension with high-speed encounters
- Type: Feature
- Effort: XS | Gain: S

### [CAMP-TYPE] Feature: New encounter type — Camp (spawn enemy on rest)
- Camp encounters spawn an enemy when the player rests (log the spawn). Camp-Grab variant triggers on grab (e.g., investigating a tent or box).
- Priority: P3 — adds tension and encounter depth
- Type: Feature
- Effort: M | Gain: M

### [MAGIC-CONT] Feature: New encounter type — Magic Container (cast to unlock)
- Container that requires Cast to open — contains an item (50% artifact chance, same as standard locked containers).
- Priority: P3 — extends existing container design with a mana decision
- Type: Feature
- Effort: S | Gain: M

### [PINATA-TRAP] Feature: Piñata positive trap — correct button handling
- Grab and Block on a piñata trap should be all red; remaining buttons should be easy as prop; Avoid should follow walk rules.
- Priority: P3 — existing encounter type behaving inconsistently
- Type: Feature
- Effort: S | Gain: M

### [NEG-FRIEND] Feature: Negative friends — stat decrement encounters
- "Negative friend" encounter variants that decrement stats (inverse of a standard friend boost) — add to late-game areas.
- Priority: P3 — adds tension to a currently safe encounter type
- Type: Feature
- Effort: S | Gain: M

### [PET-ADOPT] Feature: Adopt pet for item — give item to tame
- Allow giving a specific item to adopt a pet (e.g., offer a mouse/lizard to a cat) — similar to friend quest item mechanic but for pet recruitment.
- Priority: P3 — adds a resource decision to pet taming
- Type: Feature
- Effort: S | Gain: M

### [HAPTIC-BAR] Feature: Android vibration — action bar haptics
- Vibrate on button press/release, on zone transitions (fail/pass/crit), on taking damage; vary pattern and length per trigger. Verify whether any iOS vibration permission is possible.
- Priority: P3 — mobile game feel; significant on Android
- Type: Feature
- Effort: M | Gain: M

### [KARMA-OVRHL] Feature: Karma overhaul — full system
- Revive interval scaled by karma; Speak on aggressive enemies = +1 karma; Attack on neutral/friendly = -2 karma; karma decay toward 1 across runs; tiered reincarnation bonus; mischievous encounter variants at karma < 0; perks/flaws unlocked at ±10 karma; good karma bonus encounter (not only on revive); proactive actions to repair bad karma. Expand all hooks; ensure hints make karma legible.
- Priority: P3 — transformative system but XL scope; must not ship incomplete
- Type: Feature
- Effort: XL | Gain: XL

### [INVAD-GRAVE] Feature: Invader Graveyard UI
- "👾 Kill List" section in Main Menu screen — name, area, level per entry, persisted under rivalGraveyard in localStorage.
- Priority: P3 — social trophy moment; not blocking
- Type: Feature
- Effort: S | Gain: M

### [FIGHT-GHOST] Feature: Fight Your Own Ghost
- When leaderboard pool is empty/unavailable, spawn a rival from the player's own last submitted run (ghostLink localStorage) — type "👁 Echo," desc "A reanimated corpse bearing your face."
- Priority: P3 — clean offline fallback for the rivals system
- Type: Feature
- Effort: S | Gain: M

### [RUN-MOD] Feature: Game run modifiers
- Unlockable run modifiers activated via Origins or special conditions (e.g., Demons passive, Animals passive).
- Priority: P3 — build variety depth
- Type: Feature
- Effort: L | Gain: M
- Needs: Define unlock conditions and exact modifier effects before implementing.

### [OFFHAND-SLOT] Question: Offhand/accessory slot — needed or stat creep?
- Decide whether to add a dedicated offhand slot (talisman, yoyo, spellbook, shield...) or a generic accessory slot alongside the head/chest/hands system — purpose is to gatekeep stats and prevent runaway stat accumulation, not just add variety.
- Priority: P3 — this design decision must be made before the inventory expansion (below) is architected; adding the slot after the fact changes the structure
- Type: Question
- Effort: S | Gain: M
- Needs: Answer: does adding a gatekeeping slot solve a real creep problem, or does it add complexity without payoff? Decision informs inventory expansion scope.

### [INV-EXPND] Feature: Expand inventory — consumables + equipment slots
- Add consumables array; head/chest/hands item slots with swap mechanic (prevents fast stacking); intentional food eating only (no auto-consume); open inventory on click of loot/party bar.
- Priority: P3 — major architecture change; high gain but XL scope
- Type: Feature
- Effort: XL | Gain: L

### [STR-AUDIT] Chore: String writer skill + full CSV/JS string audit
- Create a lightweight Claude skill for writing CSV and JS string fields — strict tone matching, length-optimized. Follow with a full audit pass using it.
- Priority: P3 — dev velocity; string inconsistency is real but not beta-blocking
- Type: Chore
- Effort: S | Gain: M

### [ENEMY-STR] Chore: Enemy string quality pass
- Audit all enemy desc and message fields for tone consistency and Rosabel-style voice — remove filler; flag area outliers.
- Priority: P3 — content quality; tonal inconsistency is the Narrative Writer's top flag
- Type: Chore
- Effort: M | Gain: M

### [MISS-MSG] Chore: Missing messages pass
- Identify and fill all enemy rows missing a message field (message = player death description).
- Priority: P3 — content completeness; death descriptions are a visible gap
- Type: Chore
- Effort: S | Gain: M

### [STAT-NUDGE] Feature: Fractional "nudge" stat values for hidden stats — LCK, INT, karma, love
- Allow sub-1 increments on hidden stats in CSV/origins (JS already supports decimals); display as human-readable labels rather than raw numbers — e.g. 0.5 = "Small bonus", 0.25 = "Tiny bonus" (exact tier labels TBD). Enables tighter balance control and a wider range of items/origins without pushing rarity up a full tier unnecessarily.
- Priority: P3 — design space unlock with near-zero code cost; pairs well with the rarity weights audit below
- Type: Feature
- Effort: S | Gain: M
- Details: LCK at ×0.5 in the net formula means +0.5 LCK adds only 0.25 to net score — rarity-invisible by design, which is exactly right for a nudge. The UI label mapping (0.25 → "Tiny", 0.5 → "Small") is the main design decision still open.

### [RARITY-WGHT] Question: Audit and redesign net stat rarity weights
- The formula `atk×3 + mgk×2 + hp×1.5 + sta×1.5 + lck×0.5 + int×0.5 + def×1` was never designed — weights were guessed. LCK at ×0.5 feels especially off given it affects crits, loot quality, and action bar intervals. MGK at ×2 undervalues it relative to ATK once spells exist. Before changing any individual weight, define what +1 of each stat concretely changes in a run and set weights from that benchmark.
- Priority: P3 — weights silently shape the entire loot feel; worth auditing before content volume makes it harder to rebalance
- Type: Question
- Effort: S | Gain: L
- Needs: For each stat: what does +1 change in a typical run? Set weight relative to ATK×3 as the anchor. After adjusting, sample existing CSV entries to confirm the rarity distribution doesn't break.

### [ENC-PREGEN] Feature: Pre-generate encounter sequence so companions can peek ahead
- Currently `generateNextEncounters()` in `encounter-generator.js` may populate encounters lazily — the next entry might not be resolved until the player navigates to it. To let the 🐶 dog (and future companions) react to what's ahead, the next encounter must be resolved before the player arrives.
- First step: audit `generateNextEncounters()` and `getNextEncounterIndex()` in `data-loader.js` to confirm whether a one-step lookahead is already possible. If not, adjust generation to eagerly resolve at least the next entry in the queue on area entry.
- Longer-term door this opens: resolve the entire run sequence on game start — simpler state, no lazy gaps, and enables branching paths (see [PATH-CHOICE]) where two pre-generated routes exist simultaneously.
- Priority: P3 — structural prerequisite for [COMP-PLAY] dog bark, [PET-ENCNTR] boss-warning variant, and [PATH-CHOICE]; confirm lazy vs. eager behavior before estimating full scope
- Type: Feature
- Effort: M | Gain: L
- Needs: Confirm generation timing before writing code.

---

## P4 — Nice to Have

### [SOUL-GEM] Feature: Legendary soulgem — physical damage to spirits
- Unique Legendary item enabling physical damage against spirit-type enemies.
- Priority: P4 — niche mechanic; not enough demand to justify the slot now
- Type: Feature
- Effort: S | Gain: S

### [INV-ITEMS] Idea: New items for new inventory slots
- Review ideas for items to fill new inventory slots once the expand-inventory system (P3) lands; clean out the ideas folder in the process.
- Priority: P4 — depends on P3 inventory expansion; no design yet
- Type: Idea
- Effort: S | Gain: S
- Needs: Define which slots exist and what item archetypes make sense before designing.

### [ORIG-ITEMS] Feature: Origins with starting items
- Origins that begin the run with a Legendary item already equipped.
- Priority: P4 — requires inventory slot system first
  - Feedback: Does not, just look into menu.js _doNewGame! its actually very easy
- Type: Feature
- Effort: S | Gain: M

### [GROOM-ORIG] Idea: Groom origin — unique power/effect
- Add a Groom origin with a mechanical effect that matches the narrative role.
- Priority: P4 — no concrete design yet; fun lore hook
- Type: Idea
- Effort: S | Gain: S
- Needs: Define what the Groom origin's power should be.

### [KARMA-ITEM] Idea: Legendary item — negates bad karma effects
- A Legendary that offsets karma penalties — requires karma overhaul (P3) to exist first.
- Priority: P4 — blocks on the karma system
- Type: Idea
- Effort: S | Gain: S

### [ALTAR-PRAY] Idea: Altar — no stat bonus, Pray = XP
- A simple altar encounter where Pray grants XP with no stat effect.
- Priority: P4 — minor content addition
- Type: Idea
- Effort: XS | Gain: S

### [UNDEAD-RISE] Idea: Undead transformation — player killed by undead rises at 1HP
- Being killed by an undead enemy causes the player to rise as undead: 1 HP, half STA, skip death state; append 🧟 before player name; undead enemies deal 0 base ATK against the transformed player.
- Priority: P4 — interesting mechanic but significant state complexity
- Type: Idea
- Effort: M | Gain: M

### [PROP-SPAWN] Idea: Hit prop once to spawn a small encounter
- Allow a single hit on a Prop to attempt spawning a small encounter — push a copy of the prop forward if unused.
- Priority: P4 — variant of the Camp type; interesting but low clarity
- Type: Idea
- Effort: S | Gain: S

### [PORTAL-VLG] Idea: Portal to village — skip early game (verify if done)
- Story-progress-unlockable portal skipping early areas. Marked as possibly already done with the gate.
- Priority: P4 — verify before resurrecting
- Type: Idea
- Effort: S | Gain: S
- Needs: Confirm whether the current gate encounter already implements this.

### [SFX-MUSIC] Feature: Sounds — SFX and background music
- Investigate platform support (iOS, Android, Mac, Windows) and add sound effects and ambient music.
- Priority: P4 — audio is transformative but large scope with platform risk
- Type: Feature
- Effort: L | Gain: L

### [CLEAN-IDEAS] Chore: ME — Clean ideas folder
- Review and archive or delete the ideas folder contents.
- Priority: P4 — housekeeping
- Type: Chore
- Effort: S | Gain: XS

### [RIVER-ATM] Feature: River of Sorrows — atmosphere encounters + dock handoff
- 1–2 static Memory-type story encounters (Drifting Lanterns, Wrecked Hull, Shore Inscription). Post-boss dock encounter as Necropolis area handoff using fullscreen fade. Memory type needs non-trivial work outside Fairyland context.
- Priority: P4 — atmosphere; not beta-facing
- Type: Feature
- Effort: M | Gain: M

### [FISH-LOOT] Feature: Bloat fishing loot — items, threats, floating altars
- Add variety to fishing encounter pool: items, threats, traps, floating altars.
- Priority: P4 — fishing is functional; this is content depth
- Type: Feature
- Effort: S | Gain: S

### [SPIRIT-ENEMY] Feature: Add spirit/reflective enemies to Village and River
- Spirit and reflective types underrepresented in early/mid areas.
- Priority: P4 — content variety
- Type: Feature
- Effort: S | Gain: S

### [LATE-PETS] Feature: New late-game pets
- Drowned spirit, scared ghost, living mushroom, talking fly — flavor + occasional LCK, rarely +1 ATK.
- Priority: P4 — content; fun but not blocking
- Type: Feature
- Effort: S | Gain: S

### [TRAP-VAR] Feature: More positive and negative traps + curses (all variants)
- Stat-swap traps, -ATK curses in late game, containers costing STA/LCK, lategame curses stealing mana/STA, practice target variants for Speak/Cast (with option to leave), magic items that almost always carry a curse.
- Priority: P4 — content variety; not blocking
- Type: Feature
- Effort: M | Gain: S

### [MEADOW-ENCNTR] Feature: Meadows — increment no-effect encounters
- Add no-effect altars, observations, clear sky, silent overcast encounters.
- Priority: P4 — atmosphere; not blocking
- Type: Feature
- Effort: S | Gain: S

### [FOOD-PERMA] Feature: Lemon-unique foods — perma boosts per area
- 1 good + 1 bad perma-boost food per area; mixed stat foods (lose and gain simultaneously); ensure bad foods in all areas.
- Priority: P4 — content depth
- Type: Feature
- Effort: S | Gain: S

---

## Backlog

### [RUN-IMPACT] Feature: Full run impact summary (Hades Gate)
- End-of-run or game-over screen shows a narrative summary of what the player's choices and companions contributed — e.g. "Your dog warned you twice. Your karma cost you the ending you deserved." Goes well beyond [KILL-LINE]'s single sentence.
- Requires tracking choice impact throughout the run (karma deltas, companion saves, key moments). Design via Hades Gate when the simpler beta tier ([KILL-LINE]) is proven and player data gives signal on what moments are most memorable.
- Priority: P4 — [KILL-LINE] covers the beta tier; this is the full vision for a post-beta update.
- Type: Feature
- Effort: XL | Gain: XL
- Needs: Full design via Hades Gate. Prerequisite: [KILL-LINE] shipped and validated.

### [PATH-CHOICE] Feature: Branching encounter paths — Inscryption-style crossroads with companion hints
- At one or more crossroads moments in a run, present two pre-generated paths forward — a genuine lock-in choice. Design space: dangerous + high reward vs. safe + low reward.
- Companion type determines what intel is surfaced before the choice: 🐶 dog barks at the dangerous branch, 🐱 cat paws toward the high-loot one; a lone player gets no hint and must choose blind.
- The dog's warning (from [PET-ENCNTR] or [COMP-PLAY]) is what makes the crossroads matter — it transforms a choice into a test of trust in your companion.
- Addresses the gap of meaningful non-combat prep: a prep encounter (gear swap, skill check, rest) could appear before the locked path to reward the right read.
- Requires [ENC-PREGEN]: both paths must be pre-resolved before the choice screen appears.
- Priority: Backlog — high concept value; wait until [ENC-PREGEN] stable, [COMP-PLAY] shipped, [PET-ENCNTR] proven
- Type: Feature
- Effort: L | Gain: XL
- Needs: Full design via Hades Gate. Prerequisites: [ENC-PREGEN] stable, [COMP-PLAY] shipped, [PET-ENCNTR] shipped.

### [SPELL-SYS] Feature: Spells system
- Spell button replaces Curse; spell list overlay on click (scrollable, max height = action buttons); spells learned from Spell Scrolls via a Learn action (INT-based success). Basic spells: 🐸 Hex, 🔥 Burn, 🧊 Freeze, ⚡️ Surge, 🪬 Curse (−ATK), 🪨 Harden, 🩸 Syphon.
- change curse button to generic "📓 Spell"
- player knows no spells until learning some, log on action: "Cannot cast any spells ...yet?"
- on click if enough mana (3) the spell cast begins (action bar)
  - on critical success = costs -1 mkg
  - on critical fail = apply spell to self (or special case: Harden = Deplete all stamina, Syphon = Just hurt yourself)
- 📜 Spell Scroll: <emoji> <spell-name>
- spell scrolls might be found similar to other items (create a a sample item in story.csv right after debug comment)
- Scroll rolls what spell it is on encountering, roll from unknown spells only
- "🧠 Learn" action (instead of speak) when seeing a spell scroll, sucess chance based on int, on fail - could not comprehend (no second chance)
- Basic spells below:
- 🐸 Hex - Change enemy to harmless 1/1 frog
- 🔥 Burn - Deal 4 damage
- 🧊 Freeze - Deplete enemy stamina
- ⚡️ Surge - Restore own stamina full
- 🪬 Curse - Lower enemy attack by 3
- 🪨 Harden - 2 physical damage protect for player for rest of the fight
- 🩸 Syphon - Damage enemy for 2, damage enemy for 2
- Priority: P4 — major new system; high concept value but XL scope
- Type: Feature
- Effort: XL | Gain: L

### [NECRO-OPT] Feature: Necropolis optional areas
- Optional sub-areas for late-game variety inside Shrouded Necropolis.
- Priority: P4 — content; post-beta
- Type: Feature
- Effort: L | Gain: M
- Needs: Define what optional areas look like and how they gate before designing.

### [SVG-EMOJI] Feature: SVG support in emoji column
- Support thing.svg references in the emoji column (assets/encounters/); render same size/position as emoji.
- Priority: P4 — infra change for a niche use case
- My note: would actually give ability to have endless content as we are running out of emojis
- Type: Feature
- Effort: M | Gain: S

### [DEF-STAT] Bug: Player DEF stat — wrong display, item support gaps, incorrect rarity
- Consolidate damage log message to be a sigle message (not two as now - one for dmg, second for def) when player DEF is non-zero and had effect example "Hit by their attack -1💔 (1🔰); not all item types account for DEF; an item with DEF as its sole non-zero stat should resolve as Legendary (Artifact).
- Priority: P1 — a live, UI-visible stat behaving incorrectly
- My note: ->P4: Can wait, theres intentionally only two items with Def stat, after beta we may revisit
- Type: Bug | Severity: Major
- Effort: S | Gain: L

### [QUEST-SPAWN] Bug: Quest system — brittle friend + quest item spawn logic
- Refactor to spawn friend and quest item independently in the story (not linked); hide exact item list from display (show general description only); keep matching logic internal.
- Priority: P2 — brittle spawn logic is a live reliability risk at a key progression moment
- My Note: P4 -> Good enough for Beta, ive seen it working well
- Type: Bug | Severity: Major
- Effort: M | Gain: M

### [HIDST-LOG] Improvement: Occasional hidden-stat log messages mid-run
- Poetic one-liner log entries tied to karma/love thresholds during a run — e.g. "Your choices leave a mark." Gives players a signal that unseen stats are accumulating.
- Priority: P2 — directly addresses hidden stat opacity; small effort, meaningful player signal
- My note: P4 -> Id rather do the mirror encounters, that holds bigger value.
- Type: Improvement
- Effort: S | Gain: L

### [VIS-IMPACT] Improvement: Full visual impact frames — hit flash, damage flash, STA fade
- Flash white when player hits; red-white flash when player takes damage; green fade when losing STA — especially prominent at 1 HP or 0 STA. Full-screen shakes for critical moments.
- Priority: P3 — broader than .flash-crit; higher effort but higher feel impact
- My Note: -> P4 Such visual changes always take a long time to be good, parking lot this after beta, we have some visual feedback already.
- Type: Improvement
- Effort: M | Gain: L

### [TIPS-SYS] Idea: Game tips system (parked)
- Tips that trigger on player state (first death, first Artifact, low STA) using existing toast system — easy/story difficulty only. Parked — tutorial revamp (P2) supersedes this.
- Priority: P4 — superseded by tutorial revamp; keep as reference if tip-layer is needed later
- Type: Idea
- Effort: S | Gain: XS

### [VEC-BG] Feature: Vector backgrounds for all areas
- Complete and default to vector backgrounds for all areas.
- Priority: P4 — significant atmosphere upgrade; L effort, not mobile-critical
- Type: Feature
- Effort: L | Gain: M

### [BLACK-HOLE] Feature: Black hole — new optional area + spaghetti monster boss
- DLC-style optional area with spaghetti monster boss, modern props, items, tools. The JS spaghetti monster joke boss lives here.
- Priority: P4 — fun/joke expansion; well outside current scope
- Type: Feature
- Effort: XL | Gain: S

---

### [PET-SLOT] Idea: Long-term pet system — structured pet object with bark pools (Hades Gate)
- Replace emoji-string pet tracking with a structured pet object: `{name, type, stats, personality}` — enabling named pets (Kerberos etc.), personality-driven bark pools, and per-pet stat contributions.
- Each type (cat, dog, lizard, bird) + personality pairing gets its own bark pool — contextual reactions to enemy types, areas, traps, boss proximity.
- Deep contextual tier: pet "sees" the run's story structure and generators; warns intelligently about danger types ahead (not just boss-is-next).
- Design via Hades Gate when [PET-ENCNTR] is shipped and basic pet interaction is proven in the wild.
- Priority: Backlog — architectural shift; [PET-ENCNTR] is the beta-tier delivery of this vision.
- Type: Idea
- Effort: XL | Gain: XL
- Needs: Full design via Hades Gate. Prerequisites: [PET-ENCNTR] shipped, [COMP-PLAY] stable.

### [LOOT-ANIM] Feature: Full loot reveal animation — roll → snap (Hades Gate)
- Full loot reveal flow: an animated "rolling" state (cycling emoji shimmer, blurred or randomized placeholder) builds anticipation before everything lands with a visual snap — rarity-colored flash or pulse keyed to the tier revealed (Common = subtle, Legendary = full flash).
- All three card elements are obscured during the roll: emoji, name, and desc. All three snap into place simultaneously.
- Triggers: all loot sources — enemy kill drop, shop purchase, fishing, pre-generated loot navigation.
- Rarity tie-in: snap animation intensity maps to tier; requires integration with `encounter-loader.js`, `ui-render.js`, CSS `@keyframes`, and the rarity system for snap color.
- Design and implementation via Hades Gate as a standalone post-beta update; [LOOT-TEAS] is the beta-tier delivery.
- Priority: Backlog — [LOOT-TEAS] covers the beta tier; this is the full gacha-feel vision.
- Type: Feature
- Effort: L | Gain: XL
- Needs: Full design via Hades Gate. Prerequisite: [LOOT-TEAS] shipped and validated.

---

### Technical Debt

#### [HASH-ERR] Bug: Score hash "err" on some mobile submissions
- One or more scores submitted with hash = "err" (caught exception in `_generateHash` in score-manager.js); Python verifier rejects these. Possibly `crypto.subtle` unavailable in certain Android browsers or in-app WebViews. Investigate by collecting more submissions during playtesting and checking whether "err" correlates with a specific device/browser. Fix path: explicit `crypto.subtle` availability check + console.error logging of the caught exception.
- Type: Bug | Severity: Minor | Effort: S | Gain: M

#### [ACHIEV-TIME] Bug: Achievement timing — fix post-action logging delay hack
- Fix the timing hack for logging achievements after actions in achievements.js.
- Type: Bug | Severity: Minor | Effort: S | Gain: S

#### [ENDEF-CALC] Bug: Enemy defense — enemyDef not applied in all skill calcs
- Ensure enemyDef is used in all player skill calculations including consumables. (player-skills.js)
- Type: Bug | Severity: Minor | Effort: S | Gain: M

#### [CURSE-SCALE] Chore: Curse scaling — curse stats should affect action bar width
- Negative curse stat values should shrink the success zone — currently all curses are equally hard regardless of intensity. (action-config.js)
- Type: Chore | Effort: S | Gain: M

#### [KARMA-SCALE] Improvement: Karma scaling — tiered reincarnation bonus
- Any positive karma currently gives the same revive reward — should scale by tier. (player-skills.js)
- Type: Improvement | Effort: S | Gain: M

#### [GEN-STATE] Chore: Generator state — clean up nextEncounter Generator-type logic
- Clean up hacky logic in nextEncounter for Generator types; ensure area transitions and seen tracking are robust. (game-loop.js)
- Type: Chore | Effort: S | Gain: S

#### [BOSS-TRACK] Chore: Boss type tracking — replace enemyBossType global hack
- Replace the enemyBossType global with cleaner state management. (encounter-loader.js)
- Type: Chore | Effort: M | Gain: S

#### [ACT-UPGRD] Chore: Action type cleanup — refactor or remove Upgrade type
- Refactor or remove the Upgrade action type if redundant. (action-resolver.js, ui-render.js)
- Type: Chore | Effort: S | Gain: S

#### [MAGIC-FNSH] Improvement: Magic finisher — refactor mercy logic for 1HP enemies
- Refactor the magic "mercy kill" logic for finishing enemies at 1 HP. (action-resolver.js)
- Type: Improvement | Effort: S | Gain: S

#### [COIN-LOG] Improvement: Coin log formatting — replace string-split hack
- Replace brittle string-splitting for coin costs in logging.js with a structured data approach.
- Type: Improvement | Effort: S | Gain: S

#### [REST-PAIN] Improvement: Rest button "Pain" label — replace with real state
- Invent a Perk or state to replace the placeholder "Pain" label on the rest button. (ui-buttons.js)
- Type: Improvement | Effort: XS | Gain: S

#### [EMOJI-ASGN] Improvement: Emoji assignments — finalize unassigned types
- Finalize emoji for unassigned encounter types (🐅 > ⚔️ etc.) in enemy-skills.js and action-resolver.js.
- Type: Improvement | Effort: XS | Gain: S

#### [TEAM-RENDER] Chore: Team rendering — refactor hacky sort/render logic
- Refactor the team sorting/rendering in ui-render.js ("Hacky hacky hacky").
- Type: Chore | Effort: S | Gain: S

---

*Styx Flow complete — 113 items processed*
