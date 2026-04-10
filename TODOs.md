New core mechanic - Action Bar Minigame.

Implement an "action sucess/fail minigame" for all player action buttons:
- On button PRESS: show a floating bar UI (full width, above the buttons)
The bar displays a 0–100 range, "|" cursor auto-scrolls horizontally from 0→100→0 (ping-pong)
  speed. Speed and the pass/fail threshold range are calculated from current player stats vs 
  encounter stats (e.g. higher player skill = wider success window, faster cursor).
- The bar background uses a CSS gradient: green in the success zone, red outside it. The 
  success zone position and width are derived from the stat comparison.
- On button RELEASE: cursor stops. The cursor's position/value (0–100) is the the action attempt value. 
- Check if it falls in the success zone → pass or fail, feed the result into the existing 
  game-state action resolution logic.
- Encapsulate this entirely in /js/action-bar.js with: showActionBar(config), hideActionBar(), 
  getAttemptValue(). Config contains speed, successMin, successMax derived from game state. Style in /_sass consistent with existing UI.
- Write a pure function calcActionBarConfig(playerStats, encounterStats) in game-state.js that returns { speed, successMin, successMax } — expose it for input-handler to use. 
- success min and max is based on the player stats, encounters stats and its type:
  - successMin & successMax bonus random by Luck
  - Heavy = Stamina, hard to block
  - Swift = Stamina, hard to dodga
  - Spirit = Int, hard to hit physically
  - Undead = Sta, hard to block, hurts on grab
  - Tough = Attack, hard to deal physical damage
  - Small = Sta, Hard to catch grab
  - Food and items can be grabbed with no issues
  - ...applies to all type of enemies, traps, curses, altars...
  - for all player type actions calculate a meaningfull success interval
  - Ask when unsure
- Add visual polish: cursor snap animation on release, brief flash green/red based on outcome, 
then fade bar out. Test with min/max stat extremes to confirm thresholds feel fair.

---

unify and animate menu logo with animate.css

gkeep fixes?

---

add achievements:
- add achievements (challenges) popup to in game
- add achievement trigger logic check after action, remember unlocked locally
- achievement data: emoji, title, description, condition
- first batch of simple achievements
  - died for the first time
  - reincarnated for the first time
  - finished the game for the first time
  - killed your first enemy
  - killed 25 enemies
  - killed 50 enemies
  - killed your first boss
  - killed 5 bosses
  - killed 10 bosses
  - Discrovered area: (for all areas from story.csv, except Depths of Slumber, Fading Widlands, Auxiliary Space)

---

- Playwright Bot: open a playwright session against live page to capture controls setup a bot that can decide correct actions to resolve the encounters and complete the game

---

## Small Ideas (new PR)

- [ ] Legend phys dmg allowed to spirits (soulgem)
- [ ] Dark MGK cost int items
- [ ] Practice target variants for speak, cast... option to leave
- [ ] Pray with no bonus = get exp
- [ ] Boss wife disengage when calmed = NaN xp
- [ ] Cannot leave calm merciful bride, disengage NaN xp, calm bride (bonus atk-==atk, swap text)

## BIG OLD DATA PUSH (extra PR)

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

## Big Ideas

- [ ] 🪙 Drachmae options
  - [ ] Buy fishing bait/key?
  - [ ] Get coin: +enemy dmg, +enemy hp, +enemy sta?
- [ ] Drachmae for social interactions and feedback — add to log and tips
- [ ] JS spaghetti monster joke boss after endgame
- [ ] Negative friends — investigate
- [ ] Necropolis optional areas
- [x] Scrolling in log list
- [ ] Hit prop once to try spawning small (remember to go back)
  - [ ] Camp-Rest (Prop), spawn enemy on rest (log it)... camp-grab?
- [ ] No 1-click encounters (Friend, puzzle, etc.) — use `encounterUsed` to stand around and do something
- [ ] Adopt pet for item similar to friend (give instead of speak)
  - [ ] Give mouse/lizard to cat
- [ ] Magic-container door: only cast to unlock, locked/magic 50% for artifact otherwise item
- [ ] Stunning (empty sta when getting hit)
- [ ] Main menu layout + swap btn (start/continue/achievements/credits/feedback/changelog - PR list)
  - [ ] Achievements popup + list menu overlay
- [ ] Generate loot or consumable from kill/knockout (not in generators) — "They've dropped something"
- [ ] Food grab, food array, eat instead of speak; if food array not empty heal with latest food
  - [ ] Eat instead of speak → food eat or grab (if grab, offer eat later? pop food)
- [ ] Mischievous legendary on bad karma
- [ ] Hit/Dodge/Block minigame — tap > timer progress bar > hitzone