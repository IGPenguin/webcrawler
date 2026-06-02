#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

ARG="${1:-}"
HEADER=""
PREV_HEADER=""

# ── Mode selection ─────────────────────────────────────────────────────────────
if [[ "$ARG" =~ ^-[Aa]$ ]]; then
  MODE_CHOICE="A"
elif [[ "$ARG" =~ ^-[Bb]$ ]]; then
  MODE_CHOICE="B"
elif [[ "$ARG" =~ ^-[Cc]$ ]]; then
  MODE_CHOICE="C"
elif [ -t 0 ]; then
  echo ""
  echo "A) Version bump only"
  echo "B) Bump version + generate changelog"
  echo "C) Changelog only (no version bump)"
  read -rp "Choice [A/B/C]: " MODE_CHOICE
  MODE_CHOICE="${MODE_CHOICE:-A}"
else
  MODE_CHOICE="A"
fi

# ── Version stamp (skipped in -c mode) ────────────────────────────────────────
if [[ ! "$MODE_CHOICE" =~ ^[Cc]$ ]]; then
  TIMESTAMP=$(date "+%m/%d/%y @ %I:%M %p")
  NEW_VERSION="ver. $TIMESTAMP"

  sed -i '' "s|var versionCode = \"ver\. [^\"]*\"|var versionCode = \"$NEW_VERSION\"|" js/constants.js
  grep -q "var versionCode = \"$NEW_VERSION\"" js/constants.js || {
    echo "Error: version stamp failed — pattern not found in constants.js" >&2
    exit 1
  }

  # Capture the previous version header before modifying docs/VERSION.md
  PREV_HEADER=$(grep -m 1 "^## ver\." docs/VERSION.md 2>/dev/null || true)

  HEADER="## $NEW_VERSION"
  if ! grep -qF "$HEADER" docs/VERSION.md 2>/dev/null; then
    TMPFILE=$(mktemp)
    printf '%s\n\n' "$HEADER" > "$TMPFILE"
    cat docs/VERSION.md 2>/dev/null >> "$TMPFILE" || true
    mv "$TMPFILE" docs/VERSION.md
  fi

  echo "Version updated to: $NEW_VERSION"
fi

if [[ "$MODE_CHOICE" =~ ^[Aa]$ ]]; then
  exit 0
fi

# ── Changelog suggestion ───────────────────────────────────────────────────────
if ! command -v claude &>/dev/null; then
  echo "Error: claude CLI not found in PATH." >&2
  exit 1
fi

# In -c mode: latest header is the target, second header is the baseline
if [[ "$MODE_CHOICE" =~ ^[Cc]$ ]]; then
  HEADER=$(grep -m 1 "^## ver\." docs/VERSION.md 2>/dev/null || true)
  PREV_HEADER=$(grep -m 2 "^## ver\." docs/VERSION.md 2>/dev/null | tail -1 || true)
  if [ "$HEADER" = "$PREV_HEADER" ]; then
    PREV_HEADER=""
  fi
fi

if [ -z "$PREV_HEADER" ]; then
  echo "No previous version header found — cannot determine commit range."
  exit 0
fi

PREV_TS=$(echo "$PREV_HEADER" | sed 's/## ver\. //')
PREV_DATE=$(python3 -c "
from datetime import datetime
try:
    dt = datetime.strptime('$PREV_TS', '%m/%d/%y @ %I:%M %p')
    print(dt.strftime('%Y-%m-%d %H:%M'))
except Exception:
    pass
" 2>/dev/null || true)

if [ -z "$PREV_DATE" ]; then
  exit 0
fi

COMMITS=$(git log --format="%s" --since="$PREV_DATE" 2>/dev/null | grep -v "^$" | head -40 || true)

if [ -z "$COMMITS" ]; then
  echo "No new commits since last version."
  exit 0
fi

COMMIT_COUNT=$(echo "$COMMITS" | wc -l | tr -d ' ')
STYLE_EXAMPLES=$(grep -A 10 "^## ver\." docs/VERSION.md | grep -v "^## ver\." | grep -v "^--$" | grep -v "^$" | head -12)

echo ""
echo "Generating changelog from $COMMIT_COUNT commits..."

SUGGESTIONS=$(claude -p "Generate changelog lines for this game's VERSION.md.

Style examples — match exactly (single emoji prefix, terse, max 38 chars total, no trailing period):
$STYLE_EXAMPLES

Commits to summarize:
$COMMITS

Rules:
- One line per notable change; skip chore/rename/cleanup commits
- Start each line with one relevant emoji
- Hard max 38 characters per line including the emoji and space
- No trailing period
- Terse present-tense or noun-phrase style
- Merge closely related commits into one line where it reads better
- Output ONLY the lines — no headers, no markdown, no code fences" 2>/dev/null || true)

# Strip any accidental markdown fences
SUGGESTIONS=$(echo "$SUGGESTIONS" | grep -v '^\`\`\`' | grep -v '^$' || true)

if [ -z "$SUGGESTIONS" ]; then
  echo "No suggestions generated."
  exit 0
fi

echo ""
echo "--- $HEADER ---"
echo "$SUGGESTIONS"
echo "---"
echo ""

if [ -t 0 ]; then
  read -rp "Insert into VERSION.md? [y/n] " CHOICE
else
  echo "Non-interactive — skipping insert."
  exit 0
fi

if [[ "$CHOICE" =~ ^[Yy]$ ]]; then
  # Find the line number of the latest header and insert after it
  HEADER_LINE=$(grep -n "^## ver\." docs/VERSION.md | head -1 | cut -d: -f1)
  TMPFILE=$(mktemp)
  {
    head -n "$HEADER_LINE" docs/VERSION.md
    echo "$SUGGESTIONS"
    tail -n +"$((HEADER_LINE + 1))" docs/VERSION.md
  } > "$TMPFILE"
  mv "$TMPFILE" docs/VERSION.md
  echo "Inserted into docs/VERSION.md."
else
  echo "Skipped — add entries manually."
fi
