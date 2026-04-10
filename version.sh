#!/bin/bash
# Updates versionCode in js/config.js to the current date/time

TIMESTAMP=$(date "+%m/%d/%Y @ %I:%M %p")
NEW_VERSION="ver. $TIMESTAMP"

sed -i '' "s|var versionCode = \"ver\. [^\"]*\"|var versionCode = \"$NEW_VERSION\"|" js/config.js

echo "Version updated to: $NEW_VERSION"
