# Styx Flow — 2026-05-21 — Stay Dead

*121 items · 2026-05-21: -3 done/resolved (DEATH-MSG, KILL-LINE, GAME-ENDS), +11 from post-playtest notes (END-DUPE, POOL-GAP, UNDEAD-MGK, SCROLL-GAP, END-ACHIEV, SHOP-BOOST, NECRO-PROP, WEAP-CMBO, HIDE-DRM, BAL-AUDIT, END-SCORE), LOOT-TEAS moved from Backlog to SPRINT · prior: 2026-05-16: +1 (BARK-CTX); prior: +2 (LOOT-TEAS, LOOT-ANIM); prior: +2 (PET-ENCNTR, PET-SLOT), 3 expanded (COMP-PLAY, ENC-PREGEN, PATH-CHOICE); prior: SPRINT block from Perseus 2026-05-15*

---

## SPRINT — Creative Polish Day *(one man, one day — max fun, max hook)*

---

## P0 — Hard Blockers *(drop everything)*

---

## P1 — Serious Issues & Big Wins

### [POOL-GAP] Bug: Thin or missing encounter pools in some areas — Desktop screenshots confirm gaps
- Some area encounter pools are running thin or empty; encounters repeat too early or the generator runs dry.
- "Resolve lacking pools per screenshots on Desktop" — desktop viewport makes the pool exhaustion visible; audit which area pools are below minimum viable depth.
- Check each area in `encounters.csv` / `story.csv` for row count; compare against how many encounters `generateNextEncounters()` requests per area pass; add rows to thin areas.
- Priority: P1 — shallow pools break the core loop; encounter repetition is one of the fastest ways to lose a beta tester.
- Type: Bug | Severity: Major
- Effort: S | Gain: L

---

## P2 — Release-Gating

### [UNDEAD-MGK] Bug: MGK on non-caster undead incorrectly triggers near-impossible block condition
- Zombies and other physical undead carry MGK > 0 in the CSV; `action-config.js` treats any enemy with `eMgk > 0` as a spell-caster and makes block near-impossible ("physically shielding a spell is near-impossible").
- Audit `encounters.csv` and `story.csv` for all Undead-type rows; remove MGK from non-caster undead (zombies, revenants, etc.); keep MGK only on actual caster subtypes (liches, banshees, wraiths — rows where spells are the intended threat).
- Priority: P2 — live balance bug on late-game enemies; blocking an undead horde should be physically hard but possible, not mechanically near-impossible.
- Type: Bug | Severity: Major
- Effort: S | Gain: L

### [SCROLL-GAP] Bug: Intermittent mega-scrollable empty space appearing below page body
- Occasionally a large blank scroll area appears below the game UI — the page becomes scrollable to a large empty region that should not exist.
- iOS WebKit (Chrome/Safari on iPhone) has a known scroll-height doubling bug when `zoom` is applied to `<body>` — the scrollable area becomes 2× the content height, showing a grey blank region below.
- Root fix: `overflow:hidden` on body kills legitimate menu scroll on short screens. Proper fix likely needs `html { overflow:hidden; height:100% }` + `body { overflow-y:auto; height:100% }` to confine scroll to body as its own container, or replacing `zoom` with `transform:scale` on a wrapper div.
- Priority: P2 — visually breaks the page and is jarring on mobile; intermittent but reproducible.
- Type: Bug | Severity: Major
- Effort: M | Gain: M

### [ACHIEV-UNLCK] Feature: Complete missing achievement unlocks + unique origin powers
- Wire all remaining achievement unlock triggers; for unlockable origins, add or replace flat stat grants with unique starting powers (e.g., starting Legendary item, passive ability — check head of origins.csv for candidates).
- Priority: P2 — achievement system is a retention hook; broken unlocks and flat origins undermine it
- Type: Feature
- Effort: L | Gain: L

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

### [SHOP-BOOST] Improvement: Expand shop 1-coin boost item pool
- Add more Common boost items with +x/-x stat tradeoffs to the shop's 1-coin pool — e.g., +1 ATK / -1 LCK, +1 STA / -1 HP.
- Currently the cheap shop tier is thin; players cycling the shop repeatedly see the same options.
- Priority: P3 — shop feel; content gap but not release-gating
- Type: Improvement
- Effort: S | Gain: M

### [NECRO-PROP] Improvement: Necropolis prop variety — more atmospheric non-combat encounters
- Add more prop encounter rows to Shrouded Necropolis — the area is combat-dense and could use quiet/atmospheric beats to contrast the final boss buildup.
- Priority: P3 — emotional counterweight per DESIGN.md; a cluster of brutal encounters needs at least one moment of stillness
- Type: Improvement
- Effort: S | Gain: M

### [WEAP-CMBO] Feature: Weapon combo items — dual-stat (+ATK+MGK, etc.)
- Add items that combine two offensive stats — e.g., +1 ATK +1 MGK, +1 ATK +1 STA — as a distinct item archetype that rewards hybrid builds.
- Slot naturally into the existing rarity system; net stat formula already handles multi-stat items.
- Priority: P3 — build variety; currently no items bridge ATK and MGK for hybrid combat/magic builds
- Type: Feature
- Effort: S | Gain: M

### [HIDE-DRM] Improvement: Hide Necropolis dream encounters after the player has completed a run
- Dream encounters in Shrouded Necropolis reveal lore/realizations about the player's past. Once a player has reached an ending, replaying through the dream sequence breaks immersion.
- Suppress the "Deam" encounters after the first game completion - remove from story lines if game previously completed.
- Priority: P3 — repeat-run immersion; veterans replaying for new endings don't need to re-live the tutorial revelation every time
- Type: Improvement
- Effort: S | Gain: M

### [BAL-AUDIT] Question: Blind spots review — encounter types vs action-config vs action-resolver coverage
- Audit action-config.js and action-resolver.js for encounter types that have incomplete or inconsistent handling — buttons that silently pass/fail when they should have a dedicated case, or encounter types not covered by any special-case logic.
- Start by mapping all `types` values to their action-config branches; flag any type+button combos that fall through to the default stat calc without a intentional rationale.
- Priority: P3 — may surface silent balance bugs before beta; low urgency but high signal value
- Type: Question
- Effort: M | Gain: M
- Needs: Decide scope — full audit or just the recently-added encounter types?

### [END-SCORE] Question: Per-ending scoring — differentiate point rewards by ending difficulty
- Currently all win endings give +100 regardless of difficulty (Name requires Love 6 + Karma 2; Guard requires nothing). Should harder endings give more points to reflect the run investment?
- Design question: define a point bonus per ending tier (e.g., Guard +50, Sleep +75, Name +150) and wire into `ScoreManager` alongside existing `endType` handling.
- Priority: P3 — scoring balance; not release-gating but affects leaderboard meaning
- Type: Question
- Effort: S | Gain: M
- Needs: Design the point tiers per ending before implementing. Verify this doesn't break current highscore.json comparisons.

### [ACTN-FLAVOR] Feature: Action outcome flavor text — per-outcome log lines
- Each action result (crit-pass / pass / fail / crit-fail) on an encounter should have a distinct flavor log line beyond the current generic text. Lines must hint at *why* the outcome happened — the stat or companion that tipped it — not just describe the result.
- Add outcome-variant strings to `string-generator.js` or per-encounter-type pools; call from `action-resolver.js` after result resolution. Start with the highest-volume encounter types: Standard enemies and Props.
- Priority: P3 — flavor text without causality hint is decoration; this is what closes the feedback loop between player stats and moment-to-moment feel.
- Type: Feature
- Effort: M | Gain: L

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
- Toggleable in menu
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

### [UI-DIALOGS] Chore: Consolidate all dialog overlays into ui-dialogs.js
- Five modal overlays currently live in different files: QR share dialog, leaderboard nickname (score-manager.js), companion name + player rename (ui-effects.js), and slot swap (inventory-manager.js). Extract all into a single ui-dialogs.js with a consistent open/confirm/cancel pattern, loaded after ui-effects.js.
- Priority: P3 — no user-visible impact; purely internal cleanliness
- Type: Chore
- Effort: S | Gain: S

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

### [STAT-NUDGE] Feature: Fractional "nudge" stat values for hidden stats — LCK, INT
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

### [KARMA-OVRHL] Feature: Karma overhaul — full system
- Revive interval scaled by karma; Speak on aggressive enemies = +1 karma; Attack on neutral/friendly = -2 karma; karma decay toward 1 across runs; tiered reincarnation bonus; mischievous encounter variants at karma < 0; perks/flaws unlocked at ±10 karma; good karma bonus encounter (not only on revive); proactive actions to repair bad karma. Expand all hooks; ensure hints make karma legible.
- Priority: P3 — transformative system but XL scope; must not ship incomplete
- Type: Feature
- Effort: XL | Gain: XL

### [CRIT-LCK] Improvement: Action bar crit zone luck scaling redesign
- Crit success and crit fail zone widths should scale smoothly with luck across the range -5 to +10, changing ~1pp per ±2 luck steps, with a non-zero floor on both zones at all times.
- Current formulas (main path, action-config.js lines 606–607) cap out too early: crit success hits max at LCK 6, crit fail hits floor at LCK 8. Negative luck currently has no effect (pLck is clamped to 0 at line 8).
- Crit success zone should always be a sliver inside the green success zone — cap it as a fraction of `zoneW`, not an absolute pp count, so it never dominates the bar at high luck.
- **Also fix these specific hardcoded cases** (confirmed design intent per 2026-05-20 review):
  - Lines 108/114 — Attack/Grab Trap-Obstacle: remove hardcoded crits, run through normal luck-scaled calc
  - Lines 119–120 — Exhausted grab (no STA): keep ultra-hard zone, but ADD a crit fail zone (none currently)
  - Line 129 — Resurrection: keep static narrow crit pass (intentional), but REMOVE crit fail (the critFailW: 5 there has no design reason)
  - Line 197 — Heavy grab: ADD crit fail zone (grabbing a Heavy with STA remaining should be dangerous, not just hard)
  - Lines 362–363 — Trap wrong-action: REMOVE crit pass entirely; keep crit fail (punishment, no reward)
  - Lines 395–397 — Recall/speak Memory: de-hardcode; scale by luck like other speak variants
- Priority: P3 — not broken enough to block beta; crit zones currently feel slightly too generous at LCK 4+ but the system works
- Type: Improvement
- Effort: M | Gain: M
- Source: Balance Designer + Game Design Lead + Competitive Player review 2026-05-20; see .perseus/2026-05-20-2120-luck-crit-zones.md
- **Main-path formulas finalized 2026-05-20** (implemented): `critSuccessW = 2 + pLck * 0.625` (max at luck 8); `critFailW = 5 - rawLck * (rawLck < 0 ? 1.25 : 0.5)` (negative luck expands danger zone, cap 10 at luck −4). Hardcoded special-case fixes remain as a separate future pass.
- **Negative luck audit (future pass):** Every system where positive luck has a beneficial effect should have negative luck produce the opposite. Known candidates to audit: `RarityManager.rollTier` (luck shifts rarity up — negative should shift toward Cursed/Common); `getWeightedLootIndex` (fishing loot quality); zone position blend in `action-config.js` (`luckBlend = pLck * 0.12` — currently clamped, negative luck should push zone toward a harder right-edge placement); container search width (`40 + pLck * 9` — negative luck should narrow the search zone). Pattern: find every `Math.max(0, pLck)` or `pLck * positiveCoeff` and decide whether unclamping is safe in that context.

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


### [ALTAR-PRAY] Idea: Altar — no stat bonus, Pray = XP
- A simple altar encounter where Pray grants XP with no stat effect.
- Priority: P4 — minor content addition
- Type: Idea
- Effort: XS | Gain: S

### [PROP-SPAWN] Idea: Hit prop once to spawn a small encounter
- Allow a single hit/touch on a Prop to attempt (% roll) spawning a small encounter — push a copy of the prop forward to reocurr after the small ecnounter.
- Priority: P4 — variant of the Camp type; interesting but low clarity
- Type: Idea
- Effort: S | Gain: S

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

### [VIS-IMPACT] Improvement: Full visual impact frames — hit flash, damage flash, STA fade
- Flash white when player hits; red-white flash when player takes damage and is left with just 1 hp; green flash when losing STA and left with 1 sta.
- Priority: P3 — broader than .flash-crit; higher effort but higher feel impact
- My Note: -> P4 Such visual changes always take a long time to be good, parking lot this after beta, we have some visual feedback already.
- Type: Improvement
- Effort: M | Gain: L

### [VEC-BG] Feature: Vector backgrounds for all areas
- Complete and default to vector backgrounds for all areas.
- Priority: P4 — significant atmosphere upgrade; L effort, not mobile-critical
- Type: Feature
- Effort: L | Gain: M

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

### [COMP-STAKES] Feature: Companion narrative stakes — full system (Hades Gate)
- Full companion stakes design: companion individuation (a logged "named moment" when a companion joins), enemy steal/kill mechanic, rescue/revenge fight. Companions must feel like relationships with a story, not emoji bonuses.
- Do NOT implement until [COMP-PLAY] is stable and companions have demonstrated passive gameplay value first. Design via Hades Gate when ready.
- Priority: P3 — companion individuation before the steal/kill mechanic is a hard prerequisite; loss only lands if attachment was built.
- Type: Feature
- Effort: XL | Gain: XL
- Needs: Full design via Hades Gate. Prerequisite: [COMP-PLAY] stable.

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

### [KARMA-ITEM] Idea: Legendary item — negates bad karma effects
- A Legendary that offsets karma penalties — requires karma overhaul (P3) to exist first.
- Priority: P4 — blocks on the karma system
- Type: Idea
- Effort: S | Gain: S

### [UNDEAD-RISE] Idea: Undead transformation — player killed by undead rises at 1HP
- Being killed by an undead enemy causes the player to rise as undead: 1 HP, half STA, skip death state; append 🧟 before player name; undead enemies deal 0 base ATK against the transformed player.
- Priority: P4 — interesting mechanic but significant state complexity
- Type: Idea
- Effort: M | Gain: M

### [NECRO-OPT] Feature: Necropolis optional areas
- Optional sub-areas for late-game variety inside Shrouded Necropolis.
- Priority: P4 — content; post-beta
- Type: Feature
- Effort: L | Gain: M
- Needs: Define what optional areas look like and how they gate before designing.

### [FLASH-CRIT] Improvement: .flash-crit CSS animation on critical hits
- Brief card flash on critical hit — hook into existing ui-effects.js animation infrastructure.
- Bundle with [CRIT-SHAKE] for full crit feedback; guard every `animationend` handler with `if (e.target !== e.currentTarget) return` to prevent child element bubbling bugs.
- Priority: P4 — polish; post-beta
- Type: Improvement
- Effort: XS | Gain: M

### [CRIT-SHAKE] Improvement: Crit attack shakes enemy card; crit walk bounces player card
- On crit-pass Attack: shake enemy card only (not full screen). On crit-pass Walk: slight bounce on player card only. For other crit types, propose similar effect - for each action crit outcome possible.
- Bundle with [FLASH-CRIT]; guard `animationend` with `if (e.target !== e.currentTarget) return`.
- Priority: P4 — polish; post-beta
- Type: Improvement
- Effort: S | Gain: M

### [BOSS-TOLL] Improvement: Boss death counter — show area death toll on boss kill
- On killing an area boss, display how many times the player died in that area before the kill — e.g. "After 3 deaths in the Twisted Fairyland." Zero deaths gets its own line — e.g. "First blood. Somehow." Bosses are drawn from a pool per area, so the counter is per area, not per specific enemy.
- Track `areaDeathCount` (reset each area) in `gameOver()` keyed to current area; read and display on boss kill resolution in `action-resolver.js` or `game-loop.js`.
- Priority: P4 — polish; post-beta
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

### [SVG-EMOJI] Feature: SVG support in emoji column
- Support thing.svg references in the emoji column (assets/encounters/); render same size/position as emoji.
- Priority: P4 — infra change for a niche use case
- My note: would actually give ability to have endless content as we are running out of emojis
- Type: Feature
- Effort: M | Gain: S

### [MAGIC-CONT] Feature: New encounter type — Magic Container (cast to unlock)
- Container that requires Cast to open — contains an item (50% artifact chance, same as standard locked containers).
- This can be easily achieved with adding some MGK to any container (can be anywhere between 1-4), "magic barrier" until "casted upon"
- Priority: P3 — extends existing container design with a mana decision
- Type: Feature
- Effort: S | Gain: M

### [SFX-MUSIC] Feature: Sounds — SFX and background music
- Investigate platform support (iOS, Android, Mac, Windows) and add sound effects and ambient music.
- Priority: P4 — audio is transformative but large scope with platform risk
- Type: Feature
- Effort: L | Gain: L

### [SEQ-DELAY] Improvement: Sequential action display — delay 0.5s per log entry
- Add a 0.5s delay between log entries in multi-step action sequences; wait for effects to complete before re-enabling player input.
- Wrap the `logAction()` call chain in a `setTimeout` queue; 500ms between entries; block player input until the chain resolves; scope to multi-step sequences only — single actions stay instant.
- Type: Improvement
- Effort: S | Gain: M

### [INV-EXPND] Feature: Expand inventory — consumables + equipment slots
- Add consumables array; head/chest/hands item slots with swap mechanic (prevents fast stacking); intentional food eating only (no auto-consume); open inventory on click of loot/party bar.
- Priority: P3 — major architecture change; high gain but XL scope
- Type: Feature
- Effort: XL | Gain: L

### [INVAD-GRAVE] Feature: Invader Graveyard UI
- "👾 Kill List" section in Main Menu screen — name, area, level per entry, persisted under rivalGraveyard in localStorage.
- Priority: P3 — social trophy moment; not blocking
- Type: Feature
- Effort: S | Gain: M

### [RUN-MOD] Feature: Game run modifiers
- Unlockable run modifiers activated via Origins or special conditions (e.g., Demons passive, Animals passive).
- Priority: P3 — build variety depth
- Type: Feature
- Effort: L | Gain: M
- Needs: Define unlock conditions and exact modifier effects before implementing.

### [SLEEP-PUNISH] Idea: Non-score punishment for oversleeping — love loss or harder enemies
- Current oversleep penalty is score-only (−1 per sleep above threshold). Consider adding a mechanical consequence: −1 `playerLove` per penalized sleep (locks higher endings if abused), or giving the current enemy a free attack / skipping item pickup on penalized non-combat sleeps.
- Love loss is the most thematically resonant option (delays cost connection to Rosabel) but needs a hint system first — players should see it coming before it gates an ending.
- Source: Perseus review 2026-05-20 — deferred by design; score penalty alone is sufficient for now.
- Priority: P4 — revisit after hints/transparency around the sleep system are established
- Type: Idea
- Effort: S | Gain: M

### [BLACK-HOLE] Feature: Black hole — new optional area + spaghetti monster boss
- DLC-style optional area with spaghetti monster boss, modern props, items, tools. The JS spaghetti monster joke boss lives here.
- Priority: P4 — fun/joke expansion; well outside current scope
- Type: Feature
- Effort: XL | Gain: S

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

*Styx Flow complete — 121 items processed*
