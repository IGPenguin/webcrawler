display main menu player progress preview also on "Really want to restart?" screen
unify and animate menu logo with animate.css
fix: fade animations timing getting broken after back to menu from game

/compact 

manual: fix drachmae buy price in log

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

## Needs Repro

- fix enemy recovered energy after killed (crazed goat)
- fix engaged a boss showing again and again each step for fished out boss

---

## Small Ideas (new PR)

- [ ] Pray with no bonus (altar) = get exp
- [ ] Fix Boss wife disengage when calmed = NaN xp
- [ ] Fix cannot leave calm merciful bride, if calm bride (check texts)
- Fix curse reflect (-attack) + add cast reflect (-health), fail on heal (-hp)
- Fix push iteam/artifact and/or drachma after fishing out a boss (after him)
- Fix add vertical scroll in loot/party when overflowimg

## Big Fixes
- Fix animations glitching playing when launching another one without the first finishing (bug in animation functions?)

## Big Ideas

- [ ] 🪙 Drachmae options
  - [ ] Buy fishing bait/key?
  - [ ] Get coin for netative effect: +enemy dmg/hp/sta...
- [ ] +1 Drachmae (one-time) for social interactions in credits
- [ ] Hit prop once (one chance only) to try spawning small (remember to push copy of the prop forward)
- [ ] New Type - Magic-container door, cast to unlock
    - locked/magic 50% for artifact otherwise item (same should be for basic locked containers)
- [ ] New Type: Camp spawn enemy on rest (log it)...
  -  Related New: Camp-Grab spawn enemy on grab... (e.g. investigate tent, box etc.)
- [ ] Minimize 1-click encounters (Friend, puzzle, etc.) — use `encounterUsed` to stand around and do something
- [ ] JS spaghetti monster joke boss when hanging out in credits for 30 sec
- [ ] Adopt pet for item similar to friend with quest item (give instead of speak)
  - [ ] Give mouse/lizard to cat
- [ ] Generate loot and consumable from kill/knockout — "They've dropped something"
- [ ] "Enemy Stunned" mechanic (empty sta when getting hit)
- [ ] Mischievous legendary/encounters on bad karma
- [ ] JS spaghetti monster joke boss when hanging out in credits for 30 sec

## BIG OLD DATA PUSH

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

## Automation

- Playwright Bot: open a playwright session against live page to capture controls setup a bot that can decide correct actions to resolve the encounters and complete the game

## Massive Ideas

- [ ] Inventory: consumable, items array

## Low-Prio Fixes

- Negative friends — investigate
- add tiny shading at the bottom of the ingame log
- fix: sessions list should not scale down when scrollable
