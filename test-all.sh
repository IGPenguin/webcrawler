#!/usr/bin/env bash
set -e

NODE_PATH="$(npm root -g)" playwright test tests/boot.spec.js tests/encounters.spec.js tests/rarity.spec.js --config tests/playwright.config.js "$@"
