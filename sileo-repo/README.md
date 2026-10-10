# Sileo Repository

**Status: published to GitHub Pages as an unsigned flat APT source.** Sileo requests repository metadata at the configured source root, so `Release`, `Packages`, and `Packages.gz` are published directly under `/sileo/`. The repository is generated from the verified LiquidGlassX DEB.

The published source URL is:

```text
https://bluexdeev25432.github.io/LiquidGlassX/sileo/
```

In Sileo, add the source URL above. The equivalent APT source entry is:

```text
deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/ ./
```

Do not add `stable main`: that selects a distribution-based layout and makes APT request `/sileo/dists/stable/Release`, which is not the format published here.

This repository is intentionally unsigned unless `GPG_KEY_ID` is configured through GitHub Actions secrets and a matching public key is deployed. Never commit a private key or advertise signed metadata without the corresponding public key and valid `InRelease` / `Release.gpg` output. The repository update script accepts one explicit package and refuses packages with a different identifier, architecture, or missing LiquidGlassX payload. `Packages` references the `.deb` relative to this source root and records its SHA-256.