#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "--docker" ]]; then
  node scripts/db-setup.mjs --docker
else
  node scripts/db-setup.mjs "$@"
fi
