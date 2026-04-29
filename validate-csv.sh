#!/usr/bin/env bash
set -e
python3 automated-tests/validator.py csv "$@"
