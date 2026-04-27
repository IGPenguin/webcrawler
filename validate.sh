#!/usr/bin/env bash
set -euo pipefail

python3 automated-tests/validator.py "$@"
