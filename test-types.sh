#!/usr/bin/env bash
set -e
NODE_PATH="$(npm root -g)" playwright test automated-tests/encounters.spec.js --config automated-tests/playwright.config.js "$@"
