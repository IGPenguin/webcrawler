## Efficiency checks:

/rename <task>
/compat when done! (and will repeat in future)
/clear when one-time task completed

logAction("🧩 ▸ 🎉 <b>New Memory:</b> (achiev-name))

✅ Saved as a skill in Claude memory
Add a new achievement in 4 steps:
  1. Add { id, emoji, desc } to ACHIEVEMENTS in achievements.js
  2. Add a stat counter to _defaultStats if needed
  3. Add a case in check() that increments the stat and calls _unlock(id)
  4. Call AchievementManager.check('trigger_name') from the right game file

  - Suggest more unique/memorable ones
    - Killed each enemy type
    - Died by trap
    - Died by each enemy type 

---

## High Score

Score = level+1, enc count /10, pets/recruits+1, stats +1, karma +/-, complete game +100
- display at: dead/game end, menu char preview, session history
- put "Best Character" (highest score) at the top of the session history

----

## Action bar enhancement: critical success/fail

- add critical success and critical failure (very) slim intervals to action bar (not present when player has 0 stamina to do the action - if it requires sta)
- crit success:
  - attack = extra 1 dmg
  - dodge/block = no stamina use
  - cast = extra 1dmg
  - heal = extra 1 hp healed
  - curse = extra -1 atk to enemy
- crit fail:
  - attack = hurt/exposed yourself -1 dmg
  - dodge/block = spend extra 1 sta
  - cast = hit yourself 1 dmg
  - heal = heal enemy
  - curse = curse yourself
- Legendary for bigger crit chance interval

---

## Karma update

- Make Karma Matter!
  - make "Revive" interval based on karma (Todo in place)
  - on revive, get back to live (last encounter) with 1 HP
  - karma affects on action bar chances?
  - plus check, what changes karma, possibly adjust/expand
  - Mischievous encounters + bad drops/twisted legendaries on bad karma

---

## Lower-Repro Fixes

- Fix Boss wife disengage when calmed = NaN xp
- fix enemy recovered energy after killed (crazed goat)
- fix engaged a boss showing again and again after each action after fishing gives a boss
- Fix cannot leave calm merciful bride, if calm bride (check texts)
- Fix curse reflect (-attack) + add cast reflect (-health), fail on heal (-hp)
- Fix push iteam/artifact and/or drachma after fishing out a boss (after him)
- Fix add vertical scroll in loot/party when overflowimg

---

## Small Ideas (new PR)

- Legendary negating bad karma
- +1 Drachmae for review (one time)
- Hit prop once (one chance only) to try spawning small (remember to push copy of the prop forward)
- Altar with no bonus attribute, pray = get exp
- Manual: killed by undead, become undead  with 1hp, 1/2 sta, no death state, until fully killed
  - Append zombie emoji before 🧟 John Doe (Undead)
  - undead then have 0 base attack abainst you
- if stat over 5, display numeric - 4/5
- JS spaghetti monster joke boss when?
  - Hanging out in Menu for 5 minutes with live char?

## New Feature: Spells

add new dynamic layout with spells
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

## Big Ideas

- Keep corpses, do not navigate right away
  - Chance to rest etc.
- Inventory: consumable, items array
  - open on click loot/party bar
  - You have to swap items in slots chest, head, hands (validchests, validheads... - like valid baits)
    - Prevents stacking power fast
  - eat food intentionally

- Generate loot and consumable from kill/knockout 
  - "They've dropped something"
- Drachmae shop add options (unlock after special condition)
  - Get coin for negative effect: +enemy dmg/hp/sta...
  - Get coin for Big Karma--
  - Get coin for ???
- New Type - Magic-container, cast to unlock
    - Contains item  (50% for artifact - same should be for regular locked containers)
- New Type: Camp spawn enemy on rest (actionLog it)...
  -  Related New: Camp-Grab spawn enemy on grab... (e.g. investigate tent, box etc.)
- Minimize 1-click encounters (Friend, puzzle, etc.) — use `encounterUsed` to stand around and do something
- Adopt pet for item (similar to friend with quest items  
  - give instead of speak)
  - E.g. Give mouse/lizard to cat
- Rebalance drops vs enemy stats? (too easy if you pivkup everything)
- (Aftifact) ⏳ Strange Hourglass - 25% slower action bar speed


## BIG OLD DATA PUSH

- Curses with -1 atk (lategame)
- [ ] Legendary item allowing to physically damage spirits (soulgem)
- [ ] Practice target variants for speak, cast... option to leave
- [ ] Magic items in the game should almost always carry some curse
- [ ] Increment meadows data (praised bath, no-effect encounters)
  - [ ] No-effect altars, curses etc with just observations
  - [ ] Clear sky, silent overcast
- [ ] Trap-Big, Trap-Obstacle, Toxic, Hot, Reflective, Tough, Stingy... + bosses
  - [ ] Revise village data (traps, special enemies)
  - [ ] Revise fairyland data (special — Forest Fiend, various ghosts)
  - [ ] Revise river (all types, very lacking regarding all encounter types)
  - [ ] Revise necropolis (special, freezing/snowman)
  - [ ] Animated objects, flora, unusual shades, effects...
- [ ] Undead + vampires in fairyland and river (drowned zombie etc)
- [ ] Ghosts etc in necro at least 1 atk; all enemies 3+ stamina, overall 2x longer (needs a lot of data!)
- [ ] Lemon-like unique foods with perma boosts (1 good, 1 bad per area)
  - [ ] Ensure bad foods in all areas
  - [ ] Mixed stats foods and items — lose and gain at the same time
- [ ] Touch lucky statue/chime etc... (positive traps?), Bubble bath...
- [ ] Bloat fishing loot with items and threats (traps?)
- [ ] Containers/traps costing stamina/lck etc. — Thorny patch (more like this)
- [ ] Lategame traps/curses stealing mana/sta etc
- [ ] Mid-late game balance = high stamina, more low atk enemies
  - [ ] Pets in fairyland a lot more sta ~3
  - [ ] Bosses to have a lot of hp but not insta-kill dmg
- [ ] Necropolis optional areas

---

## Crazy Ideas

- Multiplayer features
  - highscores via github actions
  - free github server (use json)
  - push/get data: highscore #, achievs %
  - (ULTRA) find other player corpse (with one of their item), fight other players ghosts/zombies

- Smart pets
- Mount

## Automation

- Playwright Bot: open a playwright session against live page to capture controls setup a bot that can decide correct actions to resolve the encounters and complete the game

## Refactor

- change all "button_pray" references to "button_heal"
  - ensure that pray logic affects pray action and not heal action

---

## Low-Prio Fixes

- Negative friends — investigate
- add tiny shading at the bottom of the ingame log
- fix: sessions list should not scale down when scrollable
