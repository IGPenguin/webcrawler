#!/usr/bin/env bash
set -e
node --check js/*.js
echo "JS syntax OK"
python3 tests/validator.py js
