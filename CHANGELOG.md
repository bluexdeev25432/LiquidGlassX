# Changelog

## 0.0.1-6+debug - 2026-10-10

- Added an opt-in Home Screen theme section with safe presets and conservative SpringBoard glass styling controls that remain disabled by default.
- Kept the existing rootless Control Center and status-bar behavior intact while adding explicit Home Screen compatibility boundaries and safety defaults.
- Added Home Screen theme documentation and limitations to the project README so unsupported features are clearly marked as experimental.
- Verified the package identity, architecture, rootless install paths, and SHA-256 for the actual `com.blue.liquidglassx` `.deb` before release preparation.
- Package artifact built for `iphoneos-arm64`; runtime compatibility is still not device validated.

## 0.0.1-5+debug - 2026-10-10

- Added a rootless PreferenceLoader bundle with enable, safe mode, blur, opacity, appearance, tint, and reset controls.
- Connected Preferences to the tweak's shared settings domain and live update notification.
- Added Tabler interface icons and package verification, checksum, and Sileo index tooling.
- Reworked the website with an interactive glass demo, responsive 3D scene, reduced-motion fallbacks, and verified package details.
- Package artifact built for `iphoneos-arm64`; runtime compatibility has not been validated on a physical device.