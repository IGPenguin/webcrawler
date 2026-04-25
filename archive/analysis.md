# game_loop.js — Section Map

Monolithic file (~4800 lines). All sections share a single global scope; no modules, no imports.

| # | Section | Lines | Purpose | Key State Read/Written |
|---|---------|-------|---------|------------------------|
| 1 | Version & Debug Config | 1–8 | `versionCode`, `initialEncounterOverride`, `isLocalhost()` | `versionCode`, `initialEncounterOverride` |
| 2 | Color & Symbol Constants | 10–16 | 40+ UI color vars, display symbols (`fullSymbol`, `emptySymbol`, `arrowSymbol`, `newline`, `narrowSpace`) | Read-only constants |
| 3 | Run Log State | 14–17 | Localhost-only dev logging vars | `runLog[]`, `runLogStart` |
| 4 | localStorage Init | 18–22 | Read `'coins'` into `savedCoins`; write 0 if NaN | `savedCoins`, localStorage `'coins'` |
| 5 | Player Stat Declarations | 24–79 | All player variable declarations: HP/Sta/Mgk/Atk/Def/Lck/Int/XP/Level/Karma/Love/Name/Loot/Party/Equipment symbols; item type arrays (`attackTypes`, `validBaits`, `validRess`); shop arrays (`drachmaShop`, `drachmaCoin`, `drachmaPrize`) | All `player*` globals |
| 6 | `renewPlayer()` | 81–119 | Reset all player stats to new-run defaults; call `initRunLog()` | Writes all `player*` globals |
| 7 | Encounter Globals | 121–149 | Encounter state declarations + DOM element references | `storyData`, `linesStory/Generator/Loot`, `encounterIndex`, `seenEncounters[]`, all `id_*` DOM refs |
| 8 | `renameCharacter()` | 153–165 | Prompt → `playerName` → `redraw()` | `playerName` |
| 9 | Name Generation | 168–254 | `getFirstName()` + 7 archetype name generators (`getVitalName`, `getSwiftName`, `getFaithName`, `getSorceryName`, `getCleverName`, `getHatredName`, `getLuckyName`) | None (pure generators) |
| 10 | Flavor Text | 256–282 | `getGameTip()` (50+ tips), `getPoem()` (20+ poems), `getShopMessage()` (tracks `usedShopMessages[]`) | `usedShopMessages[]` |
| 11 | Adventure Log State | 278–283 | Log string vars | `actionString`, `actionLog`, `adventureLog`, `adventureEncounterCount`, `adventureEndReason` |
| 12 | Enemy Variable Declarations | 285–320 | All per-encounter enemy vars: stats, deltas, display, flags | All `enemy*` globals |
| 13 | `encounterRenew()` | 321–340 | Reset all per-encounter state to zero/null | All `enemy*` globals |
| 14 | CSV Loading Bootstrap | 343–364 | jQuery `$(document).ready()` → two `$.ajax()` calls for `story.csv` and `encounters.csv` | Triggers `processStoryData()`, `processEncounterData()` |
| 15 | `processStoryData()` | 367–405 | Parse story.csv semicolons → `linesStory[]`; returning-player check; call first `loadEncounter()` + `redraw()` | `linesStory[]`, `savedCoins` |
| 16 | `processEncounterData()` | 408–428 | Parse encounters.csv → `linesGenerator[]` (all) and `linesLoot[]` (Fishing-type rows only) | `linesGenerator[]`, `linesLoot[]` |
| 17 | `getNextEncounterIndex()` | 430–439 | Increment `encounterIndex`; call `gameEnd()` when story exhausted | `encounterIndex` |
| 18 | `getUnseenLootIndex()` | 441–452 | Random fishing loot index not yet in `seenLoot[]` | `seenLoot[]`, `linesLoot[]` |
| 19 | `getRandomEncounter()` | 454–524 | Filter `linesGenerator` by area/type/text/seen; return random matching row | `linesGenerator[]`, `seenEncounters[]` |
| 20 | `pushEncounter()` | 526–534 | Splice a new encounter row into `linesStory[]` at a given index | `linesStory[]` |
| 21 | `markAsSeen()` / `markAsSeenFishing()` | 536–546 | Track seen enemy names; write `seenLoot` JSON to localStorage | `seenEncounters[]`, `seenLoot[]`, localStorage `'seenLoot'` |
| 22 | `resetSeenEncounters()` | 548–550 | Clear `seenEncounters[]` on new run | `seenEncounters[]` |
| 23 | `loadEncounter()` | 553–777 | Parse CSV row → populate all `enemy*` vars; handle Generator/Container/Friend/Item/Trap/Curse/Dream type branches; apply love/mask/possession special mechanics; build log message | All `enemy*` globals, `adventureLog` |
| 24 | `generateRandomItem()` | 779–784 | Thin wrapper → `getRandomEncounter()` by loot type | None directly |
| 25 | `drachmaeBuy()` | 786–838 | Shop transactions: deduct coins; dispatch by type (Item/Artifact/Tarot/Gamble/Level); push resulting encounter | `savedCoins`, `spentCoins`, `playerLootString[]` |
| 26 | `generateNextEncounters()` | 840–1038 | Large switch (11+ generator IDs) assembling 1–5 future encounters via `pushEncounter()` based on generator type | `linesStory[]` via `pushEncounter()` |
| 27 | `redraw()` | 1041–1371 | Update every DOM element: area header, enemy card (name/emoji/stats/type badge), player panel (stats/party/loot/level/XP), adventure log, action buttons; call `updateXPProgress()` + `adjustEncounterButtons()` | Reads all `player*` and `enemy*` globals; writes DOM |
| 28 | `displayPlayerState()` | 1373–1384 | Color-code and display player emotional state in `id_versus` | `id_versus` DOM element |
| 29 | `appendEnemyStats()` | 1386–1409 | Build `●/○` symbol string for enemy HP/Sta/Atk/Mgk | `enemy*` stat globals |
| 30 | `decorateStatusText()` | 1411–1414 | Format a colored stroked badge/label string | None |
| 31 | `updateXPProgress()` | 1416–1421 | Set XP progress bar width as percentage of `playerXPThreshold` | `playerXP`, `playerXPThreshold`, `id_xp_progress` DOM |
| 32 | `resolveAction()` — ATTACK | 1443–1617 | Hit enemy (`enemyHit()`); blessing check (📿); enemy cast check; enemy retaliation; type-specific branches | `enemyHpLost`, `playerHp`, `playerSta`, `enemyAtkBonus` |
| 33 | `resolveAction()` — ROLL | 1619–1846 | Dodge attack or walk away; reincarnation on Death tile; Swift kick; stamina-gated dodge roll | `playerHp`, `playerSta`, `enemyStaLost`, `encounterIndex` |
| 34 | `resolveAction()` — BLOCK | 1848–1956 | Reduce incoming damage; type restrictions (cannot block Heavy/Spirit/Hot/Toxic); shop gamble | `playerSta`, `playerHp`, `enemyStaLost` |
| 35 | `resolveAction()` — CAST | 1958–2146 | Magic damage; Reflective mirror; cook Consumable; incinerate Trap/Item; Locked-Container unlock at 2 mana | `playerMgk`, `enemyMgkLost`, `enemyHp`, `enemyName` |
| 36 | `resolveAction()` — PRAY | 2148–2317 | Restore HP; banish Spirit/Undead; Altar sacrifice; Curse intellect check | `playerHp`, `playerMgk`, `playerInt`, `playerLck` |
| 37 | `resolveAction()` — CURSE | 2319–2433 | Weaken/polymorph enemy; Demon backfire; Reflective reflect; Altar anger | `playerMgk`, `enemyAtk`, `enemyCursed`, `enemyType`, `enemyEmoji` |
| 38 | `resolveAction()` — GRAB | 2435–2843 | Collect items; knock out exhausted enemies; fish; recruit to party; unlock containers; claim coins | `playerLootString[]`, `playerPartyString[]`, `savedCoins`, `encounterIndex` |
| 39 | `resolveAction()` — SPEAK | 2846–3014 | Diplomacy; recruit ally; Friend quest item check; convince/anger based on INT comparison; white flag | `playerInt`, `enemyAtk`, `enemyAtkBonus`, `playerKarma` |
| 40 | `resolveAction()` — SLEEP | 3016–3140 | Restore stamina/mana; level-up check; Prop bonuses; Curse trigger; Dream wake | `playerSta`, `playerMgk`, `playerRested`, `playerLevel`, `playerXP` |
| 41 | Post-action tail | 3141–3154 | Fishing return logic; restore boss type; random INT flicker; call `redraw()` | `isFishing`, `enemyBossType`, `playerInt` |
| 42 | `getRandomFish()` | 3507–3520 | Trigger fishing loot display via `loadEncounter()` | `lootEncounterIndex` |
| 43 | `procAbilityChance()` | 3522–3537 | Check loot for a specific item; roll percentage chance | `playerLootString[]` |
| 44 | `nextEncounter()` | 3539–3575 | Mark enemy seen; boss defeat log; area transition animation; advance index; call `loadEncounter()` + `redraw()` | `encounterIndex`, `seenEncounters[]`, `previousArea` |
| 45 | `animateFlipNextEncounter()` | 3577–3591 | Card-flip CSS animation before advancing encounter | DOM `id_card` |
| 46 | `playerCheckLevelUp()` | 3594–3610 | Push Upgrade encounter if XP threshold met; animate; increment level; reset XP | `playerLevel`, `playerXP`, `playerXPThreshold`, `linesStory[]` |
| 47 | `playerGainXP()` | 3314–3348 | Calculate XP from enemy stats × INT/type/level multipliers; log gain | `playerXP`, `adventureLog` |
| 48 | `sufferToxin()` | 3350–3360 | Apply toxic damage on grab contact | `playerHp` |
| 49 | `enemyAttackOrRest()` | 3362–3432 | Enemy turn decision: attack if stamina available, else rest | `enemySta`, `playerHp`, `enemyStaLost` |
| 50 | `enemyDodged()` | 3434–3438 | Enemy evade message | `adventureLog` |
| 51 | `enemyCastIfMgk()` | 3440–3479 | Enemy spell: 33% reflect check (💠); apply damage; return true if cast occurred | `enemyMgk`, `playerHp`, `playerMgk`, `enemyMgkLost` |
| 52 | `enemyRest()` | 3158–3166 | Enemy restores stamina; animate | `enemyStaLost` |
| 53 | `enemyStaminaChangeMessage()` | 3168–3191 | Return true if attacking / false if resting; apply animation | `enemySta`, `enemyStaLost` |
| 54 | `enemyHit()` | 3193–3246 | Apply damage to enemy; 25% crit syphon (🀄); animate; check death → `enemyKilled()` | `enemyHpLost`, `playerHp` |
| 55 | `enemyKilled()` | 3248–3257 | Award XP; decrement karma; animate next | `playerKarma`, `playerXP` |
| 56 | `enemyJoinedParty()` | 3259–3267 | Add emoji to `playerPartyString[]`; award XP; increment karma | `playerPartyString[]`, `playerKarma`, `playerXP` |
| 57 | `enemyKnockedOut()` | 3269–3281 | Harmless KO; award XP; variable karma | `playerXP`, `playerKarma` |
| 58 | `enemyDisengage()` | 3283–3290 | Enemy convinced to leave; increment karma | `playerKarma` |
| 59 | `enemyGrabbedIntoLoot()` | 3292–3300 | Small creature becomes loot emoji | `playerLootString[]` |
| 60 | `enemyKicked()` | 3302–3312 | Return +2 stamina; enemy rest | `playerSta`, `enemyStaLost` |
| 61 | `enemyTurnAggressive()` | 3481–3491 | Friend becomes hostile; decrement karma | `enemyType`, `playerKarma` |
| 62 | `playerRest()` | 3612–3653 | Restore stamina/mana; tent/dream bonus (33% each); level-up check | `playerSta`, `playerMgk`, `playerRested` |
| 63 | `playerHeal()` | 3655–3673 | Restore up to +2 HP at mana cost | `playerHp`, `playerHpMax`, `playerMgk` |
| 64 | `playerGetStamina()` | 3675–3692 | Restore stamina up to max | `playerSta`, `playerStaMax` |
| 65 | `playerUseStamina()` | 3694–3709 | Consume 1 stamina; 33% reflex refund | `playerSta` |
| 66 | `playerUseMagic()` | 3711–3722 | Consume mana by amount | `playerMgk` |
| 67 | `playerChangeStats()` | 3724–3875 | Apply stat bonuses from items/encounters; update equipment symbols; log gains; advance encounter | All `player*` stat globals, `playerLootString[]`, equipment symbol vars |
| 68 | `playerConsumed()` | 3877–3946 | Eat consumable: calculate HP/Sta gains; apply negative effect damage; pig morph special case | `playerHp`, `playerSta`, `playerHpMax` |
| 69 | `playerHit()` | 3948–4017 | Take incoming damage; luck dodge check; shield/bubble check; death/reincarnation dispatch | `playerHp`, `playerLck`, `playerLootString[]`, triggers `gameOver()` or `playerReincarnate()` |
| 70 | `playerUseItem()` | 4019–4033 | Consume item from loot string; display effect | `playerLootString[]` |
| 71 | `playerWaive()` | 4035–4041 | White flag surrender: −3 INT | `playerInt` |
| 72 | `playerReincarnate()` | 4043–4073 | Increment life count; tutorial skip; karma artifact; stat reset; `renewPlayer()` | `playerNumber`, `playerKarma`, `playerLootString[]` |
| 73 | `checkPlayerHasItem()` | 4075–4084 | Search `playerLootString[]` for any item in provided array | `playerLootString[]` |
| 74 | `gameOver()` | 4087–4111 | Death sequence; log run end; reset story; call `processStoryData()` | `adventureLog`, `linesStory[]` |
| 75 | `gameEnd()` | 4113–4123 | Victory sequence; log completion | `adventureLog` |
| 76 | Run Log Utils | 4126–4177 | `initRunLog`, `runLogAdd`, `downloadRunLog`, `logPlayerAction`, `logAction`, `getTime` | `runLog[]`, `adventureLog` |
| 77 | `setButton()` | 4180–4187 | Set button label text and color | DOM button elements |
| 78 | `resetEncounterButtons()` | 4189–4218 | Enable/disable and recolor all 9 buttons based on player stamina/mana/HP state | DOM button elements |
| 79 | `adjustEncounterButtons()` | 4220–4483 | Large switch on encounter type → relabel buttons for context (Shop/Upgrade/Fishing/Death/Altar/Container/etc.) | DOM button elements, reads `enemyType` |
| 80 | UI Effects & Animation | 4485–4597 | `toggleUIElement`, `curtainFadeInAndOut`, `displayEnemyEffect`, `displayPlayerEffect`, `displayCannotEffect`, `displayDodgeEffect`, `displayAttackEffect`, `displayRestEffect`, `displayGainedEffect`, `displayRestedEffect`, `displayEffect`, `animateUIElement`, `setBackground` | DOM overlays, CSS animate.css classes, `id_fullscreen_curtain` |
| 81 | Action Closures | 4605–4615 | Bind 9 `resolveAction()` results to named callback vars | Reads `resolveAction()` |
| 82 | `registerClickListeners()` | 4618–4645 | Attach jQuery `.click()` handlers to all 9 buttons with debounce delay | jQuery event system |
| 83 | `removeClickListeners()` | 4647–4661 | Detach all button click handlers | jQuery event system |
| 84 | `registerClickListenersTechnical()` | 4663–4713 | Version/level element click; dev cheat codes ("Mucho Dinero", "Cleaner", "Poco Dinero") | `savedCoins`, `playerLevel`, localStorage |
| 85 | Social & Export | 4715–4799 | `generateCharacterShareString`, `generateCharacterLegend`, `copyAdventureToClipboard`, `redirectToTweet`, `shareLinkedIn`, `visitLinkedIn`, `redirectToFeedback` | `adventureLog`, `playerLootString[]`, `playerPartyString[]`, clipboard API |
