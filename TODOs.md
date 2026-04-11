## Action bar situations:

New cases:
- fail to pray "altar" = angered the spirits, receive inverted bonus (malus)
- grab "heavy" should be possible, but very very hard, on fail enrage enemy (+atk)
- fail to walk away from toxic/spiky = get hurt (same as grab) "accidentally fallen onto that" 
- fail to endure curse should give the curse effect (if negative)
  - chance to endure should be based on how high is the player stat that the curse affects
- fail when ditching item, threw it unnecessarily far -1 sta
- ...?

Low Prio:
- cast/heal/curse with no mana should be full 0% chance
- fail to speak "Gibberish", higher chance the lower player int is

Questionable:
- grabbing stingy enemy should be possible, but very hard
- when interacting with trap, the succes interval should be small, no pentalty if sucess

Legendary ideas:
- ⏳ Strange Hourglass - 25% slower action bar speed

---

## Top prio fixes
- manual: fix log when buy level up, test all options
- block repeteaded sleep when fishing on the same spot

---

## The Next Big Thing!

add achievements:
- add achievements (challenges) popup to in game
- add achievement trigger logic check after action, remember unlocked locally
- achievement data: emoji, title, description, condition
- first batch of simple achievements
  - died for the first time
  - reincarnated for the first time
  - accepted destiny
  - accepted destiny 10x
  - accepted destiny 25x
  - won a gamble for the first time
  - lost gamble for the first time
  - won gamble 10x
  - won gamble 25x
  - bought a tarto card for the first time
  - bought an item for the first time
  - bought an artifact for the first time
  - bought level up for the first time
  - spent 10 drachmae
  - spent 25 drachmae
  - finished the game for the first time
  - killed your first enemy
  - killed 10 enemies
  - killed 25 enemies
  - killed your first boss
  - killed 5 bosses
  - killed 10 bosses
  - killed 15 bosses
  - successful fishing
  - successful fishing 10x
  - successful fishing 25x
  - Discrovered area: (for all areas from story.csv, except Depths of Slumber, Fading Widlands, Auxiliary Spac
  - Touched Grass (grab prop with "Grass in name")

---

## Feature enhancement

Action bar critical success/fail intervals
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

---

## Lower Prio Fixes

- fix enemy recovered energy after killed (crazed goat)
- fix engaged a boss showing again and again each step for fished out boss
- change all "button_pray" references to "button_heal"
  - ensure that pray logic affects pray action and not heal action

---

## Small Ideas (new PR)

- session detail, Feedback, Share/Download
- karma affects on action bar chances
  - plus check, what changes karma, possibly adjust/expand
- [ ] Pray with no bonus (altar) = get exp
- [ ] Fix Boss wife disengage when calmed = NaN xp
- [ ] Fix cannot leave calm merciful bride, if calm bride (check texts)
- Fix curse reflect (-attack) + add cast reflect (-health), fail on heal (-hp)
- Fix push iteam/artifact and/or drachma after fishing out a boss (after him)
- Fix add vertical scroll in loot/party when overflowimg
- if stat over 5, display numeric - 4/5

- killed by undead, become undead  with 1hp, 1/2 sta, no death state, until fully killed
  - 🧟 John Doe (Undead)
  - undead then have 0 base attack abainst you

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
- Rebalance drops vs enemy stats? (too easy if you pivkup everything)
- [ ] JS spaghetti monster joke boss when hanging out in credits for 30 sec

## Spells

New Feature: spell & scrolls
- change curse button to generic "📓Spell"
- on click, action buttons overlay with known spells list (scrollable, max height to cover action buttons), row shows: emoji spell name: effect, cost
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

## Automation

- Playwright Bot: open a playwright session against live page to capture controls setup a bot that can decide correct actions to resolve the encounters and complete the game

## Massive Ideas

- [ ] Inventory: consumable, items array

## Low-Prio Fixes

- Negative friends — investigate
- add tiny shading at the bottom of the ingame log
- fix: sessions list should not scale down when scrollable
