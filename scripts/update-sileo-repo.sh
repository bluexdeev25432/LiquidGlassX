#!/usr/bin/env bash
set -euo pipefail
umask 022

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$ROOT_DIR/sileo-repo"
PACKAGE_DIR="$REPO_DIR/pool/main/com.blue.liquidglassx"
INDEX_DIR="$REPO_DIR/dists/stable/main/binary-iphoneos-arm64"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/verified-liquidglassx.deb" >&2
  exit 1
fi

PACKAGE_PATH="$(realpath "$1")"
"$ROOT_DIR/scripts/verify-deb.sh" "$PACKAGE_PATH"

PACKAGE_ID="$(dpkg-deb -f "$PACKAGE_PATH" Package)"
PACKAGE_ARCH="$(dpkg-deb -f "$PACKAGE_PATH" Architecture)"
PACKAGE_VERSION="$(dpkg-deb -f "$PACKAGE_PATH" Version)"
PACKAGE_FILENAME="$(basename "$PACKAGE_PATH")"

mkdir -p "$PACKAGE_DIR" "$INDEX_DIR"
find "$PACKAGE_DIR" -maxdepth 1 -type f -name '*.deb' -delete
cp "$PACKAGE_PATH" "$PACKAGE_DIR/"

cd "$REPO_DIR"
dpkg-scanpackages --arch "$PACKAGE_ARCH" --multiversion pool /dev/null > "$INDEX_DIR/Packages"
sed -i '${/^$/d;}' "$INDEX_DIR/Packages"
gzip -9c "$INDEX_DIR/Packages" > "$INDEX_DIR/Packages.gz"

rm -f dists/stable/Release dists/stable/InRelease dists/stable/Release.gpg public-key.asc
cd dists/stable
apt-ftparchive -c "$REPO_DIR/apt-ftparchive.conf" release . > "$REPO_DIR/.Release.tmp"
mv "$REPO_DIR/.Release.tmp" Release
cd "$REPO_DIR"

if [[ -n "${GPG_KEY_ID:-}" ]]; then
  gpg --batch --armor --export "$GPG_KEY_ID" > public-key.asc
  gpg --batch --yes --local-user "$GPG_KEY_ID" --clearsign \
    --output dists/stable/InRelease dists/stable/Release
  gpg --batch --yes --local-user "$GPG_KEY_ID" --detach-sign \
    --output dists/stable/Release.gpg dists/stable/Release
  echo "[LiquidGlassX] Signed APT metadata generated. Review and deploy sileo-repo/ before advertising the source."
else
  echo "[LiquidGlassX] Unsigned repository metadata generated locally. This repository is intentionally published without a configured signing key."
fi

echo "[LiquidGlassX] Repository metadata points to $PACKAGE_ID $PACKAGE_VERSION ($PACKAGE_ARCH) at $PACKAGE_FILENAME"
