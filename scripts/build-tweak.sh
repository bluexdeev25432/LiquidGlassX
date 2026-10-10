#!/usr/bin/env bash
set -euo pipefail
umask 022

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEOS_DIR="${THEOS_DIR:-/opt/theos}"
OUTPUT_DIR="$ROOT_DIR/releases"

if [[ ! -d "$THEOS_DIR" ]]; then
  echo "[LiquidGlassX] Theos is not installed at $THEOS_DIR. Install Theos before building a package." >&2
  exit 1
fi

export THEOS="$THEOS_DIR"
cd "$ROOT_DIR/tweak"
make clean >/dev/null 2>&1 || true
make package

PACKAGE_PATH="$(find "$ROOT_DIR/tweak/packages" -type f -name '*.deb' -printf '%T@ %p\n' | sort -nr | head -n 1 | cut -d' ' -f2-)"
if [[ -z "$PACKAGE_PATH" ]]; then
  echo "[LiquidGlassX] Build did not produce a .deb package." >&2
  exit 1
fi

"$ROOT_DIR/scripts/verify-deb.sh" "$PACKAGE_PATH"
mkdir -p "$OUTPUT_DIR"
cp "$PACKAGE_PATH" "$OUTPUT_DIR/"

echo "[LiquidGlassX] Built package: $PACKAGE_PATH"
