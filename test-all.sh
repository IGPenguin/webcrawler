#!/usr/bin/env bash
set -e
NODE_PATH="$(npm root -g)" playwright test automated-tests/boot.spec.js automated-tests/encounters.spec.js automated-tests/rarity.spec.js --config automated-tests/playwright.config.js "$@"
