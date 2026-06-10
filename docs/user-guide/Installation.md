# Installation

Current version: `v0.3.2 beta`

## Windows

Use either the MSI installer or the setup executable from the latest GitHub release.

The local build output is:

- `src-tauri/target/release/bundle/msi/Get OPIR_0.3.2_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Get OPIR_0.3.2_x64-setup.exe`

## macOS

Use the DMG from the latest GitHub release. macOS builds must be produced on a macOS runner.

## Linux

Use the `.deb`, `.rpm`, or AppImage artifact from the latest GitHub release, depending on your distribution.

## Development Run

```bash
npm install
npm run tauri dev
```

## Development Build

```bash
npm install
npm run tauri build
```
