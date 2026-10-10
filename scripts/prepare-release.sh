#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="$ROOT_DIR/releases"
DOWNLOAD_DIR="$ROOT_DIR/website/public/downloads"
WEBSITE_MANIFEST="$ROOT_DIR/website/src/data/releases.json"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/package.deb" >&2
  exit 1
fi

PACKAGE_PATH="$1"
if [[ ! -f "$PACKAGE_PATH" ]]; then
  echo "[LiquidGlassX] Missing package: $PACKAGE_PATH" >&2
  exit 1
fi

"$ROOT_DIR/scripts/verify-deb.sh" "$PACKAGE_PATH"
PACKAGE_ID="$(dpkg-deb -f "$PACKAGE_PATH" Package)"
VERSION="$(dpkg-deb -f "$PACKAGE_PATH" Version)"
ARCH="$(dpkg-deb -f "$PACKAGE_PATH" Architecture)"
FILE_NAME="$(basename "$PACKAGE_PATH")"
SIZE="$(stat -c '%s' "$PACKAGE_PATH")"
SHA256="$(sha256sum "$PACKAGE_PATH" | awk '{print $1}')"
DATE="$(date -u +%Y-%m-%d)"

if [[ "$PACKAGE_ID" != "com.blue.liquidglassx" ]]; then
  echo "[LiquidGlassX] Refusing to publish a non-LiquidGlassX package: $PACKAGE_ID" >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR/checksums" "$DOWNLOAD_DIR"
cp "$PACKAGE_PATH" "$RELEASE_DIR/"
cp "$PACKAGE_PATH" "$DOWNLOAD_DIR/"
printf '%s  %s\n' "$SHA256" "$FILE_NAME" > "$RELEASE_DIR/checksums/${FILE_NAME}.sha256"

python3 - <<PY
import json
from pathlib import Path

manifest_path = Path("$WEBSITE_MANIFEST")
manifest = json.loads(manifest_path.read_text())
manifest["version"] = "$VERSION"
manifest["packageIdentifier"] = "com.blue.liquidglassx"
manifest["filename"] = "$FILE_NAME"
manifest["downloadPath"] = ""
manifest["architecture"] = "$ARCH"
manifest["fileSize"] = f"{int($SIZE) / 1024 / 1024:.2f} MB"
manifest["sha256"] = "$SHA256"
manifest["releaseDate"] = "$DATE"
manifest["testedIosVersions"] = ["Not yet device verified"]
manifest["changelog"] = "See CHANGELOG.md"
manifest["verificationStatus"] = "Verified package; GitHub Release pending"
manifest["downloadEnabled"] = False
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
PY

echo "[LiquidGlassX] Prepared verified release manifest for $FILE_NAME"
