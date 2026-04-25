# Proposed js/ File Structure

No build tools. No ES modules. Each file is a plain `<script>` tag in `_layouts/default.html`.
All files share one global scope — earlier files declare globals, later files consume them.
Load order is the only dependency mechanism.

---

## Load Order & File Definitions

### 1. `js/config.js`
**Estimated size:** ~50 lines

**Objective:** Single source of truth for all compile-time constants. Nothing here changes
at runtime. Any file can safely read these values with no ordering concern beyond "load first".

**Defines:**
- `versionCode` — build/date stamp displayed in the UI
- `initialEncounterOverride` — dev override to start at a specific encounter index
- `isLocalhost()` — predicate used to gate dev-only features
- All color constants (`colorWhite`, `colorGold`, `colorRed`, `colorGray`, etc.)
- All symbol constants (`fullSymbol`, `emptySymbol`, `arrowSymbol`, `newline`, `narrowSpace`)

**Does not:** read or write any game state, touch the DOM, or call any other function.

---

### 2. `js/game-state.js`
**Estimated size:** ~130 lines

**Objective:** Declare every global variable that represents live game state. No logic —
just `var` declarations with initial values. Any file that needs to read or write game
state does so through these globals.

**Declares:**
- All `player*` stat variables (HP, Sta, Mgk, Atk, Def, Lck, Int, XP, Level, Karma, Love,
  Name, Number, LootString, PartyString, equipment symbol vars, status flags)
- Item type arrays (`attackTypes`, `validBaits`, `validRess`, `validBlades`, `castTypes`)
- Shop data arrays (`drachmaShop`, `drachmaCoin`, `drachmaPrize`, `gamblingLost`, `usedShopMessages`)
- All `enemy*` per-encounter variables (stats, deltas, display, flags)
- Encounter tracking vars (`encounterIndex`, `lastEncounterIndex`, `seenEncounters[]`,
  `seenLoot[]`, `linesStory[]`, `linesGenerator[]`, `linesLoot[]`, `isFishing`, etc.)
- Adventure log vars (`adventureLog`, `actionLog`, `adventureEncounterCount`, etc.)
- All DOM element reference vars (`areaUIElement`, `cardUIElement`, etc.)

**Does not:** contain any functions or logic.

---

### 3. `js/logging.js`
**Estimated size:** ~55 lines

**Objective:** All logging utilities — both the dev-only run log and the in-game adventure
log helpers. Kept separate so logging calls can be freely made from any file without
creating cross-file dependencies on large modules.

**Defines:**
- `initRunLog()` — initialize dev run log (localhost only)
- `runLogAdd()` — append entry to run log (localhost only)
- `downloadRunLog()` — export run log as JSON file (localhost only)
- `logPlayerAction()` — append a player action with emoji + message to `adventureLog`
- `logAction()` — generic append to `adventureLog`
- `logGenerator()` — log which generator was triggered (dev info)
- `getTime()` — format current time string for log stamps

---

### 4. `js/string-generator.js`
**Estimated size:** ~130 lines

**Objective:** All text generation that is purely functional — takes no game state input,
returns a string. Grouped here because none of these functions have side effects and they
are called from many different places.

**Defines:**
- `renameCharacter()` — prompt → `playerName` → `redraw()`
- `getFirstName()` — pick a random name from the full pool
- `getVitalName()`, `getSwiftName()`, `getFaithName()`, `getSorceryName()`,
  `getCleverName()`, `getHatredName()`, `getLuckyName()` — archetype-specific name generators
- `getGameTip()` — return a random gameplay hint string
- `getPoem()` — return a random poetic flavor line
- `getShopMessage()` — return a shop dialogue line, avoiding repeats via `usedShopMessages[]`

---

### 5. `js/data.js`
**Estimated size:** ~250 lines

**Objective:** Own everything related to loading, parsing, and querying the CSV data.
This is the game's bootstrap — the jQuery `$(document).ready()` entry point lives here.
Also owns all encounter selection and story-array mutation utilities.

**Defines:**
- `$(document).ready()` — fires the two `$.ajax()` CSV loads; registers click listeners
  after both complete
- `processStoryData()` — parse story.csv semicolons → `linesStory[]`; detect returning
  player; call `loadEncounter()` + `redraw()` to start the game
- `processEncounterData()` — parse encounters.csv → `linesGenerator[]` and `linesLoot[]`
- `getNextEncounterIndex()` — increment `encounterIndex`; call `gameEnd()` at story end
- `getUnseenLootIndex()` — return a random fishing loot index not in `seenLoot[]`
- `getRandomEncounter()` — filter `linesGenerator` by area / type / text / seen history;
  return a random matching CSV row string
- `pushEncounter()` — splice a new encounter row into `linesStory[]` at a given position
- `markAsSeen()` — add enemy name to `seenEncounters[]`
- `markAsSeenFishing()` — add loot index to `seenLoot[]`; persist to localStorage
- `resetSeenEncounters()` — clear `seenEncounters[]` on new run

---

### 6. `js/encounter.js`
**Estimated size:** ~500 lines

**Objective:** Everything involved in loading and generating encounters. Responsible for
translating raw CSV rows into the live `enemy*` global state the rest of the game reads.

**Defines:**
- `encounterRenew()` — reset all `enemy*` per-encounter vars to zero/null
- `loadEncounter()` — parse a CSV row and populate all `enemy*` vars; handle all encounter
  type branches (Generator, Container, Friend, Item, Trap, Curse, Dream, Fishing, Shop,
  Altar, Upgrade, Death); apply love/mask/possession special mechanics; build initial log message
- `generateNextEncounters()` — large switch (11+ generator IDs) that assembles 1–5
  future encounters in `linesStory[]` by calling `pushEncounter()` and `getRandomEncounter()`
- `generateRandomItem()` — thin wrapper calling `getRandomEncounter()` by loot type
- `drachmaeBuy()` — handle all shop transactions: deduct coins, dispatch by purchase type
  (Item / Artifact / Tarot / Gamble / Level), push resulting encounter

---

### 7. `js/enemy-skills.js`
**Estimated size:** ~380 lines

**Objective:** All functions that describe what an enemy does or what happens to an enemy.
No player state is written directly here — results are returned or passed back to callers.

**Defines:**
- `enemyRest()` — restore enemy stamina; animate
- `enemyStaminaChangeMessage()` — return true if attacking / false if resting; apply animation
- `enemyHit()` — apply damage to enemy; 25% crit syphon (🀄); animate; call `enemyKilled()`
  if HP reaches zero
- `enemyKilled()` — award XP; decrement karma; trigger next-encounter animation
- `enemyJoinedParty()` — add emoji to `playerPartyString[]`; award XP; increment karma
- `enemyKnockedOut()` — harmless KO with XP and variable karma
- `enemyDisengage()` — convinced to leave; increment karma
- `enemyGrabbedIntoLoot()` — small creature becomes a loot emoji
- `enemyKicked()` — return +2 stamina to player; call `enemyRest()`
- `enemyTurnAggressive()` — convert Friend to hostile; decrement karma
- `enemyDodged()` — log evasion message
- `enemyCastIfMgk()` — enemy spell: 33% reflect check (💠); apply damage to player;
  return true if cast occurred
- `enemyAttackOrRest()` — enemy turn decision: attack player if stamina available, else rest

---

### 8. `js/player-skills.js`
**Estimated size:** ~560 lines

**Objective:** All functions that describe what happens to the player — stat changes,
resource consumption, damage taken, item use, death, and reincarnation. The largest
non-action file; kept unified because all functions here write the same pool of `player*` globals.

**Defines:**
- `renewPlayer()` — reset all player stats to new-run defaults; call `initRunLog()`
- `playerGainXP()` — calculate XP from enemy stats × INT/type/level multipliers; log
- `playerRest()` — restore stamina/mana; tent/dream 33% bonus; call `playerCheckLevelUp()`
- `playerHeal()` — restore up to +2 HP at mana cost
- `playerGetStamina()` — restore stamina up to max
- `playerUseStamina()` — consume 1 stamina; 33% reflex refund
- `playerUseMagic()` — consume mana by amount
- `playerChangeStats()` — apply stat bonuses from items/encounters; update equipment
  symbol vars; log gains; advance to next encounter
- `playerConsumed()` — eat consumable: calculate HP/Sta gains; apply negative effect
  damage; pig morph special case
- `playerHit()` — take incoming damage; luck dodge; shield/bubble check; dispatch
  `gameOver()` or `playerReincarnate()`
- `playerUseItem()` — remove item from loot string; display effect
- `playerWaive()` — white flag surrender: −3 INT
- `playerReincarnate()` — increment life count; award karma artifact; reset stats;
  call `renewPlayer()`
- `playerCheckLevelUp()` — push Upgrade encounter if XP threshold met; animate; increment
  level; reset XP threshold
- `checkPlayerHasItem()` — search `playerLootString[]` for any item from a given array
- `sufferToxin()` — apply toxic damage on grab contact
- `procAbilityChance()` — check loot for a specific item; roll percentage chance

---

### 9. `js/ui-effects.js`
**Estimated size:** ~120 lines

**Objective:** All visual feedback and animation primitives. No game state is written here —
these functions are purely cosmetic side-effects triggered by game events.

**Defines:**
- `animateUIElement()` — central animation handler: adds/removes animate.css classes,
  supports looping and callbacks
- `curtainFadeInAndOut()` — full-screen overlay text animation for area transitions;
  sets area background image
- `setBackground()` — load area background image from assets
- `toggleUIElement()` — flip element opacity
- `displayEnemyEffect()` / `displayPlayerEffect()` — show emoji overlay on enemy/player card
- `displayEnemyCannotEffect()` / `displayPlayerCannotEffect()` — head-shake "cannot do this" animation
- `displayEnemyDodgeEffect()` — dodge animation on enemy
- `displayEnemyAttackEffect()` — attack animation on enemy
- `displayEnemyRestEffect()` — rest animation on enemy
- `displayPlayerGainedEffect()` — tada animation for player item/stat gain
- `displayPlayerRestedEffect()` — pulse animation for player rest
- `displayEffect()` — generic fade-out with message text

---

### 10. `js/ui-render.js`
**Estimated size:** ~360 lines

**Objective:** Everything that reads game state and writes it to the DOM as display text.
No game logic — pure "state → HTML" translation.

**Defines:**
- `redraw()` — update every DOM element: area header, enemy card (name/emoji/stats/type
  badge), player panel (stats/party/loot/level/XP bar), adventure log, action buttons;
  call `updateXPProgress()` + `adjustEncounterButtons()`
- `displayPlayerState()` — color-code and write player emotional state to `id_versus`
- `appendEnemyStats()` — build `●/○` symbol string for enemy HP/Sta/Atk/Mgk
- `decorateStatusText()` — format a colored stroked badge label string
- `updateXPProgress()` — set XP progress bar width as a percentage of `playerXPThreshold`

---

### 11. `js/ui-buttons.js`
**Estimated size:** ~420 lines

**Objective:** Own the full lifecycle of the 9 action buttons — what they say, whether
they are enabled, and what happens when clicked. Buttons and their event wiring are kept
together because they are the same concern: the interactive surface of the game.

**Defines:**
- `setButton()` — set a button's label text and text color
- `resetEncounterButtons()` — enable/disable and recolor all 9 buttons based on current
  player stamina / mana / HP levels
- `adjustEncounterButtons()` — large switch on `enemyType` that relabels buttons to
  match encounter context: Shop buy labels, Upgrade perk names, Fishing prompt,
  Death screen actions, Altar options, Container unlock, etc.
- Nine action closure vars — bind `resolveAction('button_attack')` etc. to named callbacks
- `registerClickListeners()` — attach jQuery `.click()` handlers to all 9 buttons with
  debounce delay; re-registers listeners after each encounter
- `removeClickListeners()` — detach all button click handlers between encounters
- `registerClickListenersTechnical()` — version label / level label click handlers;
  dev cheat code entry ("Mucho Dinero", "Poco Dinero", "Cleaner")

---

### 12. `js/social.js`
**Estimated size:** ~90 lines

**Objective:** All sharing, export, and external redirect functionality. Isolated here
because it has no game logic dependencies — it only reads completed `adventureLog` state
and formats strings for external consumption.

**Defines:**
- `generateCharacterShareString()` — format player stats + loot + party + time + karma
  into a shareable text block
- `generateCharacterLegend()` — full adventure log + share string combined
- `copyAdventureToClipboard()` — copy legend to clipboard; download as .txt; open in
  new window
- `redirectToTweet()` — open Twitter intent URL with character share string
- `shareLinkedIn()` — open LinkedIn share URL with article text
- `visitLinkedIn()` — open creator LinkedIn profile
- `redirectToFeedback()` — open Google Form feedback URL with last 50 log entries pre-filled

---

### 13. `js/action-resolver.js`
**Estimated size:** ~1730 lines

**Objective:** The core game loop. Contains `resolveAction()` and the complete dispatch
logic for all 9 player actions. This file intentionally stays large — all 9 branches
share local closure variables and the post-action tail; splitting them would create
false modularity with no real benefit.

Also owns the three encounter-flow helpers that actions call directly.

**Defines:**
- `resolveAction(buttonId)` — returns a click handler closure; contains the full switch
  dispatch across all encounter types for each of the 9 actions:
  - **ATTACK** (lines 1443–1617) — hit, blessing check, enemy cast, retaliation
  - **ROLL** (lines 1619–1846) — dodge or walk away; reincarnation on Death tile
  - **BLOCK** (lines 1848–1956) — reduce damage; type restrictions; shop gamble
  - **CAST** (lines 1958–2146) — magic damage; Reflective mirror; cook; incinerate
  - **PRAY** (lines 2148–2317) — heal; banish Spirit/Undead; Altar sacrifice
  - **CURSE** (lines 2319–2433) — weaken/polymorph; Demon backfire; Reflective reflect
  - **GRAB** (lines 2435–2843) — items; knockout; fishing; recruit; containers; coins
  - **SPEAK** (lines 2846–3014) — diplomacy; recruit; Friend quests; INT comparison
  - **SLEEP** (lines 3016–3140) — rest; level-up; Prop bonuses; Curse trigger; Dream wake
  - Post-action tail (lines 3141–3154) — fishing return; boss type restore; `redraw()`
- `getRandomFish()` — trigger fishing loot display via `loadEncounter()`
- `nextEncounter()` — mark enemy seen; boss defeat log; area transition animation;
  advance index; call `loadEncounter()` + `redraw()`
- `animateFlipNextEncounter()` — card-flip CSS animation before advancing

---

## Script Tag Load Order

In `_layouts/default.html`, replace the single `game_loop.js` tag with:

```html
<script src="/js/config.js"></script>
<script src="/js/game-state.js"></script>
<script src="/js/logging.js"></script>
<script src="/js/string-generator.js"></script>
<script src="/js/ui-effects.js"></script>
<script src="/js/ui-render.js"></script>
<script src="/js/enemy-skills.js"></script>
<script src="/js/player-skills.js"></script>
<script src="/js/data.js"></script>
<script src="/js/encounter.js"></script>
<script src="/js/social.js"></script>
<script src="/js/action-resolver.js"></script>
<script src="/js/ui-buttons.js"></script>
```

---

## Size Summary

| File | Est. Lines | Primary Concern |
|------|-----------|-----------------|
| config.js | ~50 | Constants only |
| game-state.js | ~130 | Global declarations only |
| logging.js | ~55 | Log utilities |
| string-generator.js | ~130 | Text generation |
| ui-effects.js | ~120 | Animation primitives |
| ui-render.js | ~360 | DOM rendering |
| ui-buttons.js | ~420 | Button labels, state, and click wiring |
| enemy-skills.js | ~380 | Enemy functions |
| player-skills.js | ~560 | Player functions |
| data.js | ~250 | CSV load + encounter queries |
| encounter.js | ~500 | Encounter load + generation |
| social.js | ~90 | Sharing + export |
| action-resolver.js | ~1730 | 9-action core loop |
| **Total** | **~4775** | |

`action-resolver.js` remains the largest file by design — it is one cohesive concern
(the player's turn) and splitting it would require passing shared local state across
file boundaries with no structural gain.
