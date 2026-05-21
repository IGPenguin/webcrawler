#!/bin/bash
# Updates versionCode in js/constants.js and prepends a new section to VERSION.md

TIMESTAMP=$(date "+%m/%d/%y @ %I:%M %p")
NEW_VERSION="ver. $TIMESTAMP"

sed -i '' "s|var versionCode = \"ver\. [^\"]*\"|var versionCode = \"$NEW_VERSION\"|" js/constants.js

HEADER="## $NEW_VERSION"
if ! grep -qF "$HEADER" VERSION.md 2>/dev/null; then
  TMPFILE=$(mktemp)
  printf '%s\n\n' "$HEADER" > "$TMPFILE"
  cat VERSION.md >> "$TMPFILE"
  mv "$TMPFILE" VERSION.md
fi

echo "Version updated to: $NEW_VERSION"
