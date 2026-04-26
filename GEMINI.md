# GEMINI.md

This file provides foundational mandates for Gemini CLI when working in this repository. These instructions take precedence over general defaults.

## Core Directives

1. **Always Verify State:** Never assume the codebase matches your internal memory or previous turns. Before any `replace` or `write_file` operation, you MUST perform a fresh `read_file` or `grep_search` to ensure you are acting on the most current version of the code, especially to account for manual user edits.
2. **Surgical Precision:** Prioritize the minimal amount of change required. Avoid broad rewrites or "cleanup" of surrounding code. Match the existing code's density, formatting, and idiomatic style.
3. **No Redundant Summaries:** Do not provide summaries of your changes unless explicitly asked. Focus exclusively on technical rationale before acting.

## Project Context

**Stay Dead** is a browser-based text roguelike RPG.
- **Tech Stack:** Vanilla JavaScript (ES5/Global scope), Jekyll (Ruby/Gemfile), CSS/Sass. No NPM or modern JS build tools.
- **Data:** CSV files in `/data/` using `;` (semicolon) as the primary delimiter.
- **Versioning:** `js/constants.js` contains the `versionCode`. Use `bash version.sh` to update it.
- **Validation:** Use `python validator.py` for CSV integrity and PR version checks.
- **Dependencies:** Managed via `Gemfile` for Jekyll/Ruby; frontend libraries (jQuery, animate.css, html2canvas) are loaded via CDN in `index.md`.

## Workflow Patterns

- **Renaming/Refactoring:** When moving symbols or files, search the entire repository (including `index.md`, `CLAUDE.md`, and GitHub workflows) to ensure all references are updated.
- **CI/CD:** GitHub Actions in `.github/workflows/ci.yml` handle validation. Ensure compatibility with the `origin/live` branch structure during PRs.
- **Testing:** Since there is no automated test suite yet, perform manual validation of logic changes and verify CSV parsing via the validator script.
