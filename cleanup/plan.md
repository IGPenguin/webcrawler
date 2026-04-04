https://claude.ai/chat/bee2f4ac-9bc6-4991-9ea7-2121c699303f

Good — I've got a clear enough picture of the project (Jekyll + JS-heavy single-page roguelike, CSV-driven, iPhone-optimized). Here's your full decomposed Claude Code prompt sequence:

🗡️ Stay Dead — Claude Code Prompt Sequence
⚠️ Phase 0 — Context load (run first, manually)
Read CLAUDE.md, TODOs.md, all files in /js, /data, /_includes, /_layouts, and /_sass. 
Build a complete mental map of: what the monolithic JS file does, how CSV data is loaded, 
how localStorage is used, how UI is rendered, how game state flows, and how player/encounter 
actions are resolved. Do not make any changes yet. Output a structured summary of every 
logical section you find in the JS, with line ranges.

🔴 Phase 1 — JS Decomposition (must complete before all else)
Prompt 1A — CSV / data loading module
Based on your JS audit: extract all CSV loading logic, Papa Parse calls, and data-to-object 
mapping into /js/data-loader.js. Export a clean async API e.g. loadEncounters(), loadItems(), 
loadEnemies(). Update the main JS entry point to import from it. Do not change any behavior. 
Run jekyll serve and verify no console errors.
Prompt 1B — Save / local storage module
Extract all localStorage read/write logic into /js/save-manager.js. Expose: saveGame(state), 
loadGame(), clearSave(), listSessionHistory(). History should store an array of past sessions 
with timestamps and action logs. Refactor all existing save/load call sites to use the new 
module. Verify behavior is identical.
Prompt 1C — Game state module
Extract all game state management into /js/game-state.js: player stats, player status effects, 
current encounter state, encounter progression logic (load next encounter), and the action log 
array. Expose a single mutable state object plus pure helper functions. No DOM touches in this 
file. Tests: manually trace a 3-encounter run via console.
Prompt 1D — Input handling module
Extract all button/event listener wiring and input processing logic into /js/input-handler.js. 
This file owns: binding action buttons, reading user intent, calling game-state functions, 
then triggering UI updates. It should import from game-state.js and ui-controller.js only.
Prompt 1E — UI controller module
Extract all DOM manipulation, UI init, dynamic HTML building, feedback display, and stat 
rendering into /js/ui-controller.js. Functions like: initUI(), renderPlayerStats(), 
renderEncounter(), showFeedback(), appendActionLog(entry), updateActionButtons(state). 
No game logic here. Import from game-state.js for data only.
Prompt 1F — Entry point cleanup
Refactor the main JS entry point (or index.js/main.js) to be a thin orchestrator: import all 
5 modules, call initUI(), loadGame() or startNewGame(), wire input-handler. Confirm the full 
module dependency graph is acyclic. Delete any dead code. Run a full game loop manually and 
confirm everything still works end to end.

🟡 Phase 2 — Main Menu (unblock after 1F)
Prompt 2A
Create a main menu screen that appears before the game starts. It must have 4 options:
1. New Game — clears save, starts fresh
2. Continue — only shown if a valid save exists in localStorage (via save-manager.js)
3. Session History — shows list of past sessions from save-manager.listSessionHistory(), 
   each expandable to show its full action log
4. Credits — static screen with attribution

Use existing SCSS conventions in /_sass. The menu should feel native to the current game's 
visual style. Wire it through ui-controller.js and input-handler.js. No game logic changes.

🟠 Phase 3 — Action Bar Minigame (unblock after 1F, can parallel with 2A)
Prompt 3A — Core mechanic
Implement the action resolution minigame for action buttons:

- On button PRESS: show a floating bar UI (full width, above the buttons). The bar displays 
  a 0–100 range. A "|" cursor auto-scrolls continuously from 0→100→0 (ping-pong) at a base 
  speed. Speed and the pass/fail threshold range are calculated from current player stats vs 
  encounter stats (e.g. higher player skill = wider success window, faster cursor).

- The bar background uses a CSS gradient: green in the success zone, red outside it. The 
  success zone position and width are derived from the stat comparison.

- On button RELEASE: cursor stops. The cursor's position (0–100) is the attempt value. 
  Check if it falls in the success zone → pass or fail. Feed the result into the existing 
  game-state action resolution logic.

- Encapsulate this entirely in /js/action-bar.js with: showActionBar(config), hideActionBar(), 
  getAttemptValue(). Config contains speed, successMin, successMax derived by input-handler.js 
  from game state. Style in /_sass consistent with existing UI.
Prompt 3B — Stat integration & tuning
Wire action-bar.js into input-handler.js for all action buttons. Write a pure function 
calcActionBarConfig(playerStats, encounterStats) in game-state.js that returns 
{ speed, successMin, successMax } — expose it for input-handler to use. 
Add visual polish: cursor snap animation on release, brief flash green/red based on outcome, 
then fade bar out. Test with min/max stat extremes to confirm thresholds feel fair.

🟢 Execution order summary
Phase 0 → 1A → 1B → 1C → 1D → 1E → 1F
                                      ↓           ↓
                                    Phase 2    Phase 3A → 3B
Phases 2 and 3 can run in parallel agents after 1F clears. Each prompt is designed to be a single Claude Code session with a clear done-condition. Want me to also write the CLAUDE.md context block to prepend to each agent session?