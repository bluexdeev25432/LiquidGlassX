#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/package.deb" >&2
  exit 1
fi

DEB_PATH="$1"
if [[ ! -f "$DEB_PATH" ]]; then
  echo "[LiquidGlassX] .deb not found: $DEB_PATH" >&2
  exit 1
fi

if ! dpkg-deb --info "$DEB_PATH" >/dev/null; then
  echo "[LiquidGlassX] Invalid Debian archive: $DEB_PATH" >&2
  exit 1
fi

PACKAGE_ID="$(dpkg-deb -f "$DEB_PATH" Package)"
ARCH="$(dpkg-deb -f "$DEB_PATH" Architecture)"
VERSION="$(dpkg-deb -f "$DEB_PATH" Version)"

if [[ "$PACKAGE_ID" != "com.blue.liquidglassx" ]]; then
  echo "[LiquidGlassX] Package identifier mismatch: expected com.blue.liquidglassx, got $PACKAGE_ID" >&2
  exit 1
fi

if [[ "$ARCH" != "iphoneos-arm64" ]]; then
  echo "[LiquidGlassX] Architecture mismatch: expected iphoneos-arm64, got $ARCH" >&2
  exit 1
fi

CONTENTS="$(dpkg-deb -c "$DEB_PATH")"
for expected in \
  "var/jb/Library/MobileSubstrate/DynamicLibraries/LiquidGlassX.dylib" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/LiquidGlassXPrefs" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/Root.plist" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/IconGlassFull.png" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/IconAdjustmentsHorizontal.png" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/IconShieldCheck.png" \
  "var/jb/Library/PreferenceBundles/LiquidGlassXPrefs.bundle/IconColorFilter.png" \
  "var/jb/Library/PreferenceLoader/Preferences/LiquidGlassXPrefs.plist"; do
  if ! grep -Fq "$expected" <<<"$CONTENTS"; then
    echo "[LiquidGlassX] Required package file is missing: $expected" >&2
    exit 1
  fi
done

if grep -qi "PerformancePlus" <<<"$CONTENTS"; then
  echo "[LiquidGlassX] Refusing an archive containing unrelated PerformancePlus files." >&2
  exit 1
fi

CHECKSUM="$(sha256sum "$DEB_PATH" | awk '{print $1}')"

printf 'Package: %s\nVersion: %s\nArchitecture: %s\nSHA256: %s\n' "$PACKAGE_ID" "$VERSION" "$ARCH" "$CHECKSUM"
