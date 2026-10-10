#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPOSITORY="${GITHUB_REPOSITORY:-bluexdeev25432/LiquidGlassX}"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/verified-liquidglassx.deb" >&2
  exit 1
fi

PACKAGE_PATH="$(realpath "$1")"
"$ROOT_DIR/scripts/verify-deb.sh" "$PACKAGE_PATH"

VERSION="$(dpkg-deb -f "$PACKAGE_PATH" Version)"
FILE_NAME="$(basename "$PACKAGE_PATH")"
TAG="v$VERSION"
EXPECTED_SHA256="$(sha256sum "$PACKAGE_PATH" | awk '{print $1}')"

if gh release view "$TAG" --repo "$REPOSITORY" >/dev/null 2>&1; then
  if ! gh release view "$TAG" --repo "$REPOSITORY" --json assets --jq ".assets[].name" | grep -Fxq "$FILE_NAME"; then
    gh release upload "$TAG" "$PACKAGE_PATH" --repo "$REPOSITORY"
  fi
else
  gh release create "$TAG" "$PACKAGE_PATH" \
    --repo "$REPOSITORY" \
    --title "LiquidGlassX $VERSION" \
    --prerelease \
    --notes-file "$ROOT_DIR/CHANGELOG.md"
fi

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
gh release download "$TAG" --repo "$REPOSITORY" --pattern "$FILE_NAME" --dir "$TEMP_DIR"
REMOTE_SHA256="$(sha256sum "$TEMP_DIR/$FILE_NAME" | awk '{print $1}')"
if [[ "$REMOTE_SHA256" != "$EXPECTED_SHA256" ]]; then
  echo "[LiquidGlassX] GitHub Release asset checksum mismatch; manifest was not updated." >&2
  exit 1
fi

DOWNLOAD_URL="https://github.com/$REPOSITORY/releases/download/$TAG/$FILE_NAME"
PACKAGE_SIZE="$(stat -c '%s' "$PACKAGE_PATH")"
ARCH="$(dpkg-deb -f "$PACKAGE_PATH" Architecture)"
DATE="$(date -u +%Y-%m-%d)"

VERSION="$VERSION" FILE_NAME="$FILE_NAME" DOWNLOAD_URL="$DOWNLOAD_URL" \
PACKAGE_SIZE="$PACKAGE_SIZE" ARCH="$ARCH" EXPECTED_SHA256="$EXPECTED_SHA256" DATE="$DATE" \
python3 - "$ROOT_DIR/website/src/data/releases.json" <<'PY'
import json
import os
import sys
from pathlib import Path

manifest_path = Path(sys.argv[1])
manifest = json.loads(manifest_path.read_text())
manifest.update({
    "version": os.environ["VERSION"],
    "packageIdentifier": "com.blue.liquidglassx",
    "filename": os.environ["FILE_NAME"],
    "downloadPath": os.environ["DOWNLOAD_URL"],
    "architecture": os.environ["ARCH"],
    "fileSize": f"{int(os.environ['PACKAGE_SIZE']) / 1024 / 1024:.2f} MB",
    "sha256": os.environ["EXPECTED_SHA256"],
    "releaseDate": os.environ["DATE"],
    "testedIosVersions": ["Not yet device verified"],
    "changelog": "See CHANGELOG.md",
    "verificationStatus": "Verified GitHub Release asset",
    "downloadEnabled": True,
})
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
PY

echo "[LiquidGlassX] Published and checksum-verified $DOWNLOAD_URL"
echo "[LiquidGlassX] Commit and push the updated website release manifest to deploy the verified link."