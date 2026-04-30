## Claude efficiency 101

- **/rename** [task] - e.g. 1 Tab for Logic & 1 For UI<br>
- **/compat** when done! (and will repeat in future)<br>
- **/clear** when one-time task completed

# Priority 0
**Redo Endings**
  * Fix the Flakiness: Remove the encounterIndex++ hacks. Instead of the game just "ending" when the story list runs out, create a resolveEnding() function.
  * The Bride as a Gateway: When the Bride is defeated or calmed, it will trigger a transition to a final "Decision" encounter.
  * Branching Choices: Based on your playerLove and playerKarma, the buttons will change to your specific endings: Kiss her goodnight, Mercy kill, Truly Revive, etc.

# Claude
- Legendary item increasing drop chances for higher than common rarity
- Legendary item for bigger crit chance interval by ??%
- (Aftifact) ⏳ Strange Hourglass - 25% slower action bar speed (global)
- More unique origins with actual gameplay implications
  - examples??? 
- new unlockable: a portal to fairyland
...
- Options Screen
   * Difficulty Picker: Easy = Easier action bar, altough lower drops; "Hardcore" = harder + no revive
      + new achiev for hardcore difficulty game completed
   * Report bug button: Simple redirect to the existing gform
   * Save Management: A clear "Reset Data" button with a confirmation popup.
...
- refine readme to be very cool, check for reference: mobile-toolkit, hades-gate
- Investigate: Negative friends - should simply decrement stats (opposite of friends), add some to lategame
- New Type: "Camp" spawn enemy on rest (actionLog it)...
  -  Related New: Camp-Grab spawn enemy on grab... (e.g. investigate tent, box etc.)
- New Type - Magic-container, cast to unlock - Contains item  (50% for artifact - same should already be for regular locked containers?)
- Adopt pet for item (similar to friend with quest items - give instead of speak), E.g. Give mouse/lizard to cat

# Manual
- encounters.csv: fairyland enemies toi little hp
- rm grind achievs??

# Low-repro bugs
- (check after ending refactor) Fix Boss wife disengage when calmed = NaN xp
- (check after ending refactor) Fix cannot leave calm merciful bride, if calm bride (check texts)

# Hades
- refactor curses to have better branchign and corresponding button options per the stats they affect: howling wind endure should give, the action button to trigger that should not be endure (taht is for int-based curses) - suggest
- update tutorial: include actionbar explanation, add/refactor encounters (but ensure proper skip when playing for the first time vs not), include crit suces/fail info, hint how luck and int works, hint story... + revise game tips
- better endings few variants (very dramatic/heart-breaking/satisfying), branching based on love (and karma?): kiss her goodnight, mercy kill her, undead together ever after, truly revive fixing the broken spell, world rots altogether... + create the corresponding achievs + save the game end type to the graveyard save data
...
- improve generator/story structure (+gameplay if needed)
- Minimize 1-click encounters (Friend, puzzle, etc.) — use `encounterUsed` to stand around and do something
- Make Karma Matter!
  - make "Revive" interval based on karma (Todo in place)
  - karma affects on action bar chances?
  - plus check, what changes karma, possibly adjust/expand
  - Mischievous encounters + bad drops/twisted legendaries on bad karma
  - should we make karma NOT reset between runs? (it could secretely affect the game)
     - It would need to be subtle/fair so that everyone does not have bad experience just because the have no clue, possibly there could be encounter, that exposes the "Soul Standing" and hints what it does
     - There should be proactive actions available to fix bad karma if players learn that they have bad standing
     - killing enemies that are agressive should be fine, putting to sleep aggresive enemies should be considered good deed, killing non aggressive enemies should be considered bad, attacking friends should be bad etc.... suggest more hooks to karma?
     the good karma bonus encounter - available in player.skills.js - we should find a way to trigger it sometimes (not only when revived, that might be very uncommon situation)
- Drachmae shop add more options - game run modifiers? (unlock after special condition?)
  - Get coin for negative effect: +enemy dmg/hp/sta...
  - Get coin for Big Karma--
  - Get coin for ???
- Inventory: consumable, items array
  - open on click loot/party bar?? (repalce buttons or overlay)
  - You have to swap items in slots chest, head, hands (validchests, validheads... - like valid baits) = Prevents stacking power fast
  - eat food only intentionally, dont force/ditch
 - make actions seem more sequential in the ui so that player can notice one by one - eg delay 0,5s each log display and wait for effects to complete before firing another and unlocking UI for player actions?

# Parking lot
- Take inspiration from: https://pixeldungeon.fandom.com/wiki/Main_Page
- Legendary negating bad karma
- +1 Drachmae for review/donate (one time)
- Hit prop once (one chance only) to try spawning small (remember to push copy of the prop forward)
  - kinde variant to the proposed "camp" encounter type
- Altar with no bonus attribute, pray = get exp
- Killed by undead, become undead  with 1hp, 1/2 sta, no death state, until fully killed
  - Append zombie emoji before 🧟 John Doe (Undead)
  - undead then have 0 base attack against you
- if stat over 5, display numeric - 4/5
- JS spaghetti monster joke boss when?
  - Hanging out in Menu for 5 minutes with live char?

## Data changes
- Curses with -1 atk (lategame)
- Legendary item allowing to physically damage spirits (soulgem)
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
- Ghosts etc in necro at least 1 atk; all enemies 3+ stamina, overall 2x longer (needs a lot of data!)
- Lemon-like unique foods with perma boosts (1 good, 1 bad per area)
  - Ensure bad foods in all areas
  - Mixed stats foods and items — lose and gain at the same time
- Touch lucky statue/chime etc... (positive traps?), Bubble bath...
- Bloat fishing loot with items and threats (traps?)
- Containers/traps costing stamina/lck etc. — Thorny patch (more like this)
- Lategame traps/curses stealing mana/sta etc
- Mid-late game balance = high stamina, more low atk enemies
  - Pets in fairyland a lot more sta ~3
  - Bosses to have a lot of hp but not insta-kill dmg
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

# Crazy ideas
- Multiplayer features
  - find other player corpse (with one of their items)
  - fight other players ghosts/zombies
  - these can be submitted to googleform similar to how highscore is handled

- Programmer Art Upgrade: SVG Vector Engine
  - Create an `assets/img/vectors/` library of lightweight, animated SVG backgrounds for each area (e.g., flowing lines for River, jittery pulses for Necropolis)
  - Refactor `ui-render.js` to inject these as dynamic background layers.
  - All solid backgrounds should have shading, texts can be enhaced too, but no glow.
  - Resolve "programmers art" permanently with a professional, scalable, and cohesive aesthetic that feels "alive" and premium.
