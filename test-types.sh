#!/usr/bin/env bash
set -e
NODE_PATH="$(npm root -g)" playwright test tests/encounters.spec.js --config tests/playwright.config.js "$@"
