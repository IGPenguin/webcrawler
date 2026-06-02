#!/usr/bin/env bash
# Internal helper — called by test-*.sh scripts. Not meant to be run directly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PORT="${PORT:-4000}"

if ! curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" 2>/dev/null | grep -q 200; then
  echo "Error: Jekyll not running on port $PORT. Start it with: bash scripts/deploy.sh" >&2
  exit 1
fi

NODE_PATH="$(npm root -g)" playwright test "$@" --config tests/playwright.config.js
