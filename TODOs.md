# Styx Flow — 2026-05-14 — Stay Dead

## P1 — Serious Issues & Big Wins

### [DMG-STA] Bug: Enemy damage not charging STA in all action types
- Failed action bars that should cost STA don't apply consistently — confirmed missing on stingy-type block fail; audit all damage-dealing encounter and enemy type handlers.
- Priority: P1 — broken combat economy undermines the core stamina tension
- Type: Bug | Severity: Major
- Effort: S | Gain: 4

### [KICK-FAIL] Bug: Kick fail toward heavy sub-boss resolves as pass
- A failed kick action bar check against a heavy sub-boss incorrectly passes — outcome dispatch likely using the wrong tier condition.
- Priority: P1 — boss-tier combat bypass
- Type: Bug | Severity: Major
- Effort: S | Gain: 3

### [DEF-STAT] Bug: Player DEF stat — wrong display, item support gaps, incorrect rarity
- Consolidate damage log message to be a sigle message (not two as now - one for dmg, second for def) when player DEF is non-zero and had effect example "Hit by their attack -1💔 (1🔰); not all item types account for DEF; an item with DEF as its sole non-zero stat should resolve as Legendary (Artifact).
- Priority: P1 — a live, UI-visible stat behaving incorrectly
- Type: Bug | Severity: Major
- Effort: S | Gain: 4

### [PLAY-GATE] Chore: ME — Personal playtesting gate before beta
- Finish the game at least 3x; upload data to leaderboard and confirm score appears within 35 min; test fishing boss summon via Curse in the same session (repeat) and across sessions; verify Rankings and Chronicles UI flow end-to-end.
- Priority: P1 — hard gate; nothing ships to friends before this is done
- Type: Chore
- Effort: M | Gain: 5

---

## P2 — Release-Gating

### [INVAD-REBRAND] Feature: 👾 Invader rebrand — full UI overhaul
- Rename "Rival" to "Invader" (👾) everywhere in UI; purple-reddish color palette (lighter for text, darker for card background); pixelated glitch-style animated pattern on the Invader card.
- Priority: P2 — social identity feature must land before beta friends encounter rivals
- Type: Feature
- Effort: M | Gain: 4
- Details: Extended Invader sub-features (double XP, "Slayed by Invader" end state, achievements, 100% loot drop) are separate P3 items.

### [MIRR-ENCNTR] Feature: 🪞 Mirror encounter type — hidden stat reveal
- New encounter type displaying one hidden stat's current value (mirror-luck, mirror-int, mirror-karma) + a contextual hint string about what the stat does (e.g., "3🍀 — Luck tips the scales"). Mirror can be broken for a negative effect, or spoken to at INT mirror for a +1 INT boost. Start by mimicking prop activity handling; expand per mirror variant.
- Priority: P2 — directly addresses the single most-flagged design gap: players have no signal on hidden stats mid-run
- Type: Feature
- Effort: M | Gain: 5

### [TUTOR-REVAMP] Feature: Tutorial revamp
- Current tutorial is hardcoded in story.csv — needs feature-level improvement: explain the action bar mechanic on first encounter, hint that moral choices accumulate, clarify drachma persistence across runs.
- Priority: P2 — onboarding is the #1 beta risk; wrong mental models form in the first 3 minutes
- Type: Feature
- Effort: M | Gain: 5

### [PET-TAME] Feature: Pet taming via Speak — INT check + calmed/exhausted condition
- Pets become tameable by Speak if player INT ≥ pet INT and the pet is calmed (no ATK) or exhausted (no STA). Conditioning mechanic: successful Speak brings the pet closer and costs the pet -1 STA. Consolidates both pet taming notes.
- Priority: P2 — expands a beloved mechanic with a clear tactical condition
- Type: Feature
- Effort: S | Gain: 4

### [SHARE-REVAMP] Feature: Share function revamp — clipboard, QR, textfield
- Unified share in death state, credits, and chronicles run detail: copy link to clipboard, pixel-style QR popup, textfield showing the link for manual copy/paste.
- Priority: P2 — social sharing is a core beta activation hook
- Type: Feature
- Effort: M | Gain: 4

### [ACHIEV-UNLCK] Feature: Complete missing achievement unlocks + unique origin powers
- Wire all remaining achievement unlock triggers; for unlockable origins, add or replace flat stat grants with unique starting powers (e.g., starting Legendary item, passive ability — check head of origins.csv for candidates).
- Priority: P2 — achievement system is a retention hook; broken unlocks and flat origins undermine it
- Type: Feature
- Effort: L | Gain: 4

### [RANK-UI] Improvement: ME — Rankings and Chronicles UI tweak
- Refine Rankings list + detail and Chronicles list + detail — layout, readability, endgame polish.
- Priority: P2 — endgame screens are the social product; unfinished here reads as abandoned
- Type: Improvement
- Effort: M | Gain: 4

### [HIDST-LOG] Improvement: Occasional hidden-stat log messages mid-run
- Poetic one-liner log entries tied to karma/love thresholds during a run — e.g. "Your choices leave a mark." Gives players a signal that unseen stats are accumulating.
- Priority: P2 — directly addresses hidden stat opacity; small effort, meaningful player signal
- Type: Improvement
- Effort: S | Gain: 4

### [ENLCK-FUNC] Improvement: Make enemy LCK stat functional
- Enemy LCK currently does nothing visible — wire it to counter player LCK on crit chance and/or action bar intervals; optionally affect fishing spot chances.
- Priority: P2 — dead stat on a UI-visible field erodes trust in every other hidden system
- Type: Improvement
- Effort: M | Gain: 4

### [TEASE-UI] Improvement: Run end tease fade UI — names, spacing, rarity colors
- More horizontal space between origin emojis in the run-end tease; add origin name below each emoji; make name text color reflect the origin's rarity tier.
- Priority: P2 — last thing players see before score submission; polish matters here
- Type: Improvement
- Effort: S | Gain: 4

### [KNOCK-STA] Improvement: Knockout difficulty — STA-dependent
- Knocking out an enemy should be nearly impossible while they have remaining STA; once STA hits 0, knockout difficulty drops to current behavior — action bar interval should reflect this split.
- Priority: P2 — tactical depth + combat feel
- Type: Improvement
- Effort: M | Gain: 4

### [ORIG-RARITY] Improvement: Origins rarity — achiev-required + no stats → Legendary + Familiar
- Origins that require an achievement unlock and have no stat bonus should automatically resolve to Legendary (Familiar tier) — currently not enforced.
- Priority: P2 — rarity display is visibly incorrect for achievement-gated origins
- Type: Improvement
- Effort: XS | Gain: 3

### [TRAP-SLEEP] Bug: Sleep at trap should follow prop sleep rules
- Sleeping at a trap encounter (unless it's a Trap-Sleep type) should follow the same action bar interval as prop sleep — currently behaves differently.
- Priority: P2 — inconsistent rules break player intuition
- Type: Bug | Severity: Minor
- Effort: S | Gain: 3

### [DEAD-TOUCH] Bug: Touch on dead (empty) enemy should be 100% pass
- Interacting with an already-defeated enemy should always succeed — action bar interval not set to guaranteed pass for the empty corpse state.
- Priority: P2 — failing at a dead enemy is confusing and unfair
- Type: Bug | Severity: Minor
- Effort: XS | Gain: 3

### [GRAB-LOCK] Bug: Grab on locked container — all red, add lock message
- Grabbing a locked container without a key should show an all-red action bar and log "Cannot get inside, it's locked." — currently no feedback.
- Priority: P2 — missing feedback on a common interaction
- Type: Bug | Severity: Minor
- Effort: XS | Gain: 3

### [MEMENTO-DROP] Bug: Lovers Memento dropped from wrong boss/area
- Lovers Memento appeared from a boss in Fading Wildlands — story-locked items should only drop from their designated source; boss drops in this area should be artifacts or standard items only.
- Priority: P2 — wrong loot breaks narrative coherence at a key story moment
- Type: Bug | Severity: Minor
- Effort: XS | Gain: 2

### [FADE-TEXT] Bug: Fade text on invitation/letter — verify it fires
- The fade-with-text trigger on finding an invitation or letter is unverified — check that it fires correctly.
- Priority: P2 — potentially broken story beat presentation
- Type: Bug | Severity: Minor
- Effort: XS | Gain: 3

### [QUEST-SPAWN] Bug: Quest system — brittle friend + quest item spawn logic
- Refactor to spawn friend and quest item independently in the story (not linked); hide exact item list from display (show general description only); keep matching logic internal.
- Priority: P2 — brittle spawn logic is a live reliability risk at a key progression moment
- Type: Bug | Severity: Major
- Effort: M | Gain: 3

---

## P3 — Should-Fix

### [FLASH-CRIT] Improvement: .flash-crit CSS animation on critical hits
- Brief card flash on critical hit — hook into existing ui-effects.js animation infrastructure.
- Priority: P3 — polish; XS effort with existing toolkit
- Type: Improvement
- Effort: XS | Gain: 3

### [CRIT-SHAKE] Improvement: Crit attack shakes enemy card; crit walk bounces player card
- On crit-pass Attack: shake enemy card only (not full screen). On crit-pass Walk: slight bounce on player card only.
- Priority: P3 — targeted micro-feedback, lower scope than screen-shake
- Type: Improvement
- Effort: S | Gain: 3

### [VIS-IMPACT] Improvement: Full visual impact frames — hit flash, damage flash, STA fade
- Flash white when player hits; red-white flash when player takes damage; green fade when losing STA — especially prominent at 1 HP or 0 STA. Full-screen shakes for critical moments.
- Priority: P3 — broader than .flash-crit; higher effort but higher feel impact
- Type: Improvement
- Effort: M | Gain: 4

### [STORY-FADE] Improvement: Story fades — longer and smoother
- Increase duration and smooth easing on game-start, memento, memory, and final boss fade transitions.
- Priority: P3 — polish; transitions are functional but thin
- Type: Improvement
- Effort: S | Gain: 3

### [CRIT-SLEEP] Improvement: Crit sleep outside combat → extra STA
- A critical success on a sleep action outside combat (e.g., falling leaves) should grant bonus STA beyond the standard recovery.
- Priority: P3 — small mechanical delight; extends crit reward to a new context
- Type: Improvement
- Effort: S | Gain: 3

### [STAT-DISP] Improvement: Stat display — show numeric when over 5
- If a stat value exceeds 5, display it as a number (e.g., ❤️ 4/6) instead of the icon-count style — UI space is limited.
- Priority: P3 — clarity for high-stat builds; not common enough to block beta
- Type: Improvement
- Effort: S | Gain: 3

### [NAME-QUAL] Improvement: Generator name rolls quality pass
- Revise name generation to avoid "unliving" words on living enemies; consider adding actual proper names in Rosabel-style tone — believable styling takes priority over stat matching.
- Priority: P3 — tonal immersion; name mismatch breaks the register
- Type: Improvement
- Effort: S | Gain: 3

### [CURSE-REFAC] Improvement: Curse refactor — better branching per stat type
- Curses should have branching button options matched to the stat they affect — e.g., "Howling Wind" endure should not share the action button with INT-based curses.
- Priority: P3 — mechanical consistency; curses currently all feel the same
- Type: Improvement
- Effort: M | Gain: 3

### [SEQ-DELAY] Improvement: Sequential action display — delay 0.5s per log entry
- Add a 0.5s delay between log entries in multi-step action sequences; wait for effects to complete before re-enabling player input.
- Priority: P3 — readability and feel; not blocking
- Type: Improvement
- Effort: S | Gain: 3

### [COLOR-BLIND] Improvement: Colorblind-safe crit/success zones
- Ensure crit and success zones on the action bar are distinguishable without color — brightness difference or pattern.
- Priority: P3 — accessibility; not gating beta
- Type: Improvement
- Effort: S | Gain: 3

### [MIN-CLICK] Improvement: Minimize 1-click encounters
- Reduce encounters that resolve in a single click with no decision — use encounterUsed to create at least one action opportunity before resolution.
- Priority: P3 — player agency; 1-click encounters feel like dead zones
- Type: Improvement
- Effort: M | Gain: 3

### [BAR-RDZONE] Feature: Action bar red zones — random placement for prop encounters
- For prop-type encounters (e.g., walking away from something), randomly place red danger intervals within the green zone instead of always at the edges — simulates "avoid the sharp stone."
- Priority: P3 — mechanical depth and surprise; not beta-blocking
- Type: Feature
- Effort: M | Gain: 4

### [AMB-FX] Feature: Area ambient UI effects — falling leaves, rain, fog per area
- Pixel-styled, black-outlined ambient effects per area (falling leaves, blue/purple leaves, rain, fog). Expose per-area config: effect type, density, frequency, speed.
- Priority: P3 — atmosphere; L effort and not blocking beta
- Type: Feature
- Effort: L | Gain: 4

### [ORIG-UNIQ] Feature: More unique origins with gameplay implications
- Add origins with real mechanical effects beyond stat distribution — passives, starting conditions, unique interactions.
- Priority: P3 — origin depth; builds on the achiev-origin work in P2
- Type: Feature
- Effort: M | Gain: 3

### [ITEM-RARITY] Feature: Item/Origin — increases higher rarity drop chance
- New item or origin that shifts loot probability toward Uncommon/Rare/Legendary.
- Priority: P3 — build variety; rarity system is already wired for this
- Type: Feature
- Effort: S | Gain: 3

### [ITEM-CRIT] Feature: Item/Origin — bigger crit chance interval
- New item or origin that widens the crit success zone on the action bar.
- Priority: P3 — build variety
- Type: Feature
- Effort: S | Gain: 3

### [HOUR-SLOW] Feature: ⏳ Strange Hourglass — 10% slower action bar
- New item: globally slows action bar speed by 10%.
- Priority: P3 — accessible build option; interesting tension with high-speed encounters
- Type: Feature
- Effort: XS | Gain: 2

### [CAMP-TYPE] Feature: New encounter type — Camp (spawn enemy on rest)
- Camp encounters spawn an enemy when the player rests (log the spawn). Camp-Grab variant triggers on grab (e.g., investigating a tent or box).
- Priority: P3 — adds tension and encounter depth
- Type: Feature
- Effort: M | Gain: 3

### [MAGIC-CONT] Feature: New encounter type — Magic Container (cast to unlock)
- Container that requires Cast to open — contains an item (50% artifact chance, same as standard locked containers).
- Priority: P3 — extends existing container design with a mana decision
- Type: Feature
- Effort: S | Gain: 3

### [PINATA-TRAP] Feature: Piñata positive trap — correct button handling
- Grab and Block on a piñata trap should be all red; remaining buttons should be easy as prop; Avoid should follow walk rules.
- Priority: P3 — existing encounter type behaving inconsistently
- Type: Feature
- Effort: S | Gain: 3

### [NEG-FRIEND] Feature: Negative friends — stat decrement encounters
- "Negative friend" encounter variants that decrement stats (inverse of a standard friend boost) — add to late-game areas.
- Priority: P3 — adds tension to a currently safe encounter type
- Type: Feature
- Effort: S | Gain: 3

### [PET-ADOPT] Feature: Adopt pet for item — give item to tame
- Allow giving a specific item to adopt a pet (e.g., offer a mouse/lizard to a cat) — similar to friend quest item mechanic but for pet recruitment.
- Priority: P3 — adds a resource decision to pet taming
- Type: Feature
- Effort: S | Gain: 3

### [COMP-PLAY] Feature: Companion gameplay implications
- Companions in the party should have passive gameplay effects beyond score contribution.
- Priority: P3 — currently companions are score-only; mechanical weight would make recruiting feel meaningful
- Type: Feature
- Effort: M | Gain: 3
- Needs: Define what passive effects companions should grant before implementing.

### [HAPTIC-BAR] Feature: Android vibration — action bar haptics
- Vibrate on button press/release, on zone transitions (fail/pass/crit), on taking damage; vary pattern and length per trigger. Verify whether any iOS vibration permission is possible.
- Priority: P3 — mobile game feel; significant on Android
- Type: Feature
- Effort: M | Gain: 3

### [KARMA-OVRHL] Feature: Karma overhaul — full system
- Revive interval scaled by karma; Speak on aggressive enemies = +1 karma; Attack on neutral/friendly = -2 karma; karma decay toward 1 across runs; tiered reincarnation bonus; mischievous encounter variants at karma < 0; perks/flaws unlocked at ±10 karma; good karma bonus encounter (not only on revive); proactive actions to repair bad karma. Expand all hooks; ensure hints make karma legible.
- Priority: P3 — transformative system but XL scope; must not ship incomplete
- Type: Feature
- Effort: XL | Gain: 5

### [INVAD-EXT] Feature: Invader extended features (post-rebrand)
- After the P2 rebrand lands: double XP for Invader kill; special "💔 Slayed by Invader" end state with log and extra fade; achievement for first Invader spotted, first kill, and 10 kills; 100% item drop from Invader's loot pool. Invaders should spawn in gen hard slots specifically.
- Priority: P3 — depth on top of the P2 base; each sub-feature is independent
- Type: Feature
- Effort: M | Gain: 4

### [RIVAL-GRAVE] Feature: Rival Graveyard UI
- "💔 Rivals Slain" section in Memories/achievements screen — name, area, level per entry, persisted under rivalGraveyard in localStorage.
- Priority: P3 — social trophy moment; not blocking
- Type: Feature
- Effort: S | Gain: 3

### [FIGHT-GHOST] Feature: Fight Your Own Ghost
- When leaderboard pool is empty/unavailable, spawn a rival from the player's own last submitted run (ghostLink localStorage) — type "👁 Echo," desc "A reanimated corpse bearing your face."
- Priority: P3 — clean offline fallback for the rivals system
- Type: Feature
- Effort: S | Gain: 3

### [RUN-MOD] Feature: Game run modifiers
- Unlockable run modifiers activated via Origins or special conditions (e.g., Demons passive, Animals passive).
- Priority: P3 — build variety depth
- Type: Feature
- Effort: L | Gain: 3
- Needs: Define unlock conditions and exact modifier effects before implementing.

### [OFFHAND-SLOT] Question: Offhand/accessory slot — needed or stat creep?
- Decide whether to add a dedicated offhand slot (talisman, yoyo, spellbook, shield...) or a generic accessory slot alongside the head/chest/hands system — purpose is to gatekeep stats and prevent runaway stat accumulation, not just add variety.
- Priority: P3 — this design decision must be made before the inventory expansion (below) is architected; adding the slot after the fact changes the structure
- Type: Question
- Effort: S | Gain: 3
- Needs: Answer: does adding a gatekeeping slot solve a real creep problem, or does it add complexity without payoff? Decision informs inventory expansion scope.

### [INV-EXPND] Feature: Expand inventory — consumables + equipment slots
- Add consumables array; head/chest/hands item slots with swap mechanic (prevents fast stacking); intentional food eating only (no auto-consume); open inventory on click of loot/party bar.
- Priority: P3 — major architecture change; high gain but XL scope
- Type: Feature
- Effort: XL | Gain: 4

### [STR-AUDIT] Chore: String writer skill + full CSV/JS string audit
- Create a lightweight Claude skill for writing CSV and JS string fields — strict tone matching, length-optimized. Follow with a full audit pass using it.
- Priority: P3 — dev velocity; string inconsistency is real but not beta-blocking
- Type: Chore
- Effort: S | Gain: 3

### [ENEMY-STR] Chore: Enemy string quality pass
- Audit all enemy desc and message fields for tone consistency and Rosabel-style voice — remove filler; flag area outliers.
- Priority: P3 — content quality; tonal inconsistency is the Narrative Writer's top flag
- Type: Chore
- Effort: M | Gain: 3

### [MISS-MSG] Chore: Missing messages pass
- Identify and fill all enemy rows missing a message field (message = player death description).
- Priority: P3 — content completeness; death descriptions are a visible gap
- Type: Chore
- Effort: S | Gain: 3

### [PW-RECORD] Chore: Playwright — Data Capture flight recorder
- Passive Playwright session: hook runLogAdd, MutationObserver on #id_card and #id_log, HTML snapshot + screenshot on state changes, YAML/JSON semantic dump, bash SIGINT post-mortem prompt, artifacts to /playtests/YYYY-MM-DD_HH-MM/.
- Priority: P3 — dev tooling; improves AI-assisted debugging but not blocking
- Type: Chore
- Effort: L | Gain: 3

### [STAT-NUDGE] Feature: Fractional "nudge" stat values for hidden stats — LCK, INT, karma, love
- Allow sub-1 increments on hidden stats in CSV/origins (JS already supports decimals); display as human-readable labels rather than raw numbers — e.g. 0.5 = "Small bonus", 0.25 = "Tiny bonus" (exact tier labels TBD). Enables tighter balance control and a wider range of items/origins without pushing rarity up a full tier unnecessarily.
- Priority: P3 — design space unlock with near-zero code cost; pairs well with the rarity weights audit below
- Type: Feature
- Effort: S | Gain: 3
- Details: LCK at ×0.5 in the net formula means +0.5 LCK adds only 0.25 to net score — rarity-invisible by design, which is exactly right for a nudge. The UI label mapping (0.25 → "Tiny", 0.5 → "Small") is the main design decision still open.

### [RARITY-WGHT] Question: Audit and redesign net stat rarity weights
- The formula `atk×3 + mgk×2 + hp×1.5 + sta×1.5 + lck×0.5 + int×0.5 + def×1` was never designed — weights were guessed. LCK at ×0.5 feels especially off given it affects crits, loot quality, and action bar intervals. MGK at ×2 undervalues it relative to ATK once spells exist. Before changing any individual weight, define what +1 of each stat concretely changes in a run and set weights from that benchmark.
- Priority: P3 — weights silently shape the entire loot feel; worth auditing before content volume makes it harder to rebalance
- Type: Question
- Effort: S | Gain: 4
- Needs: For each stat: what does +1 change in a typical run? Set weight relative to ATK×3 as the anchor. After adjusting, sample existing CSV entries to confirm the rarity distribution doesn't break.

### Technical Debt

#### [SHARE-CLIP] Bug: Sharing — buttons not hidden during capture, log clips
- Fix screenshot capture in menu.js: hide buttons during capture, ensure full log is visible without clipping.
- Type: Bug | Severity: Minor | Effort: S | Gain: 3

#### [ACHIEV-TIME] Bug: Achievement timing — fix post-action logging delay hack
- Fix the timing hack for logging achievements after actions in achievements.js.
- Type: Bug | Severity: Minor | Effort: S | Gain: 2

#### [ENDEF-CALC] Bug: Enemy defense — enemyDef not applied in all skill calcs
- Ensure enemyDef is used in all player skill calculations including consumables. (player-skills.js)
- Type: Bug | Severity: Minor | Effort: S | Gain: 3

#### [CURSE-SCALE] Chore: Curse scaling — curse stats should affect action bar width
- Negative curse stat values should shrink the success zone — currently all curses are equally hard regardless of intensity. (action-config.js)
- Type: Chore | Effort: S | Gain: 3

#### [KARMA-SCALE] Improvement: Karma scaling — tiered reincarnation bonus
- Any positive karma currently gives the same revive reward — should scale by tier. (player-skills.js)
- Type: Improvement | Effort: S | Gain: 3

#### [GEN-STATE] Chore: Generator state — clean up nextEncounter Generator-type logic
- Clean up hacky logic in nextEncounter for Generator types; ensure area transitions and seen tracking are robust. (game-loop.js)
- Type: Chore | Effort: S | Gain: 2

#### [BOSS-TRACK] Chore: Boss type tracking — replace enemyBossType global hack
- Replace the enemyBossType global with cleaner state management. (encounter-loader.js)
- Type: Chore | Effort: M | Gain: 2

#### [ACT-UPGRD] Chore: Action type cleanup — refactor or remove Upgrade type
- Refactor or remove the Upgrade action type if redundant. (action-resolver.js, ui-render.js)
- Type: Chore | Effort: S | Gain: 2

#### [MAGIC-FNSH] Improvement: Magic finisher — refactor mercy logic for 1HP enemies
- Refactor the magic "mercy kill" logic for finishing enemies at 1 HP. (action-resolver.js)
- Type: Improvement | Effort: S | Gain: 2

#### [COIN-LOG] Improvement: Coin log formatting — replace string-split hack
- Replace brittle string-splitting for coin costs in logging.js with a structured data approach.
- Type: Improvement | Effort: S | Gain: 2

#### [REST-PAIN] Improvement: Rest button "Pain" label — replace with real state
- Invent a Perk or state to replace the placeholder "Pain" label on the rest button. (ui-buttons.js)
- Type: Improvement | Effort: XS | Gain: 2

#### [EMOJI-ASGN] Improvement: Emoji assignments — finalize unassigned types
- Finalize emoji for unassigned encounter types (🐅 > ⚔️ etc.) in enemy-skills.js and action-resolver.js.
- Type: Improvement | Effort: XS | Gain: 2

#### [TEAM-RENDER] Chore: Team rendering — refactor hacky sort/render logic
- Refactor the team sorting/rendering in ui-render.js ("Hacky hacky hacky").
- Type: Chore | Effort: S | Gain: 2

---

## P4 — Nice to Have / Parking Lot

### [DODGE-STR] Bug: "Successfully dodged" string too long
- Shorten the success string for dodge — it reads long in the action log.
- Priority: P4 — cosmetic; XS effort but low urgency
- Type: Bug | Severity: Minor
- Effort: XS | Gain: 2

### [SOUL-GEM] Feature: Legendary soulgem — physical damage to spirits
- Unique Legendary item enabling physical damage against spirit-type enemies.
- Priority: P4 — niche mechanic; not enough demand to justify the slot now
- Type: Feature
- Effort: S | Gain: 2

### [INV-ITEMS] Idea: New items for new inventory slots
- Review ideas for items to fill new inventory slots once the expand-inventory system (P3) lands; clean out the ideas folder in the process.
- Priority: P4 — depends on P3 inventory expansion; no design yet
- Type: Idea
- Effort: S | Gain: 2
- Needs: Define which slots exist and what item archetypes make sense before designing.

### [ORIG-ITEMS] Feature: Origins with starting items
- Origins that begin the run with a Legendary item already equipped.
- Priority: P4 — requires inventory slot system first
- Type: Feature
- Effort: S | Gain: 3

### [GROOM-ORIG] Idea: Groom origin — unique power/effect
- Add a Groom origin with a mechanical effect that matches the narrative role.
- Priority: P4 — no concrete design yet; fun lore hook
- Type: Idea
- Effort: S | Gain: 2
- Needs: Define what the Groom origin's power should be.

### [KARMA-ITEM] Idea: Legendary item — negates bad karma effects
- A Legendary that offsets karma penalties — requires karma overhaul (P3) to exist first.
- Priority: P4 — blocks on the karma system
- Type: Idea
- Effort: S | Gain: 2

### [ALTAR-PRAY] Idea: Altar — no stat bonus, Pray = XP
- A simple altar encounter where Pray grants XP with no stat effect.
- Priority: P4 — minor content addition
- Type: Idea
- Effort: XS | Gain: 2

### [UNDEAD-RISE] Idea: Undead transformation — player killed by undead rises at 1HP
- Being killed by an undead enemy causes the player to rise as undead: 1 HP, half STA, skip death state; append 🧟 before player name; undead enemies deal 0 base ATK against the transformed player.
- Priority: P4 — interesting mechanic but significant state complexity
- Type: Idea
- Effort: M | Gain: 3

### [PROP-SPAWN] Idea: Hit prop once to spawn a small encounter
- Allow a single hit on a Prop to attempt spawning a small encounter — push a copy of the prop forward if unused.
- Priority: P4 — variant of the Camp type; interesting but low clarity
- Type: Idea
- Effort: S | Gain: 2

### [PORTAL-VLG] Idea: Portal to village — skip early game (verify if done)
- Story-progress-unlockable portal skipping early areas. Marked as possibly already done with the gate.
- Priority: P4 — verify before resurrecting
- Type: Idea
- Effort: S | Gain: 2
- Needs: Confirm whether the current gate encounter already implements this.

### [SPELL-SYS] Feature: Spells system
- Spell button replaces Curse; spell list overlay on click (scrollable, max height = action buttons); spells learned from Spell Scrolls via a Learn action (INT-based success). Basic spells: 🐸 Hex, 🔥 Burn, 🧊 Freeze, ⚡️ Surge, 🪬 Curse (−ATK), 🪨 Harden, 🩸 Syphon.
- Priority: P4 — major new system; high concept value but XL scope
- Type: Feature
- Effort: XL | Gain: 4

### [SFX-MUSIC] Feature: Sounds — SFX and background music
- Investigate platform support (iOS, Android, Mac, Windows) and add sound effects and ambient music.
- Priority: P4 — audio is transformative but large scope with platform risk
- Type: Feature
- Effort: L | Gain: 4

### [VEC-BG] Feature: Vector backgrounds for all areas
- Complete and default to vector backgrounds for all areas.
- Priority: P4 — significant atmosphere upgrade; L effort, not mobile-critical
- Type: Feature
- Effort: L | Gain: 3

### [SVG-EMOJI] Feature: SVG support in emoji column
- Support thing.svg references in the emoji column (assets/encounters/); render same size/position as emoji.
- Priority: P4 — infra change for a niche use case
- Type: Feature
- Effort: M | Gain: 2

### [SLACK-EMOJI] Feature: Slackmojis.com URL support in emoji fields
- Support slackmojis URLs across encounters/story/origins/buttons.
- Priority: P4 — novelty, not worth the parsing complexity
- Type: Feature
- Effort: M | Gain: 1

### [BLACK-HOLE] Feature: Black hole — new optional area + spaghetti monster boss
- DLC-style optional area with spaghetti monster boss, modern props, items, tools. The JS spaghetti monster joke boss lives here.
- Priority: P4 — fun/joke expansion; well outside current scope
- Type: Feature
- Effort: XL | Gain: 2

### [PW-BOT] Feature: Playwright — automated run bot
- Playwright bot that reads controls and autonomously decides actions to complete a full run.
- Priority: P4 — requires stable AI decision layer
- Type: Feature
- Effort: XL | Gain: 2

### [GHOST-MP] Feature: Pseudo-multiplayer ghosts
- Hardcode 5–10 ghost encounters using highscore names (mocked if offline) — drop loot from the dead player's inventory. Largely superseded by the live Invaders system; keep as an offline-only fallback concept.
- Priority: P4 — superseded by real Invaders; revisit only if pool is always empty
- Type: Feature
- Effort: M | Gain: 2

### [BUG-PIPE] Social: Bug report → GitHub Issues pipeline
- Separate bug report Google Form → sheet; daily GitHub Action syncs to Issues with tags.
- Priority: P4 — dev infra; useful post-beta, not urgent now
- Type: Feature
- Effort: M | Gain: 2

### [CLEAN-IDEAS] Chore: ME — Clean ideas folder
- Review and archive or delete the ideas folder contents.
- Priority: P4 — housekeeping
- Type: Chore
- Effort: S | Gain: 1

### [RIVER-ATM] Data: River of Sorrows — atmosphere encounters + dock handoff
- 1–2 static Memory-type story encounters (Drifting Lanterns, Wrecked Hull, Shore Inscription). Post-boss dock encounter as Necropolis area handoff using fullscreen fade. Memory type needs non-trivial work outside Fairyland context.
- Priority: P4 — atmosphere; not beta-facing
- Type: Feature
- Effort: M | Gain: 3

### [FISH-LOOT] Data: Bloat fishing loot — items, threats, floating altars
- Add variety to fishing encounter pool: items, threats, traps, floating altars.
- Priority: P4 — fishing is functional; this is content depth
- Type: Feature
- Effort: S | Gain: 2

### [SPIRIT-ENEMY] Data: Add spirit/reflective enemies to Village and River
- Spirit and reflective types underrepresented in early/mid areas.
- Priority: P4 — content variety
- Type: Feature
- Effort: S | Gain: 2

### [LATE-PETS] Data: New late-game pets
- Drowned spirit, scared ghost, living mushroom, talking fly — flavor + occasional LCK, rarely +1 ATK.
- Priority: P4 — content; fun but not blocking
- Type: Feature
- Effort: S | Gain: 2

### [TRAP-VAR] Data: More positive and negative traps + curses (all variants)
- Stat-swap traps, -ATK curses in late game, containers costing STA/LCK, lategame curses stealing mana/STA, practice target variants for Speak/Cast (with option to leave), magic items that almost always carry a curse.
- Priority: P4 — content variety; not blocking
- Type: Feature
- Effort: M | Gain: 2

### [ENEMY-DATA] Data: Revise enemy data per area
- Village traps/special enemies; Fairyland (Forest Fiend, ghosts); River (all types — very lacking); Necropolis (special, freezing/snowman, animated objects, flora, unusual shades).
- Priority: P4 — content breadth pass; post-beta
- Type: Chore
- Effort: L | Gain: 3

### [MEADOW-ENCNTR] Data: Meadows — increment no-effect encounters
- Add no-effect altars, observations, clear sky, silent overcast encounters.
- Priority: P4 — atmosphere; not blocking
- Type: Feature
- Effort: S | Gain: 2

### [FOOD-PERMA] Data: Lemon-unique foods — perma boosts per area
- 1 good + 1 bad perma-boost food per area; mixed stat foods (lose and gain simultaneously); ensure bad foods in all areas.
- Priority: P4 — content depth
- Type: Feature
- Effort: S | Gain: 2

### [NECRO-OPT] Data: Necropolis optional areas
- Optional sub-areas for late-game variety inside Shrouded Necropolis.
- Priority: P4 — content; post-beta
- Type: Feature
- Effort: L | Gain: 3
- Needs: Define what optional areas look like and how they gate before designing.

### [TIPS-SYS] Idea: Game tips system (parked)
- Tips that trigger on player state (first death, first Artifact, low STA) using existing toast system — easy/story difficulty only. Parked — tutorial revamp (P2) supersedes this.
- Priority: P4 — superseded by tutorial revamp; keep as reference if tip-layer is needed later
- Type: Idea
- Effort: S | Gain: 1

---

*Styx Flow complete — 79 items processed*
