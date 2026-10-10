# Release assets

This directory holds built LiquidGlassX package artifacts and SHA-256 sidecars.

The project intentionally keeps the release state explicit:

- Only packages accepted by `scripts/verify-deb.sh` are release candidates.
- `checksums/` is generated from the exact package bytes; verify checksums from this directory.
- Local package verification is not the same as a GitHub Release or public Sileo repository.
- The website and Sileo source must not claim publication until their actual URLs are deployed and checked.
