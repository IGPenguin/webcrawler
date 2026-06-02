#!/usr/bin/env bash
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

TMPJS=$(mktemp)
TMPCSV=$(mktemp)
TMPHTML=$(mktemp)
trap 'rm -f "$TMPJS" "$TMPCSV" "$TMPHTML"' EXIT

echo "--- JS ---"
bash "$REPO_ROOT/scripts/validate-js.sh" 2>&1 | tee "$TMPJS"
JS_OK="${PIPESTATUS[0]}"

echo "--- CSV ---"
bash "$REPO_ROOT/scripts/validate-csv.sh" 2>&1 | tee "$TMPCSV"
CSV_OK="${PIPESTATUS[0]}"

echo "--- HTML ---"
bash "$REPO_ROOT/scripts/validate-html.sh" 2>&1 | tee "$TMPHTML"
HTML_OK="${PIPESTATUS[0]}"

FAILED_LIST=""
[ "$JS_OK"   -ne 0 ] && FAILED_LIST="${FAILED_LIST:+$FAILED_LIST, }JS"
[ "$CSV_OK"  -ne 0 ] && FAILED_LIST="${FAILED_LIST:+$FAILED_LIST, }CSV"
[ "$HTML_OK" -ne 0 ] && FAILED_LIST="${FAILED_LIST:+$FAILED_LIST, }HTML"

echo ""
if [ -n "$FAILED_LIST" ]; then
  echo "════════════════════════════════"
  echo "FAILED: $FAILED_LIST"
  echo "════════════════════════════════"
  echo ""
  [ "$JS_OK"   -ne 0 ] && { echo "--- JS ---";   cat "$TMPJS";   echo ""; }
  [ "$CSV_OK"  -ne 0 ] && { echo "--- CSV ---";  cat "$TMPCSV";  echo ""; }
  [ "$HTML_OK" -ne 0 ] && { echo "--- HTML ---"; cat "$TMPHTML"; echo ""; }
  exit 1
fi

echo "All validators passed."
