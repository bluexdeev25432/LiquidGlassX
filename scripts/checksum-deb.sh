#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 /path/to/liquidglassx.deb [checksum-file]" >&2
  exit 1
fi

PACKAGE_PATH="$(realpath "$1")"
"$ROOT_DIR/scripts/verify-deb.sh" "$PACKAGE_PATH"

if [[ $# -eq 2 ]]; then
  CHECKSUM_PATH="$2"
  mkdir -p "$(dirname "$CHECKSUM_PATH")"
  sha256sum "$PACKAGE_PATH" | awk -v name="$(basename "$PACKAGE_PATH")" '{ print $1 "  " name }' > "$CHECKSUM_PATH"
  printf 'Checksum file: %s\n' "$CHECKSUM_PATH"
else
  sha256sum "$PACKAGE_PATH"
fi