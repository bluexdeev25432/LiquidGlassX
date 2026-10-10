# Sileo Repository

**Status: not publicly deployed.** The repository layout and package index can be generated locally from a verified LiquidGlassX DEB. A public source must not be advertised until its signed metadata and package URLs have been deployed and checked over HTTPS.

The expected source URL after deployment is:

```text
https://bluexdeev25432.github.io/LiquidGlassX/sileo/
```

The source entry will be `deb https://bluexdeev25432.github.io/LiquidGlassX/sileo/ stable main`. Import the repository's published `public-key.asc` in Sileo before trusting signed packages. The repository update script accepts one explicit package and refuses packages with a different identifier, architecture, or missing LiquidGlassX payload.

The current local index is unsigned unless `GPG_KEY_ID` names an already configured signing key. Never commit a private key or advertise an unsigned index as an official source. Configure the matching public key and deploy the entire `sileo-repo/` tree together before marking this repository as published.