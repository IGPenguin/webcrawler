#!/usr/bin/env bash
set -e
python3 tests/validator.py csv "$@"
