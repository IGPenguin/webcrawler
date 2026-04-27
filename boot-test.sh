#!/usr/bin/env bash
set -e
NODE_PATH="$(npm root -g)" playwright test --config automated-tests/playwright.config.js "$@"
