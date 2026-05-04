## Claude efficiency 101

- **/rename** [task] - e.g. 1 Tab for Logic & 1 For UI<br>
- **/compat** when done! (and will repeat in future)<br>
- **/clear** when one-time task completed

# Priority 0
- ME: Finish the game at least 3x, upload data to leaderboards, verify UI
- ME: Tweak ui - values reposition Rankings and Chronicles ui (list+detail)
- ME: complete the rest of the missing achievement unlocks
- ME: Increase HP for Fairyland enemies; they currently feel too "squishy" for a mid-game area.

# Claude
- imrpove corpse state presentation - keep og emoji, put 50% opacity overlay (skull/zzz) over it
- shop: buy buttons per base item base rarity - colored btns (cheapest = all, but big pool)
- add: chance for a special fishing drachma (limited to only one ever)
- mod: hold the delete button to show confirmation (just be updating the text "Hold for 3/2/1 sec..", cancel on release)
  - then confirm with another click as currently
- NEW: hardcoded "graveyard reminder" encounter after first and second boss - vague hints on the game story
  - fullscreen fade like when game start (or endgame) 
- ...
- fix: crit dodge boss heavy was not handled as crit
- fix: cursed enemy achiev to only pop when actually applied to an enemy (not when simply casting curse)
- ...
- NEW: Item/Origin increasing drop chances for higher than common rarity
- NEW: Item/Origin for bigger crit chance interval by ??%
- NEW: Item/Origin ⏳ Strange Hourglass - 10% slower action bar speed (global)
- More unique origins with actual gameplay implications
- New story progress unlockable: a portal to village? (Skip early game)
- ...
- Investigate: Negative friends - should simply decrement stats (opposite of friends), add some to lategame
- New Type: "Camp" spawn enemy on rest (actionLog it)...
  -  Related New: Camp-Grab spawn enemy on grab... (e.g. investigate tent, box etc.)
- New Type - Magic-container, cast to unlock - Contains item  (50% for artifact - same should already be for regular locked containers?)
- Adopt pet for item (similar to friend with quest items - give instead of speak), E.g. Give mouse/lizard to cat

# Manual
- ???

# Gemini
- read all files under ideas folder, check for opportunities for unique data (compare with actually used stuff in data folder), output to ideas/curated.csv
- [Bait] Flavour by name/description: Give e.g. the repeated many worms unique buffs (e.g., "Vigorous Worm" -> +5% Rarity chance).
- [Loot] Tiered Trash: Make "Trash" items usable (e.g., Wet Cash +1 Int for "deciphering" it).
- ...
- obscure wiki, bestiary for github (no exact info or nmbers, just hints) link via button in menu

# Hades
- add "Pseudo-Multiplayer Ghosts" - Hardcode 5-10 "Ghost" encounters in encounters.csv that represent "Past Players." They use random names from the highscore list (mocked if offline) and drop loot the players held on the time of their death (one of the items) when spoken to or defeated.
- add hidden stat visbility (karma, love, int, luck)  - introduce a rare encounter or a "Mirror" item that vaguely exposes the player's hidden statas through poetic descriptions. This turns the "hidden" stats into a mysterious, sought-after gameplay element, this encouter type should naturally fall at the end of each area (i think)
- full screen shake on crit interval hits (and more high-intensity global effects?)
- implement a basic "Low Health" and "Low Stamina" visual pulses (to show urgency when player resources are very low = 1)
- (possible only on android?) Add better vibration support to actionbar interactions:
   - vibrate on button press and release   
   - vibrate on transitioning between the fail/pass/crit zones
   - vibrate when taking damage, cannot effects etc?
   - use various vibration legth/pattern to match the related trigger 
- ...
- separrate bug report through a gform to a separate sheet, daily job to sync to github issues with tags
- Fix the very flaky "Quest system" - friends might require a "quest item" to exchange it for artifact, the quest firend + item spawn logic is brittle, I imagine better way like spawning the quest item somwehere in the story and the friend somewhere else - independent of the area, also would be great to hide the exact item list of the things the friend is looking for (keep it under the hood) and display just a general description of things they are looking for
- refactor curses to have better branchign and corresponding button options per the stats they affect: howling wind endure should give, the action button to trigger that should not be endure (taht is for int-based curses) - suggest
- update tutorial: include actionbar explanation, add/refactor encounters (but ensure proper skip when playing for the first time vs not), include crit suces/fail info, hint how luck and int works, hint story... + revise game tips
- better endings few variants (very dramatic/heart-breaking/satisfying), branching based on love (and karma?): kiss her goodnight, mercy kill her, undead together ever after, truly revive fixing the broken spell, world rots altogether... + create the corresponding achievs + save the game end type to the graveyard save data
- ...
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
- Add spirit/reflective to Village and River (might be nerfed in village e.g.)
- Add more positive AND negative traps (all variants) and curses
  - with stat swaps - swap x for y
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
- Programmer Art Upgrade: SVG Vector Engine
  - Create an `assets/img/vectors/` library of lightweight, animated SVG backgrounds for each area (e.g., flowing lines for River, jittery pulses for Necropolis)
  - Refactor `ui-render.js` to inject these as dynamic background layers.
  - All solid backgrounds should have shading, texts can be enhaced too, but no glow.
  - Resolve "programmers art" permanently with a professional, scalable, and cohesive aesthetic that feels "alive" and premium.

# Trash
- build a "Game Tip" system that triggers based on player state (e.g., first time dying, first time finding an Artifact, being low on Stamina). Uses the existing string-generator.js and ui-render.js toast system. 