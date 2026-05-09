## Claude efficiency 101

- **/rename** [task] - e.g. 1 Tab for Logic & 1 For UI<br>
- **/compat** when done! (and will repeat in future)<br>
- **/clear** when one-time task completed

# Priority 0
- ME: Finish the game at least 3x, upload data to leaderboards, verify UI
  - Pay attention to action chances and outcomes
  - Check score calcualation - does it make sense?
  - Summon fishing boss (curse), kill it to get drachma (then do it again and see if it errors out, also do it in another sesh to see if another drachma pops)
- ...
- ME: Tweak ui - values reposition Rankings and Chronicles ui (list+detail)
- ME: complete the rest of the missing achievement unlocks
- ME: Increase HP for Fairyland enemies; they currently feel too "squishy" for a mid-game area.

---

# Claude
- fade wit text when fining invitation/letter - does it work??

# Manual
- ???

# Gemini
- ???

# Hades
- improve generator/story structure (+gameplay if needed)
- more unlockables/everlasting progression
- easy interactivity expand? branching routes/crossoroads - select one way? (inscryption-style)

# Ideas zone

## Unique items/origins
- Legendary item allowing to physically damage spirits (soulgem)
- new items to the new slots (check ideas and remove them once and for all)
- NEW: Item/Origin increasing drop chances for higher than common rarity
- NEW: Item/Origin for bigger crit chance interval by ??%
- NEW: Item/Origin ⏳ Strange Hourglass - 10% slower action bar speed (global)
- More unique origins with actual gameplay implications
- (Already done with the gate!?) New story progress unlockable: a portal to village? (Skip early game)
- Groom origin with unique pwer/effect?
- Origins with starting items (Legendary?)
- Legendary negating bad karma
- JS spaghetti monster joke boss - when, how? after Hanging out in Menu for 5 minutes with live char?

## Refined mechanics
- Minimize 1-click encounters (Friend, puzzle, etc.) — use `encounterUsed` to stand around and do something
- LUCK: Add some actual reason for encounters/enemies LCK stat (i think it does nothing now)
  - it could possibly counter the players LCK to lower their crit chances and such?
  - luck - or + could affect the fishing spot chances (interval sizes)
  - other ideas?
- Altar with no bonus attribute, pray = get exp
- Killed by undead, become undead  with 1hp, 1/2 sta, skip death state (until fully killed)
  - Append zombie emoji before 🧟 John Doe (Undead)
  - undead then have 0 base attack against you
- pinata positive trap: grab should be all red, block should be all red, rest should be easy as prop, avoid should be walk
- ...
- add more hidden sta visbility opportunities (karma, love, int, luck)  - introduce a rare encounter or a "Mirror" item that vaguely exposes the player's hidden statas through poetic descriptions. This turns the "hidden" stats into a mysterious, sought-after gameplay element, this encouter type should naturally fall at the end of each area (i think)
- refactor curses to have better branchign and corresponding button options per the stats they affect: howling wind endure should give, the action button to trigger that should not be endure (taht is for int-based curses) - suggest
- Hit prop once (one chance only) to try spawning small (remember to push copy of the prop forward)
  - kinde variant to the proposed "camp" encounter type
- Investigate: Negative friends - should simply decrement stats (opposite of friends), add some to lategame
- New Type: "Camp" spawn enemy on rest (actionLog it)...
  -  Related New: Camp-Grab spawn enemy on grab... (e.g. investigate tent, box etc.)
- New Type - Magic-container, cast to unlock - Contains item  (50% for artifact - same should already be for regular locked containers?)
- gameplay implications based on companions in the party
- Fix the very flaky "Quest system" - friends might require a "quest item" to exchange it for artifact, the quest firend + item spawn logic is brittle, I imagine better way like spawning the quest item somwehere in the story and the friend somewhere else - independent of the area, also would be great to hide the exact item list of the things the friend is looking for (keep it under the hood) and display just a general description of things they are looking for
- Adopt pet for item (similar to friend with quest items - give instead of speak), E.g. Give mouse/lizard to cat

## Visuals/platform-specific
- if stat over 5, display numeric - e.g. ❤️ 4/5
- VISUAL: Add "impact" frames when hitting (flash white) or being hit (red white) or getting tired (green fade out?) especially prominent when getting to 1 HP or 1/0 STA, make use of full screen shakes etc. (the existing render/effect toolkit should provid opportunities)
- VISUAL: Ensure the crit/success zones in the gradient are easily distinguishable for colorblind players (e.g., using different patterns or very
     distinct brightness levels).
- ANDROID: Add better vibration support to actionbar interactions:
   - vibrate on button press and release   
   - vibrate on transitioning between the fail/pass/crit zones
   - vibrate when taking damage, cannot effects etc?
   - use various vibration legth/pattern to match the related trigger
   + double check if this is really impossible on iOS? any chance to get a permission? 
- SOUNDS: Adding sounds effects and background music? (would that work for ios, android, mac and windows with no problems?)
- Follow up and complete the vector backgrounds for all areas, make it default
- Vectors/Emojis: support for "thing.svg" in the emoji column of encounters/story/origins
  - the vectors would be in assets/encounters, they should displsy same/very similar as any emojis so far
- support for https://slackmojis.com/ in emoji field (achiev/origin/emcounter/button)

## New mechanics
- add "Pseudo-Multiplayer Ghosts" - Hardcode 5-10 "Ghost" encounters in encounters.csv that represent "Past Players." They use random names from the highscore list (mocked if offline) and drop loot the players held on the time of their death (one of the items - roll item by emoji from local encounters.csv) when spoken to or defeated.
- Make Karma Matter! (between runs?)
  - make "Revive" interval based on karma (Todo in place)
  - Add a simple "Karma Hook" in action-resolver.js where "Speak" on aggressive enemies grants +1 karma, and "Attack" on neutral/friendly NPCs (checked via enemyAtk === 0) grants -2.
  - implement "Karma Standing" inspectable via a new encounter type Mirror. This encounter uses string-generator.js to provide poetic descriptions of the player's hidden karma.
  - Create a "Karma Decay" system where karma slowly trends toward 1 over multiple runs, preventing permanent "Evil" or "Saint" locks. Add "Mischievous" encounter variants that only trigger when karma < 0.
  - Acheivement: Reaching approx. (not sure about exact numbers) +10 or -10 karma unlocks permanent "Perks" or "Flaws" (Origins/Items.., or even mechanics?)
    - Positive milestones increase healing efficiency; negative milestones increase critical damage but decrease maximum stamina.
  - bad/good karma high numbers to have chance on twisting/blessing the loot? (additional post-spawn edit - visual and stats)
  - plus check what actions currently change karma, possibly adjust/expand
  - have meaningful impact, but not too punishing, with hints making it a bit more transparent
  - There should be proactive actions available to fix bad karma if players learn that they have bad standing
  - killing enemies that are agressive should be fine, putting to sleep aggresive enemies should be considered good deed, killing non aggressive enemies should be considered bad, attacking friends should be bad etc.... suggest more hooks to karma?
  - the good karma bonus encounter - available in player.skills.js - we should find a way to edit/rething trigger it sometimes (not only when revived, that might be very uncommon situation)
- Expand Inventory: consumables, items array
  - open on click loot/party bar?? (repalce buttons or overlay)
  - You have to swap items in slots chest, head, hands (validchests, validheads... - like valid baits) = Prevents stacking power fast
  - eat food only intentionally, dont force/ditch
 - make actions seem more sequential in the ui so that player can notice one by one - eg delay 0,5s each log display and wait for effects to complete before firing another and unlocking UI for player actions?
- Add game run modifiers? (unlock after special condition? activated trough Origins?)
  - Demons passive but...
  - Animals passive but...
  - ???
- ...
- take inspiration from:
  - https://pixeldungeon.fandom.com/wiki/Game_mechanics
  - https://pixeldungeon.fandom.com/wiki/Items
  - https://pixeldungeon.fandom.com/wiki/Enemies

## Social
- separrate bug report through a gform to a separate sheet, daily job to sync to github issues with tags

# Parking lot

## Data changes
- Bloat fishing loot with items and threats, traps, perhaps floating altars and such
- distinguish fishing and river area somehow
- ...
- Add spirit/reflective to Village and River (might be nerfed in village e.g.)
- new pets in mid/late game areas (drowned spirit, scared ghost, living mushroom, talking fly...)
  - mostly for flavour xp, but can actually ad lck or smth, very rarely +1 atk
- Add more positive AND negative traps (all variants) and curses
  - with stat swaps - swap x for y
- Curses with -1 atk (lategame)
- Practice target variants for speak, cast... option to leave
- Magic items in the game should almost always carry some curse
- Increment meadows data (praised bath, no-effect encounters)
  - No-effect altars, curses etc with just observations
  - Clear sky, silent overcast
- Trap-Big, Trap-Obstacle, Toxic, Hot, Reflective, Tough, Stingy... + bosses
  - Revise village data (traps, special enemies)
  - Revise fairyland data (special — Forest Fiend, various ghosts)
  - Revise river (all types, very lacking regarding all encounter types)
  - Revise necropolis (special, freezing/snowman)
  - Animated objects, flora, unusual shades, effects...
- Undead + vampires in fairyland and river (drowned zombie etc)
- Lemon-like unique foods with perma boosts (1 good, 1 bad per area)
  - Ensure bad foods in all areas
  - Mixed stats foods and items — lose and gain at the same time
- Touch lucky statue/chime etc... (positive traps?), Bubble bath...
- Containers/traps costing stamina/lck etc. — Thorny patch (more like this)
- Lategame traps/curses stealing mana/sta etc
- Necropolis optional areas

## New feature: Spells
- add new dynamic layout with spells
- change curse button to generic "📓 Spell"
- on click, overlay action buttons with list card with known spells (scrollable, max height to cover action buttons), row shows: emoji spell name: effect, cost
- dismiss button at the end of the list
- on click if enough mana (3) the spell cast begins (action bar)
  - on critical success = costs -1 mkg
  - on critical fail = apply spell to self (or special case: Harden = Deplete all stamina, Syphon = Just hurt yourself)
- player knows no spells until learning some, log on action: "Cannot cast any spells ...yet?"
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
- ...more?

# Playwright - Data Capture
- **Objective:** Create a high-fidelity "Flight Recorder" using Playwright/Chromium to bridge gameplay reality with AI interpretation.
- **Passive Monitoring:**
   - Initialize a passive session on localhost.
   - Use `page.exposeFunction` to hook into `logging.js` (`runLogAdd`) to stream game logs to the terminal/filesystem in real-time.
   - Implement a `MutationObserver` on `#id_card` and `#id_log` to trigger snapshots only when the UI state actually shifts, reducing data noise.
- **Data Capture:**
   - On every significant event (touch/click/scroll or log entry), capture a UI snapshot (HTML) and a Screenshot.
   - Generate a "Semantic State" dump: a text-based (YAML/JSON) representation of visible elements for context-efficient AI analysis.
- **The Ritual Shutdown:**
   - Create a bash script (`playtest.sh`) to manage the session.
   - On `SIGINT` (Ctrl+C), cleanly halt the browser and prompt the user for a "Post-Mortem" summary of their intent and findings.
   - Organize all artifacts into a timestamped folder (`/playtests/YYYY-MM-DD_HH-MM/`) for Claude/Gemini ingestion.

# Playwright - Automated Run
- Playwright Bot: open a playwright session against live page to capture controls setup a bot that can decide correct actions to resolve the encounters and complete the game

# Technical Debt & Refactoring
- **Logic & Balance**
  - [ ] **Curse Scaling:** Make curse stats (negative values) affect the action bar success width. Currently, all curses are equally hard regardless of intensity. (`js/action-config.js`)
  - [ ] **Karma Scaling:** Revise the reincarnation bonus threshold. Currently, any positive karma gives the same reward; should scale or have tiers. (`js/player-skills.js`)
  - [ ] **Enemy Defense:** Ensure `enemyDef` is handled in all player skill calculations, including consumables. (`js/player-skills.js`)
  - [ ] **Magic Finisher:** Refactor the "mercy" logic for finishing enemies with 1 HP using magic. (`js/action-resolver.js`)

- **Architecture & Extensibility**
  - [ ] **Generator State:** Cleanup the hacky logic in `nextEncounter` for "Generator" types to ensure area transitions and "seen" tracking are robust. (`js/game-loop.js`)
  - [ ] **Boss Type Tracking:** Replace the `enemyBossType` global hack with a cleaner state management approach. (`js/encounter-loader.js`)
  - [ ] **Action Type Cleanup:** Refactor or remove the "Upgrade" action type if it's redundant. (`js/action-resolver.js`, `js/ui-render.js`)

- **UI/UX & Visuals**
  - [ ] **Sharing System:** Fix the screenshot capture logic. Ensure buttons are hidden during capture and the full log is visible without clipping. (`js/menu.js`)
  - [ ] **Coin Log Formatting:** Replace the brittle string-splitting hacks for coin costs in the log with a structured data approach. (`js/logging.js`)
  - [ ] **Button Polish:** Invent a new "Perk" or state to replace the placeholder "Pain" label on the rest button. (`js/ui-buttons.js`)
  - [ ] **Emoji Polish:** Finalize emoji assignments for unassigned types (🐅 > ⚔️ etc.). (`js/enemy-skills.js`, `js/action-resolver.js`)

- **Internal Hacks**
  - [ ] **Achievement Timing:** Fix the timing hack for logging achievements after actions. (`js/achievements.js`)
  - [ ] **Team Rendering:** Refactor the "Hacky hacky hacky" team sorting/rendering logic. (`js/ui-render.js`)

# Trash
- build a "Game Tip" system that triggers based on player state (e.g., first time dying, first time finding an Artifact, being low on Stamina). Uses the existing string-generator.js and ui-render.js toast system. (Would only appear for easy/story difficulty, can reuse achievement toasts)