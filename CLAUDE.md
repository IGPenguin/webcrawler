# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Stay Dead** is a browser-based text roguelike RPG, optimized for mobile. It runs on GitHub Pages (deployed from the `live` branch). The `experimental` branch is the development branch.

## Local Development

```bash
bundle exec jekyll serve
# Visit http://127.0.0.1:4000
```

No build tools, no npm. Pure vanilla JavaScript served by Jekyll.

## Architecture

The game has two layers:

**Data layer** — CSV files in `/data/`:
- `encounters.csv` — All enemies/obstacles (the largest file, ~2000+ entries). Columns: `area | emoji | name | type | hp | atk | sta | lck | int | mgk | def | note | desc | message`
- `story.csv` — Story progression and generator definitions
- `fishing.csv` — Fishing rewards and artifacts
- `wip_*.csv` — Work-in-progress content (threats, boosts, undos, misc)

**Logic layer** — `js/game_loop.js` (~4800 lines, monolithic by design):
- All game logic lives here — no modules, no splitting
- CSV data is loaded via jQuery AJAX on page load and stored in global arrays
- Game state (player stats, inventory, area progress) lives in JS variables, with coins persisted to `localStorage`
- UI is updated by calling `redraw()` which re-renders from current state

The HTML/UI is in `index.md` (a Jekyll template). The layout wraps it via `_layouts/default.html`.

## Key Systems in game_loop.js

- **Encounter loading**: `loadEncounter(index)` parses CSV rows into the current encounter; `generateNextEncounters(generatorID)` builds dynamic sequences
- **Combat**: `resolveAction(button)` dispatches all nine player actions (Attack, Roll, Block, Grab, Sleep, Speak, Cast, Pray, Curse)
- **Progression**: XP → level-up on sleep; coins (drachma) persist across runs as meta-currency; `renewPlayer()` resets a run
- **Loot**: Items stored as an emoji string in the player inventory object; `processLoot()` parses CSV loot fields

## Branching & Deployment

- `experimental` → development work
- `live` → production, auto-deployed to GitHub Pages

## Contributing Rules

- Submit only complete features and data — no partial or WIP content
- Remove all debug/temporary code before submitting
- Test all changes locally with Jekyll before opening a PR
