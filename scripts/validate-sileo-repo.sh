#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$ROOT_DIR/sileo-repo"
REMOTE_REPO="$(git -C "$ROOT_DIR" config --get remote.origin.url | sed -E 's#https://github.com/##; s#git@github.com:##; s#\.git$##')"
EXPECTED_REPO="bluexdeev25432/LiquidGlassX"
EXPECTED_PACKAGE_VERSION="0.0.1-7+debug"
EXPECTED_PACKAGE_SHA256="a76aa88a92b6155c89a8c64b3acb80c2c148d7b2b422767770ee59d70d852965"

if [[ "$REMOTE_REPO" != "$EXPECTED_REPO" ]]; then
  echo "[LiquidGlassX] Unexpected GitHub repository path: $REMOTE_REPO (expected $EXPECTED_REPO)" >&2
  exit 1
fi

if [[ ! -d "$REPO_DIR" ]]; then
  echo "[LiquidGlassX] Missing sileo-repo/ directory" >&2
  exit 1
fi

RELEASE_FILE="$REPO_DIR/Release"
PACKAGES_FILE="$REPO_DIR/Packages"
PACKAGES_GZ="$REPO_DIR/Packages.gz"
INDEX_FILE="$REPO_DIR/index.html"

for required in "$INDEX_FILE" "$RELEASE_FILE" "$PACKAGES_FILE" "$PACKAGES_GZ"; do
  if [[ ! -f "$required" ]]; then
    echo "[LiquidGlassX] Missing required Sileo metadata: $required" >&2
    exit 1
  fi
done

if [[ -d "$REPO_DIR/dists" ]]; then
  echo "[LiquidGlassX] Flat Sileo repository must not also contain a dists/ layout" >&2
  exit 1
fi

if ! grep -Fq 'deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/ ./' "$INDEX_FILE" || \
   ! grep -Fq 'deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/ ./' "$REPO_DIR/README.md"; then
  echo "[LiquidGlassX] Repository instructions must use the flat APT source format (./)" >&2
  exit 1
fi

if ! gzip -t "$PACKAGES_GZ"; then
  echo "[LiquidGlassX] Broken gzip payload for Packages.gz" >&2
  exit 1
fi

if ! gzip -dc "$PACKAGES_GZ" | cmp -s - "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages.gz does not decompress to Packages" >&2
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

if [[ "$PACKAGE_VERSION" != "$EXPECTED_PACKAGE_VERSION" || "$PACKAGE_SHA" != "$EXPECTED_PACKAGE_SHA256" ]]; then
  echo "[LiquidGlassX] Repository package does not match the verified release version and SHA-256" >&2
  exit 1
fi

if [[ "$(grep -c '^Package:' "$PACKAGES_FILE")" -ne 1 ]]; then
  echo "[LiquidGlassX] Flat Packages index must contain exactly the current verified package" >&2
  exit 1
fi

if ! grep -Fq "Package: $PACKAGE_ID" "$PACKAGES_FILE" || \
   ! grep -Fq "Version: $PACKAGE_VERSION" "$PACKAGES_FILE" || \
   ! grep -Fq "Architecture: $PACKAGE_ARCH" "$PACKAGES_FILE" || \
   ! grep -Fq "Filename: pool/main/com.blue.liquidglassx/$(basename "$PACKAGE_PATH")" "$PACKAGES_FILE" || \
   ! grep -Fq "SHA256: $PACKAGE_SHA" "$PACKAGES_FILE"; then
  echo "[LiquidGlassX] Packages metadata does not match the actual verified package" >&2
  exit 1
fi

if [[ ! -f "$REPO_DIR/$(awk '/^Filename: / {print $2; exit}' "$PACKAGES_FILE")" ]]; then
  echo "[LiquidGlassX] Packages metadata points to a missing local .deb" >&2
  exit 1
fi

if ! grep -Fq 'Architectures: iphoneos-arm64' "$RELEASE_FILE"; then
  echo "[LiquidGlassX] Release metadata is missing iphoneos-arm64" >&2
  exit 1
fi

if grep -Fq 'Components:' "$RELEASE_FILE"; then
  echo "[LiquidGlassX] Flat Release metadata must not advertise distribution components" >&2
  exit 1
fi

for INDEX_NAME in Packages Packages.gz; do
  INDEX_PATH="$REPO_DIR/$INDEX_NAME"
  INDEX_SHA="$(sha256sum "$INDEX_PATH" | awk '{print $1}')"
  INDEX_SIZE="$(wc -c < "$INDEX_PATH" | tr -d ' ')"
  if ! grep -Eq "^[[:space:]]+$INDEX_SHA[[:space:]]+$INDEX_SIZE[[:space:]]+$INDEX_NAME$" "$RELEASE_FILE"; then
    echo "[LiquidGlassX] Release metadata checksum does not match $INDEX_NAME" >&2
    exit 1
  fi
done

if [[ "$(find "$REPO_DIR/pool/main/com.blue.liquidglassx" -maxdepth 1 -type f -name '*.deb' | wc -l)" -ne 1 ]]; then
  echo "[LiquidGlassX] The Sileo pool must contain exactly one verified current package." >&2
  exit 1
fi

echo "[LiquidGlassX] Flat Sileo repo validation passed for $PACKAGE_ID $PACKAGE_VERSION ($PACKAGE_ARCH), SHA256 $PACKAGE_SHA"
