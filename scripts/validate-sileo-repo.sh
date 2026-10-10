#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$ROOT_DIR/sileo-repo"
REMOTE_REPO="$(git -C "$ROOT_DIR" config --get remote.origin.url | sed -E 's#https://github.com/##; s#git@github.com:##; s#\.git$##')"
EXPECTED_REPO="bluexdeev25432/LiquidGlassX"

if [[ "$REMOTE_REPO" != "$EXPECTED_REPO" ]]; then
  echo "[LiquidGlassX] Unexpected GitHub repository path: $REMOTE_REPO (expected $EXPECTED_REPO)" >&2
  exit 1
fi

if [[ ! -d "$REPO_DIR" ]]; then
  echo "[LiquidGlassX] Missing sileo-repo/ directory" >&2
  exit 1
fi

RELEASE_FILE="$REPO_DIR/dists/stable/Release"
PACKAGES_FILE="$REPO_DIR/dists/stable/main/binary-iphoneos-arm64/Packages"
PACKAGES_GZ="$REPO_DIR/dists/stable/main/binary-iphoneos-arm64/Packages.gz"
INDEX_FILE="$REPO_DIR/index.html"

for required in "$INDEX_FILE" "$RELEASE_FILE" "$PACKAGES_FILE" "$PACKAGES_GZ"; do
  if [[ ! -f "$required" ]]; then
    echo "[LiquidGlassX] Missing required Sileo metadata: $required" >&2
    exit 1
  fi
done

if ! grep -Fq 'deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/' "$INDEX_FILE"; then
  echo "[LiquidGlassX] Sileo landing page is missing the repository source entry" >&2
  exit 1
fi

if ! gzip -t "$PACKAGES_GZ"; then
  echo "[LiquidGlassX] Broken gzip payload for Packages.gz" >&2
  exit 1
fi

PACKAGE_PATH="$(find "$REPO_DIR/pool/main/com.blue.liquidglassx" -type f -name '*.deb' | sort | tail -n 1)"
if [[ -z "$PACKAGE_PATH" ]]; then
  echo "[LiquidGlassX] No package file is present in the Sileo pool" >&2
  exit 1
fi

PACKAGE_ID="$(dpkg-deb -f "$PACKAGE_PATH" Package)"
PACKAGE_VERSION="$(dpkg-deb -f "$PACKAGE_PATH" Version)"
PACKAGE_ARCH="$(dpkg-deb -f "$PACKAGE_PATH" Architecture)"
PACKAGE_SHA="$(sha256sum "$PACKAGE_PATH" | awk '{print $1}')"

if [[ "$PACKAGE_ID" != "com.blue.liquidglassx" ]]; then
  echo "[LiquidGlassX] Wrong package identifier in repository: $PACKAGE_ID" >&2
  exit 1
fi

if [[ "$PACKAGE_ARCH" != "iphoneos-arm64" ]]; then
  echo "[LiquidGlassX] Wrong package architecture in repository: $PACKAGE_ARCH" >&2
  exit 1
fi

if ! grep -Fq "Package: $PACKAGE_ID" "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages metadata is missing the package identifier" >&2
  exit 1
fi

if ! grep -Fq "Version: $PACKAGE_VERSION" "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages metadata does not match the package version" >&2
  exit 1
fi

if ! grep -Fq "Filename: pool/main/com.blue.liquidglassx/$(basename "$PACKAGE_PATH")" "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages metadata points to a broken package path" >&2
  exit 1
fi

if ! grep -Fq "SHA256: $PACKAGE_SHA" "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages metadata checksum does not match the actual package" >&2
  exit 1
fi

if ! grep -Fq 'Suite: stable' "$RELEASE_FILE"; then
  echo "[LiquidGlassX] Release file does not identify the stable suite" >&2
  exit 1
fi

if ! grep -Fq 'Components: main' "$RELEASE_FILE"; then
  echo "[LiquidGlassX] Release file does not declare the main component" >&2
  exit 1
fi

if ! grep -Fq 'https://bluexdeev25432.github.io/LiquidGlassX/sileo/' "$REPO_DIR/README.md"; then
  echo "[LiquidGlassX] Public Sileo URL is missing from README.md" >&2
  exit 1
fi

if [[ "$(find "$REPO_DIR/pool/main/com.blue.liquidglassx" -type f -name '*.deb' | wc -l)" -ne 1 ]]; then
  echo "[LiquidGlassX] The Sileo pool contains multiple package versions; only the verified current package should remain." >&2
  exit 1
fi

echo "[LiquidGlassX] Sileo repo validation passed for $PACKAGE_ID $PACKAGE_VERSION ($PACKAGE_ARCH)"
