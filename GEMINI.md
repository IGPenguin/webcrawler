# GEMINI.md

This file provides foundational mandates for Gemini CLI when working in this repository. These instructions take precedence over general defaults.

## Core Directives

1. **Always Verify State:** Never assume the codebase matches your internal memory or previous turns. Before any `replace` or `write_file` operation, you MUST perform a fresh `read_file` or `grep_search` to ensure you are acting on the most current version of the code, especially to account for manual user edits.
2. **Surgical Precision:** Prioritize the minimal amount of change required. Avoid broad rewrites or "cleanup" of surrounding code. Match the existing code's density, formatting, and idiomatic style.
3. **No Redundant Summaries:** Do not provide summaries of your changes unless explicitly asked. Focus exclusively on technical rationale before acting.

## Project Context

**Stay Dead** is a browser-based text roguelike RPG.
- **Tech Stack:** Vanilla JavaScript (ES5/Global scope), Jekyll (Ruby/Gemfile), CSS/Sass. No NPM or modern JS build tools.
- **Data:** Three CSV files in `/data/` using `;` (semicolon) as the primary delimiter — `encounters.csv` (enemies, items, obstacles, fishing loot), `story.csv` (story beats, area generators), `origins.csv` (player origin definitions).
- **Versioning:** `js/constants.js` contains the `versionCode`. Use `bash version.sh` to update it.
- **Validation:** Use `bash validate-all.sh` for all static checks (JS syntax, CSV integrity, HTML). Individual scripts: `validate-csv.sh`, `validate-html.sh`, `validate-js.sh`.
- **Testing:** Playwright integration tests run via `bash test-all.sh` (requires Jekyll serving on port 4000 — run `bash deploy.sh` first). Individual suites: `test-boot.sh`, `test-rarity.sh`, `test-types.sh`.
- **Dependencies:** Managed via `Gemfile` for Jekyll/Ruby; frontend libraries (jQuery, animate.css, html2canvas) are loaded via CDN in `index.md`.

## JS Architecture

The JS layer is modular — one responsibility per file, loaded in dependency order via `<script>` tags in `index.md`. There is no bundler. Load order is the only dependency mechanism. Key modules:

- `constants.js` — version stamp, debug flags
- `game-config.js` — `GAME_CONFIG`, `DIFFICULTY_MODES`, `RARITY_TIERS`
- `game-state.js` — all player/enemy state variables (global scope)
- `action-resolver.js` — `resolveAction()` dispatches all nine player actions
- `data-loader.js` — CSV loading via jQuery AJAX; `getWeightedEncounter()`, rarity pickers
- `encounter-loader.js` — `loadEncounter()`, `drachmaeBuy()`, shop logic
- `encounter-generator.js` — `generateNextEncounters()`, dynamic sequence builder
- `game-loop.js` — `nextEncounter()`, `gameOver()`, ending system, `resolveEnding()`
- `save-manager.js` — `SaveManager`, session history, localStorage save/clear
- `achievements.js` — `AchievementManager`, unlock/check/toast

## Workflow Patterns

- **Renaming/Refactoring:** When moving symbols or files, search the entire repository (including `index.md`, `CLAUDE.md`, `GEMINI.md`, and GitHub Actions workflows) to ensure all references are updated.
- **CI/CD:** GitHub Actions in `.github/workflows/` — `validate-data.yml` (static checks), `boot-test.yml`, `encounter-test.yml`, `rarity-test.yml` (Playwright). All target the `live` branch.
- **CSV content changes:** Run `bash validate-csv.sh` locally before committing. Check field counts, stat ranges, and text lengths match area conventions in `DESIGN.md`.
- **New JS symbols:** Because there are no modules, all new functions/variables are global. Name collisions are silent runtime bugs — search the codebase before adding any new global name.
