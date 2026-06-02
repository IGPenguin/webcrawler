#!/usr/bin/env bash
# Renders assets/img/og-preview.svg → assets/img/og-preview.png via Playwright/Chromium.
# Run once after changing the SVG, then commit both files.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
NODE_PATH="$(npm root -g)" node scripts/gen-og-image.js
