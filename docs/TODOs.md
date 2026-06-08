# Styx Flow — 2026-06-01 — Stay Dead

*~107 items · 2026-06-08: -1 resolved (CRED-TEST — credits bug fixed in code), +3 (INV-FADE, DRAG-CNCL from medusa drift jar; SHOP-SPAWN user-flagged) · prior: 2026-06-06: -2 resolved (WEAP-CMBO done in commits, HIST-UI executed — dual-stat combo weapons added in commit b53ed63) · prior: 2026-06-02: -4 resolved (VER-BUMP, CHEAT-SUBM, CHEAT-TIPS, COMP-PARTY), +1 (BOSS-TELE) · prior: 2026-06-01: +1 (ORIG-ROLL) — Origins picker reroll button, user-flagged P1 · prior: 2026-06-01: Styx re-sort — Backlog and Technical Debt integrated into P3/P4, [SCROLL-GAP] promoted to P2, [ORIG-ITEMS] cleaned, [COMP-PLAY] flagged (assumed shipped — not found in backlog) · prior: 2026-06-01: +24 new items (FAIR-PETS, BAIT-LOOT, WHIP-ITEM, MED-ITEMS, FAIR-WORM, FAIR-MINST, BOSS-TOUGH, AREA-STATS, FRIEND-MIN, BASIC-ORIG, CHEAT-TIPS, CHEAT-SUBM, PERS-REVW, ITCH-WRPR, COMP-PARTY, CRED-TEST, TEST-RUNS, VALID-ERR, VER-BUMP, PR-SUMRY, FISH-ABAR, TELE-ENHA, ORIG-PET), LOOT-TEAS moved from Backlog to SPRINT, HIDE-DRM removed — likely resolved by 05/24/26 "Replace Necropolis story beats on NG+" commit (verify via TEST-RUNS), UNDEAD-MGK scope expanded to all non-caster enemy types · prior: 2026-05-24: +2 (DAILY-QUST, HALF-STAT) · prior: 2026-05-21: -3 done/resolved (DEATH-MSG, KILL-LINE, GAME-ENDS), +11 from post-playtest notes (END-DUPE, POOL-GAP, UNDEAD-MGK, SCROLL-GAP, END-ACHIEV, SHOP-BOOST, NECRO-PROP, WEAP-CMBO, HIDE-DRM, BAL-AUDIT, END-SCORE), LOOT-TEAS moved from Backlog to SPRINT · prior: 2026-05-16: +1 (BARK-CTX); prior: +2 (LOOT-TEAS, LOOT-ANIM); prior: +2 (PET-ENCNTR, PET-SLOT), 3 expanded (COMP-PLAY, ENC-PREGEN, PATH-CHOICE); prior: SPRINT block from Perseus 2026-05-15*

---

## P0 — Hard Blockers *(drop everything)*

- none

## P1 — Release-Gating & Big Wins

### [NEG-FRIEND] Feature: Negative friends — stat decrement encounters
- "Negative friend" encounter variants that decrement stats (inverse of a standard friend boost) — add to late-game areas.
- Priority: P3 — adds tension to a currently safe encounter type
- Type: Feature
- Effort: S | Gain: M

## P2 — Serious Issues

### [FAIR-MINST] Balance: Raise minimum stamina on Fairyland enemies to 2
- Audit all Standard enemy rows in Fairyland areas and raise any with `sta < 2` to `sta = 2`.
- Enemies at 1 STA exhaust after a single Grab, making Grab trivially dominant in early-to-mid areas; minimum 2 STA ensures at least one contested Grab attempt.
- Priority: P2 — balance nudge; Grab is overpowered in Fairyland against very low-STA enemies.
- Type: Improvement
- Effort: XS | Gain: M

### [AREA-STATS] Balance: Rebalance River and Necropolis enemy/item stats
- River and Necropolis enemies and items need a stat calibration pass — confirm ranges match area difficulty relative to Forsaken Village and Fairyland.
- Check stat ranges against CONTENT.md area calibration tables; flag any enemy or item row that is an outlier for its area and rarity tier.
- Priority: P2 — late-game stat imbalance breaks difficulty curve; veterans will notice immediately.
- Type: Improvement
- Effort: M | Gain: L

### [BOSS-TOUGH] Improvement: Toughen the final boss — raise stats or add combat mechanics
- The final boss in Shrouded Necropolis feels undertuned relative to the encounter difficulty leading up to it.
- Audit the boss pool (`encounters.csv`, note filter `Forgotten Love`); raise HP/ATK/DEF on boss variants; optionally add a special mechanic via `enemy-skills.js`.
- Priority: P2 — a weak final boss deflates the ending climax; critical for beta first impressions.
- Type: Improvement
- Effort: S | Gain: L


### [TEST-RUNS] Chore: End-to-end test passes — finish twice, verify NG+ behavior, test on Android
- Complete at least two full runs to any ending on desktop; verify NG+ behavior (story beat replacement in Necropolis, chronicle persistence, score reset).
- Complete at least one full run on Android to surface mobile-specific rendering or logic bugs before beta.
- Includes: verify that dream encounters in Necropolis are correctly suppressed/replaced after the first completion — HIDE-DRM check, likely implemented 05/24/26 "Replace Necropolis story beats on NG+"; confirm live behavior.
- Priority: P2 — untested platform behavior on Android is high-risk for beta; NG+ path is newly wired and unverified.
- Type: Chore
- Effort: M | Gain: L

### [UNDEAD-MGK] Bug: MGK on non-caster enemies incorrectly triggers near-impossible block condition
- Zombies and other physical undead carry MGK > 0 in the CSV; `action-config.js` treats any enemy with `eMgk > 0` as a spell-caster and makes block near-impossible ("physically shielding a spell is near-impossible").
- Audit `encounters.csv` and `story.csv` for all Undead-type rows; remove MGK from non-caster undead (zombies, revenants, etc.); keep MGK only on actual caster subtypes (liches, banshees, wraiths — rows where spells are the intended threat).
- Extend audit to ALL non-caster enemy types — any Standard warrior, beast, or physical boss carrying MGK > 0 silently makes block near-impossible; the fix is not limited to the Undead type.
- Priority: P2 — live balance bug on late-game enemies; blocking an undead horde should be physically hard but possible, not mechanically near-impossible.
- Type: Bug | Severity: Major
- Effort: S | Gain: L

### [ENLCK-FUNC] Improvement: Make enemy LCK stat functional
- Enemy LCK currently does nothing visible — wire it to counter player LCK on crit chance and/or action bar intervals; optionally affect fishing spot chances.
- Priority: P2 — dead stat on a UI-visible field erodes trust in every other hidden system.
- Type: Improvement
- Effort: M | Gain: L

### [SHOP-SPAWN] Bug: Shade shop (Undertaker) not spawning when player has unspent drachma
- Players report the Undertaker shop failing to appear even when `savedCoins - spentCoins > 0`. Suspected areas include Fading Wildlands and possibly others.
- Code path: shop injection in `generateNextEncounters` case 0 (`encounter-generator.js`) requires `AchievementManager.isUnlocked('coin_first')` AND unspent drachma AND area not already served. One or more conditions may silently fail.
- Investigate: confirm `coin_first` unlock timing (should fire on first coin pickup — verify it's not firing too late or missing on some coin types); check `_shopInjectedArea` reset logic; verify all areas use Generator-0 in their sequence.
- Priority: P2 — shop is a core meta-progression loop; if it silently fails, players lose access to upgrades with no feedback.
- Type: Bug | Severity: Major
- Effort: S | Gain: L

### [INV-FADE] Bug: Extra curtain fade when sleeping to level up on an invader corpse
- Sleeping on a dead invader and triggering a level-up produces an unexpected extra fade. Cause not identified via static analysis — the "Level Up!" `curtainFadeInAndOut` in `playerCheckLevelUp` is the only expected fade; no second code path found that should fire.
- Needs live-playtest observation: reproduce by killing a rival invader, gaining enough XP to level up, then sleeping on the corpse.
- Priority: P2 — visual glitch on an invader kill; feels like a double-fade bug that undermines the defeat moment.
- Type: Bug | Severity: Minor
- Effort: S | Gain: S

### [PERS-REVW] Chore: Perseus review of public-facing docs and itch.io page
- Run `/perseus` on the public README, itch.io description, and any player-facing documentation for tone, first-impression quality, and missing info for new players.
- Priority: P2 — public-facing text sets expectations before a player ever loads the game; beta launch is the right time to fix tone mismatches.
- Type: Chore
- Effort: S | Gain: M

## P3 — Should-Fix

### [DRAG-CNCL] Feature: Tutorial / hint for drag-off-button cancel
- Drag-to-cancel is already implemented — sliding your finger/cursor off an action button before releasing cancels the pending action. Players discover this by accident; needs an in-game hint so it's a known affordance.
- Add a one-time contextual tip (e.g. on the first action bar appearance, or in the tutorial encounter) explaining that releasing outside the button cancels the action.
- Priority: P3 — discoverability gap; the mechanic exists but is invisible to new players.
- Type: Feature
- Effort: XS | Gain: M

### [ENDEF-CALC] Bug: Enemy defense — enemyDef not applied in all skill calcs
- Ensure enemyDef is used in all player skill calculations including consumables. (`player-skills.js`)
- Priority: P3 — silent balance issue; all attack paths should respect enemy DEF consistently.
- Type: Bug | Severity: Minor
- Effort: S | Gain: M

### [ACTN-FLAVOR] Feature: Action outcome flavor text — per-outcome log lines
- Each action result (crit-pass / pass / fail / crit-fail) on an encounter should have a distinct flavor log line beyond the current generic text. Lines must hint at *why* the outcome happened — the stat or companion that tipped it — not just describe the result.
- Add outcome-variant strings to `string-generator.js` or per-encounter-type pools; call from `action-resolver.js` after result resolution. Start with the highest-volume encounter types: Standard enemies and Props.
- Priority: P3 — flavor text without causality hint is decoration; this is what closes the feedback loop between player stats and moment-to-moment feel.
- Type: Feature
- Effort: M | Gain: L

### [ORIG-UNIQ] Content: More unique origins with gameplay implications
- Add origins with real mechanical effects beyond stat distribution — passives, starting conditions, unique interactions.
- Priority: P3 — origin depth; builds on the achiev-origin work in P2
- Type: Feature
- Effort: M | Gain: M

### [ITEM-RARITY] Content: Item/Origin — increases higher rarity drop chance
- New item or origin that shifts loot probability toward Uncommon/Rare/Legendary.
- Priority: P3 — build variety; rarity system is already wired for this
- Type: Feature
- Effort: S | Gain: M

### [ITEM-CRIT] Content: Item/Origin — bigger crit chance interval
- New item or origin that widens the crit success zone on the action bar.
- Priority: P3 — build variety
- Type: Feature
- Effort: S | Gain: M

### [HOUR-SLOW] Content: ⏳ Strange Hourglass — 10% slower action bar
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

### [PET-ADOPT] Feature: Adopt pet for item — give item to tame
- Allow giving a specific item to adopt a pet (e.g., offer a mouse/lizard to a cat) — similar to friend quest item mechanic but for pet recruitment.
- Priority: P3 — adds a resource decision to pet taming
- Type: Feature
- Effort: S | Gain: M

### [HAPTIC-BAR] Platforms: Android vibration — action bar haptics
- Vibrate on button press/release, on zone transitions (fail/pass/crit), on taking damage; vary pattern and length per trigger. Verify whether any iOS vibration permission is possible.
- Priority: P3 — mobile game feel; significant on Android
- Type: Feature
- Effort: M | Gain: M

### [STAT-NUDGE] Feature: Fractional "nudge" stat values for hidden stats — LCK, INT
- Make use of sub-1 increments on hidden stats in CSV/origins (JS already supports decimals); display as human-readable labels rather than raw numbers — e.g. 0.5 = "Small bonus", 
- Priority: P3 — design space unlock with near-zero code cost; pairs well with the rarity weights audit below
- Type: Feature
- Effort: S | Gain: M
- Details: LCK at ×0.5 in the net formula means +0.5 LCK
- Update the display logic to support tiny: The UI label mapping (0.25 → "Tiny", 0.5 → "Small")

### [MED-ITEMS] Content: Mediocre items — zero net stat, Common rarity filler
- Add a pool of items with balanced positive/negative stats netting to +0 — e.g., "+1 ATK / -1 LCK", "+1 HP / -1 STA" — to flesh out the Common tier loot pool.
- Zero-net items give players genuine minor trade-off decisions without power creep.
- Priority: P3 — Common tier is thin; mediocre items give the rarity curve a proper base without inflating stats.
- Type: Feature
- Effort: S | Gain: M

### [BASIC-ORIG] Content: Simple starter origins — small +INT and/or +LCK bonus
- Add 2–3 origins with minimal mechanics: just a +1 INT or +1 LCK bonus (or small combination) and a short flavor desc.
- These fill the origin list with accessible starting points that don't require understanding the passive system — reduces decision paralysis for new players.
- Priority: P3 — origin picker feels sparse for new players; simple options are a low-friction on-ramp.
- Type: Feature
- Effort: S | Gain: M

### [MAGIC-CONT] Feature: New encounter type — Magic Container (cast to unlock)
- Container that requires Cast to open — contains an item (50% artifact chance, same as standard locked containers).
- Can be easily achieved with adding some MGK to any container (anywhere between 1–4), "magic barrier" until "casted upon."
- Priority: P3 — extends existing container design with a mana decision; low-effort extension of an existing pattern.
- Type: Feature
- Effort: S | Gain: M


### [SHOP-BOOST] Content: Expand shop 1-coin boost item pool
- Add more Common boost items with +x/-x stat tradeoffs to the shop's 1-coin pool — e.g., +1 ATK / -1 LCK, +1 STA / -1 HP.
- Currently the cheap shop tier is thin; players cycling the shop repeatedly see the same options.
- Priority: P3 — shop feel; content gap but not release-gating
- Type: Improvement
- Effort: S | Gain: M

### [NECRO-PROP] Content: Necropolis prop variety — more atmospheric non-combat encounters
- Add more prop encounter rows to Shrouded Necropolis — the area is combat-dense and could use quiet/atmospheric beats to contrast the final boss buildup.
- Priority: P3 — emotional counterweight per DESIGN.md; a cluster of brutal encounters needs at least one moment of stillness
- Type: Improvement
- Effort: S | Gain: M

### [NAME-QUAL] Texts: Generator name rolls quality pass
- Revise name generation to avoid "unliving" words on living enemies; consider adding actual proper names in Rosabel-style tone — believable styling takes priority over stat matching.
- Priority: P3 — tonal immersion; name mismatch breaks the register
- Type: Improvement
- Effort: S | Gain: M

### [CURSE-REFAC] Improvement: Curse refactor — better branching per stat type
- Curses should have branching button options matched to the stat they affect — e.g., "Howling Wind" endure should not share the action button with INT-based curses.
- Priority: P3 — mechanical consistency; curses currently all feel the same
- Type: Improvement
- Effort: M | Gain: M

### [COLOR-BLIND] Accessibility: Colorblind-safe crit/success zones
- Ensure crit and success zones on the action bar are distinguishable without color — brightness difference or pattern.
- Toggleable in menu
- Priority: P3 — accessibility; not gating beta
- Type: Improvement
- Effort: S | Gain: M

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
- Details: Source: Balance Designer + Game Design Lead + Competitive Player review 2026-05-20; see .perseus/2026-05-20-2120-luck-crit-zones.md. **Main-path formulas finalized 2026-05-20** (implemented): `critSuccessW = 2 + pLck * 0.625` (max at luck 8); `critFailW = 5 - rawLck * (rawLck < 0 ? 1.25 : 0.5)` (negative luck expands danger zone, cap 10 at luck −4). Hardcoded special-case fixes remain as a separate future pass. **Negative luck audit (future pass):** Every system where positive luck has a beneficial effect should have negative luck produce the opposite. Known candidates: `RarityManager.rollTier` (luck shifts rarity up — negative should shift toward Cursed/Common); `getWeightedLootIndex` (fishing loot quality); zone position blend in `action-config.js` (`luckBlend = pLck * 0.12` — currently clamped, negative luck should push zone toward a harder right-edge placement); container search width (`40 + pLck * 9` — negative luck should narrow the search zone). Pattern: find every `Math.max(0, pLck)` or `pLck * positiveCoeff` and decide whether unclamping is safe in that context.

### [SEQ-DELAY] Improvement: Sequential action display — delay 0.5s per log entry
- Add a 0.5s delay between log entries in multi-step action sequences; wait for effects to complete before re-enabling player input.
- Wrap the `logAction()` call chain in a `setTimeout` queue; 500ms between entries; block player input until the chain resolves; scope to multi-step sequences only — single actions stay instant.
- Priority: P3 — noticeably improves readability of multi-hit and multi-step sequences; S effort for real feel gain.
- Type: Improvement
- Effort: S | Gain: M

### [CURSE-SCALE] Improvement: Curse scaling — curse stats should affect action bar width
- Negative curse stat values should shrink the success zone — currently all curses are equally hard regardless of intensity. (`action-config.js`)
- Priority: P3 — curses with heavier stats should feel heavier; the existing difficulty system already supports this.
- Type: Improvement
- Effort: S | Gain: M

### [BAL-AUDIT] Quality Pass: Blind spots review — encounter types vs action-config vs action-resolver coverage
- Audit action-config.js and action-resolver.js for encounter types that have incomplete or inconsistent handling — buttons that silently pass/fail when they should have a dedicated case, or encounter types not covered by any special-case logic.
- Start by mapping all `types` values to their action-config branches; flag any type+button combos that fall through to the default stat calc without a intentional rationale.
- Priority: P3 — may surface silent balance bugs before beta; low urgency but high signal value
- Type: Question
- Effort: M | Gain: M
- Needs: Decide scope — full audit or just the recently-added encounter types?

### [UI-DIALOGS] Chore: Consolidate all dialog overlays into ui-dialogs.js
- Six modal overlays currently live in different files: QR share dialog (`social.js`), donate dialog (`social.js`, added 2026-06-02), leaderboard nickname (`score-manager.js`), companion name + player rename (`ui-effects.js`), and slot swap (`inventory-manager.js`). Extract all into a single ui-dialogs.js with a consistent open/confirm/cancel pattern, loaded after ui-effects.js.
- Priority: P3 — no user-visible impact; purely internal cleanliness
- Type: Chore
- Effort: S | Gain: S

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

## P4 — Nice to Have

### [SOUL-GEM] Content: Legendary soulgem — physical damage to spirits
- Unique Legendary item enabling physical damage against spirit-type enemies.
- Priority: P4 — niche mechanic; not enough demand to justify the slot now
- Type: Feature
- Effort: S | Gain: S

### [FISH-LOOT] Content: Bloat fishing loot — items, threats, floating altars
- Add variety to fishing encounter pool: items, threats, traps, floating altars.
- Priority: P4 — fishing is functional; this is content depth
- Type: Feature
- Effort: S | Gain: S

### [SPIRIT-ENEMY] Content: Add spirit/reflective enemies to Village and River
- Spirit and reflective types underrepresented in early/mid areas.
- Priority: P4 — content variety
- Type: Feature
- Effort: S | Gain: S

### [LATE-PETS] Content: New late-game pets
- Drowned spirit, scared ghost, living mushroom, talking fly — flavor + occasional LCK, rarely +1 ATK.
- Priority: P4 — content; fun but not blocking
- Type: Feature
- Effort: S | Gain: S

### [TRAP-VAR] COntent: More positive and negative traps + curses (all variants)
- Stat-swap traps, -ATK curses in late game, containers costing STA/LCK, lategame curses stealing mana/STA, practice target variants for Speak/Cast (with option to leave), magic items that almost always carry a curse.
- Priority: P4 — content variety; not blocking
- Type: Feature
- Effort: M | Gain: S

### [MEADOW-ENCNTR] Content: Meadows — increment no-effect encounters
- Add no-effect altars, observations, clear sky, silent overcast encounters.
- Priority: P4 — atmosphere; not blocking
- Type: Feature
- Effort: S | Gain: S

### [FOOD-PERMA] Content: Lemon-unique foods — perma boosts per area
- 1 good + 1 bad perma-boost food per area; mixed stat foods (lose and gain simultaneously); ensure bad foods in all areas.
- Priority: P4 — content depth
- Type: Feature
- Effort: S | Gain: S


### [ORIG-PET] Content: Origin that begins with a pet companion
- Add an origin whose starting condition places a specific pet emoji in `playerPartyString` at run start — e.g., a Shepherd origin that starts with 🐕.
- Achievable via `_doNewGame()` in `menu.js` with minimal changes; see [ORIG-ITEMS] for the same pattern applied to starting items.
- Priority: P4 — fun flavor origin; very low effort but post-beta content.
- Type: Feature
- Effort: XS | Gain: M

### [ORIG-ITEMS] Content: Origins with starting items
- Origins that begin the run with a Legendary item already equipped.
- Priority: P4 — fun flavor mechanic; easier than it looks — see `_doNewGame()` in `menu.js`.
- Type: Feature
- Effort: S | Gain: M
- Details: Earlier note confirmed this does NOT require the full inventory expansion — `_doNewGame()` in `menu.js` handles run-start state directly.

### [NECRO-OPT] Content: Necropolis optional areas
- Optional sub-areas for late-game variety inside Shrouded Necropolis.
- Priority: P4 — content; post-beta
- Type: Feature
- Effort: L | Gain: M
- Needs: Define what optional areas look like and how they gate before designing.

### [BOSS-TOLL] Improvement: Boss death counter — show area death toll on boss kill
- On killing an area boss, display how many times the player died in that area before the kill — e.g. "After 3 deaths in the Twisted Fairyland." Zero deaths gets its own line — e.g. "First blood. Somehow." Bosses are drawn from a pool per area, so the counter is per area, not per specific enemy.
- Track `areaDeathCount` (reset each area) in `gameOver()` keyed to current area; read and display on boss kill resolution in `action-resolver.js` or `game-loop.js`.
- Priority: P4 — polish; post-beta
- Type: Improvement
- Effort: S | Gain: L

### [INV-ITEMS] Content: New items for new inventory slots
- Review ideas for items to fill new inventory slots once the expand-inventory system ([INV-XPND] in EPICS.md) lands; clean out the ideas folder in the process.
- Priority: P4 — depends on P2 inventory expansion epic; no design yet
- Type: Idea
- Effort: S | Gain: S
- Needs: Define which slots exist and what item archetypes make sense before designing.

### [ALTAR-PRAY] Content: Altar — no stat bonus, Pray = XP
- A simple altar encounter where Pray grants XP with no stat effect.
- Priority: P4 — minor content addition
- Type: Idea
- Effort: XS | Gain: S

### [PROP-SPAWN] Idea: Hit prop once to spawn a small encounter
- Allow a single hit/touch on a Prop to attempt (% roll) spawning a small encounter — push a copy of the prop forward to reoccur after the small encounter.
- Priority: P4 — variant of the Camp type; interesting but low clarity
- Type: Idea
- Effort: S | Gain: S

### [KARMA-ITEM] Idea: Legendary item — negates bad karma effects
- A Legendary that offsets karma penalties — requires karma overhaul ([KARMA-OVR] in EPICS.md) to exist first.
- Priority: P4 — blocks on the karma system
- Type: Idea
- Effort: S | Gain: S

### [UNDEAD-RISE] Idea: Undead transformation — player killed by undead rises at 1HP
- Being killed by an undead enemy causes the player to rise as undead: 1 HP, half STA, skip death state; append 🧟 before player name; undead enemies deal 0 base ATK against the transformed player.
- Priority: P4 — interesting mechanic but significant state complexity
- Type: Idea
- Effort: M | Gain: M

### [DEF-STAT] Bug: Player DEF stat — wrong display, item support gaps, incorrect rarity
- Consolidate damage log message to a single message (not two as now — one for dmg, second for def) when player DEF is non-zero and had effect example "Hit by their attack -1💔 (1🔰)"; not all item types account for DEF; an item with DEF as its sole non-zero stat should resolve as Legendary (Artifact).
- Priority: ~P4 — user-deferred from P1; intentionally only two items with DEF stat, revisit post-beta.
- Type: Bug | Severity: Major
- Effort: S | Gain: L

### [QUEST-SPAWN] Bug: Quest system — brittle friend + quest item spawn logic
- Refactor to spawn friend and quest item independently in the story (not linked); hide exact item list from display (show general description only); keep matching logic internal.
- Priority: ~P4 — user-deferred from P2; "Good enough for Beta, seen it working well."
- Type: Bug | Severity: Major
- Effort: M | Gain: M

### [ENC-DEDUP] Bug: Duplicate encounter name within a single run — root cause unconfirmed
- Same enemy (Stray Whelp) observed twice in one run — once in a plain encounter, once in a generated house. `seenEncounters` dedup logic looks sound on paper; no regular code path found that bypasses it. Possible defense: on `run_continue`, backfill `seenEncounters` from already-queued `linesStory` rows (covers old saves that predate the field and any restore edge cases). Low gain because the symptom is rare and unrepro'd.
- Priority: P4 — rare, unrepro'd, L effort for S gain; monitor during beta.
- Type: Bug | Severity: Minor
- Effort: L | Gain: S

### [ACHIEV-TIME] Bug: Achievement timing — fix post-action logging delay hack
- Fix the timing hack for logging achievements after actions in `achievements.js`.
- Priority: P4 — Minor severity; workaround is stable for now.
- Type: Bug | Severity: Minor
- Effort: S | Gain: S

### [GEN-STATE] Chore: Generator state — clean up nextEncounter Generator-type logic
- Clean up hacky logic in nextEncounter for Generator types; ensure area transitions and seen tracking are robust. (`game-loop.js`)
- Priority: P4 — internal cleanliness; no user-visible impact.
- Type: Chore
- Effort: S | Gain: S

### [ACT-UPGRD] Chore: Action type cleanup — refactor or remove Upgrade type
- Refactor or remove the Upgrade action type if redundant. (`action-resolver.js`, `ui-render.js`)
- Priority: P4 — likely dead code; verify before removing.
- Type: Chore
- Effort: S | Gain: S

### [MAGIC-FNSH] Improvement: Magic finisher — refactor mercy logic for 1HP enemies
- Refactor the magic "mercy kill" logic for finishing enemies at 1 HP. (`action-resolver.js`)
- Priority: P4 — minor refactor, negligible user impact.
- Type: Improvement
- Effort: S | Gain: S

### [COIN-LOG] Improvement: Coin log formatting — replace string-split hack
- Replace brittle string-splitting for coin costs in `logging.js` with a structured data approach.
- Priority: P4 — brittle but stable; low impact if it breaks.
- Type: Improvement
- Effort: S | Gain: S

### [EMOJI-ASGN] Improvement: Emoji assignments — finalize unassigned types
- Finalize emoji for unassigned encounter types (🐅 > ⚔️ etc.) in `enemy-skills.js` and `action-resolver.js`.
- Priority: P4 — cosmetic consistency; XS effort.
- Type: Improvement
- Effort: XS | Gain: S

### [TEAM-RENDER] Chore: Team rendering — refactor hacky sort/render logic
- Refactor the team sorting/rendering in `ui-render.js` ("Hacky hacky hacky").
- Priority: P4 — internal cleanliness; S effort for S gain.
- Type: Chore
- Effort: S | Gain: S

### [BOSS-TELE] Feature: Wire boss_killed telemetry event
- Fire a `boss_killed` event via `TelemetryManager.send()` after boss kill resolution in `action-resolver.js`, alongside the existing `boss_kill` achievement check.
- Bosses are identified by "Boss-" prefix in `enemyBossType` (e.g. "Boss-Swift", "Boss-Undead").
- Payload: `boss_name` (enemy name), `boss_type` (e.g. "Boss-Swift"), `area` (playerArea), `run_number` (playerDestiny), `inventory` (playerLootString), `stats` {hp: playerHp, sta: playerSta, atk: playerAtk, mgk: playerMgk, def: playerDef, lck: playerLck, int: playerInt}.
- Priority: P3 - actually already tracked via achievements - who got how far, so chill out
- Type: Feature
- Effort: S | Gain: L

### [SCROLL-GAP] Bug: Intermittent mega-scrollable empty space appearing below page body
- Occasionally a large blank scroll area appears below the game UI — the page becomes scrollable to a large empty region that should not exist.
- iOS WebKit (Chrome/Safari on iPhone) has a known scroll-height doubling bug when `zoom` is applied to `<body>` — the scrollable area becomes 2× the content height, showing a grey blank region below.
- Root fix: `overflow:hidden` on body kills legitimate menu scroll on short screens. Proper fix likely needs `html { overflow:hidden; height:100% }` + `body { overflow-y:auto; height:100% }` to confine scroll to body as its own container, or replacing `zoom` with `transform:scale` on a wrapper div.
- Priority: P2 — visually breaks the page and is jarring on mobile; intermittent but reproducible.
- Type: Bug | Severity: Major
- Effort: ? | Gain: S

---

*Styx Flow complete — ~104 items processed*
