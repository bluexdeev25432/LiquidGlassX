# LiquidGlassX

LiquidGlassX is an experimental rootless jailbreak tweak and companion website exploring a restrained, iOS 27-inspired Liquid Glass treatment for selected system surfaces. The project includes a Theos/Logos tweak, a PreferenceLoader settings bundle, an interactive responsive website, and guarded package-release tooling.

The package has been built and inspected with Theos and an iPhoneOS SDK. **A successful package build is not evidence of runtime compatibility:** the tweak has not been installed or tested on a physical iPhone. System hooks are private and may change between iOS releases.

## Implemented Features

- Rootless `iphoneos-arm64` Debian package with a SpringBoard hook, a Control Center view hook, and a conservative status-bar treatment.
- Settings bundle with enable and safe-mode switches, blur and opacity sliders, appearance selection, tint text input, and reset action.
- Shared `com.blue.liquidglassx` preferences domain with a Darwin notification for applying changed settings.
- Website with an interactive glass preview, brightness and volume controls, connectivity toggles, battery preview, appearance selector, tint/blur/opacity controls, and comparison slider.
- Locally bundled Tabler icons for the website and Preferences, with icon and font sources recorded in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
- DEB identity/content verification, SHA-256 generation, release-manifest preparation, and Sileo APT index generation scripts.
- Website download gating based on a package verified from its real DEB metadata and checksum.

Website mockups and “not verified” feature labels are previews, not proof that those features are implemented in iOS. The current tweak does not claim to provide cellular, Wi-Fi, battery, or hardware upgrades.

## Compatibility

| Item | Status |
| --- | --- |
| Jailbreak layout | Rootless only |
| Package architecture | `iphoneos-arm64` |
| Declared minimum firmware | iOS 15.0 in package metadata |
| Physical-device testing | Not performed |
| Runtime-supported iOS versions | Not established |
| Rootful jailbreaks, arm64e-specific behavior | Not verified |

The deployment minimum is a package dependency declaration, not a tested support statement. The available build used the iPhoneOS 16.5 SDK; this does not imply that any iOS version or device is compatible.

## Installation Requirements

Installing the tweak requires an arm64 iPhone running a rootless jailbreak with MobileSubstrate-compatible injection and PreferenceLoader. A compatible package manager such as Sileo or Zebra is required for package installation and removal. Keep a device backup and a recovery route available when testing experimental system tweaks.

The LiquidGlassX APT source is **not publicly deployed or signed**. Do not add an unofficial or guessed source URL. Use the verified package attached to the project's GitHub Release when one is available.

## Usage

After installing the package, open **Settings → LiquidGlassX**. Use **Enabled** to turn styling on or off. **Safe Mode** bypasses LiquidGlassX styling. Blur, opacity, appearance, and tint controls update the shared settings domain; Reset to Defaults restores the registered defaults. A Settings change is delivered through a Darwin notification, but live behavior still depends on the target system and has not been device-tested.

The website's preview controls only change the browser demonstration; they do not change an iPhone's settings.

## Project Structure

```text
.github/workflows/       Website deployment and verification workflows
releases/                Verified DEB assets and SHA-256 sidecars
scripts/                 Build, verification, checksum, release, and APT tools
sileo-repo/              APT repository metadata and update instructions
tweak/                   Theos/Logos source, package metadata, Preferences bundle
website/                 React, TypeScript, Vite, local icons, and release UI
CHANGELOG.md              User-visible release history
ATTRIBUTIONS.md           Icon and font sources and licenses
```

## Troubleshooting

- **The package is rejected:** confirm the device uses a rootless jailbreak and the package manager supports `iphoneos-arm64` packages and PreferenceLoader.
- **LiquidGlassX is missing from Settings:** confirm PreferenceLoader is installed, then restart Settings or perform the jailbreak's supported userspace restart.
- **The visual effect is absent:** verify Enabled is on and Safe Mode is off. Private framework classes and system layouts vary; absence of an effect is not evidence that an unsupported device should be forced to install it.
- **SpringBoard or Control Center becomes unstable:** use the jailbreak's safe mode to disable/remove the tweak. If Settings is accessible, enable Safe Mode; otherwise remove the package from the package manager or recovery environment.
- **A download or checksum does not match:** do not install the file. Compare it with the SHA-256 value shown for the same GitHub Release and report the mismatch in the issue tracker.
- **The Sileo source is unavailable:** this is expected until the repository has signed metadata and package URLs deployed over HTTPS.

## Updating

Install a newer verified LiquidGlassX release over the existing package using Sileo, Zebra, or another compatible package manager. Review the release notes and checksum before updating. To remove LiquidGlassX, uninstall its package through the same package manager; user preferences may remain in the `com.blue.liquidglassx` defaults domain until reset or removed separately.

## Contributing

Issues and pull requests belong in the [LiquidGlassX GitHub repository](https://github.com/bluexdeev25432/LiquidGlassX). Describe device model, iOS version, jailbreak type, package-manager version, and reproducible symptoms. Do not include device identifiers, private keys, signing credentials, or personal data. Mark untested behavior as experimental and keep claims aligned with actual device validation. CI checks the website type system, production bundle, and dependency audit.

## Release and Repository Status

Only a real DEB with the expected package identifier, architecture, tweak payload, and Preferences payload may enter a release. The release scripts calculate SHA-256 from that exact file. GitHub Release assets and website links are published only after package verification.

The Sileo APT tree can be generated locally, but its metadata is currently unsigned and it has not been deployed. Its public status must remain “not published” until signed `InRelease`/`Release.gpg` metadata and the corresponding package URLs are available online and verified.

## Current Limitations

- No real-device install, respring, crash, battery, or performance tests have been performed.
- Control Center and status-bar hooks depend on private system implementation details.
- The preferences tint field accepts a hex string; it is not a native color picker.
- The website's 3D scene is a visual concept and is dynamically loaded only on devices reporting adequate hardware without reduced-motion preference.
- The repository signing key and public Sileo deployment are not configured.

## License

Project source is distributed under the MIT License in [LICENSE](LICENSE). Third-party assets retain their respective licenses as described in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
