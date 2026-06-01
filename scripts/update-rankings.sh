#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
trap 'git checkout "$CURRENT_BRANCH" 2>/dev/null || true' EXIT

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: working tree has uncommitted changes. Stash or commit before running." >&2
  exit 1
fi

# ── Secrets ────────────────────────────────────────────────────────────────────
SECRETS_FILE="$REPO_ROOT/scripts/.rankings-secrets"
if [ ! -f "$SECRETS_FILE" ]; then
  echo "Error: $SECRETS_FILE not found." >&2
  echo "Create it with two lines:" >&2
  echo "  LEADERBOARD_SALT='...'" >&2
  echo "  SHEET_CSV_URL='...'" >&2
  exit 1
fi
# shellcheck source=scripts/.rankings-secrets
source "$SECRETS_FILE"
# ──────────────────────────────────────────────────────────────────────────────

if [ -z "${LEADERBOARD_SALT:-}" ] || [ -z "${SHEET_CSV_URL:-}" ]; then
  echo "Error: LEADERBOARD_SALT and SHEET_CSV_URL must both be set in $SECRETS_FILE." >&2
  exit 1
fi

echo "Running leaderboard script..."
LEADERBOARD_SALT="$LEADERBOARD_SALT" SHEET_CSV_URL="$SHEET_CSV_URL" python3 .github/leaderboard_action.py

echo "Pushing highscores.json to rankings branch..."
git fetch origin rankings
git checkout rankings
cp /tmp/highscores.json highscores.json
git add highscores.json
if git diff --cached --quiet; then
  echo "No changes to highscores.json."
else
  git commit -m "update highscores (local test $(date -u +%Y-%m-%dT%H:%M:%SZ))"
  git push origin rankings
  echo "Pushed."
fi

git checkout "$CURRENT_BRANCH"
echo "Done -- back on $CURRENT_BRANCH."
