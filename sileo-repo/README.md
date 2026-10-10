# Sileo Repository

**Status: published to GitHub Pages as an unsigned APT source.** The repository layout and package index are generated from a verified LiquidGlassX DEB and deployed as static content under the GitHub Pages site.

The published source URL is:

```text
https://bluexdeev25432.github.io/LiquidGlassX/sileo/
```

The source entry is `deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/ stable main`.

This repository is intentionally unsigned unless `GPG_KEY_ID` is configured through GitHub Actions secrets and a matching public key is deployed. Never commit a private key or advertise signed metadata without the corresponding public key and valid `InRelease` / `Release.gpg` output. The repository update script accepts one explicit package and refuses packages with a different identifier, architecture, or missing LiquidGlassX payload.