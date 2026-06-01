#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PORT="${1:-4000}"

if ! command -v bundle &>/dev/null; then
  echo "Error: bundler not found. Install with: gem install bundler" >&2
  exit 1
fi

echo "Installing gems..."
bundle install --quiet

lsof -ti tcp:"$PORT" 2>/dev/null | xargs kill 2>/dev/null || true

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}')

echo "Starting Jekyll on http://localhost:$PORT"
echo "  Local network: http://${LOCAL_IP}:${PORT}"
bundle exec jekyll serve --port "$PORT" --host 0.0.0.0 --open-url
