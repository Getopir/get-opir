# Get OPIR

Get OPIR is the personal desktop edition of OPIR.

Current version: `v0.3.2 beta`

This beta is a local-first project workspace for planning outputs, process, inputs, revisions, tasks, and timelines. It is intended for individual desktop use on Windows, macOS, and Linux.

## Edition

- Personal use: free under the included personal-use license.
- Commercial use: requires a separate commercial OPIR license.
- Beta status: this is an early desktop release. Keep exported backups of important work.

## Install

Download the latest release from:

https://github.com/Getopir/get-opir/releases

Use the installer for your system:

- Windows: download the Windows installer zip, then use the MSI or setup executable.
- macOS: download the macOS installer zip, then use the DMG or app bundle.
- Linux: download the Linux installer zip, then use the `.deb`, `.rpm`, or AppImage package for your distribution.

No account, identity provider, external database, billing service, or network service is required.

## How To Use Get OPIR

1. Open Get OPIR.
2. Create or select a project in the left sidebar.
3. Describe the project outcome at the top of the workspace.
4. Add tasks for the work needed to reach the outcome.
5. For each task, fill in:
   - Output: what should exist when the task is done.
   - Process: how the work should be done.
   - Input: what information, materials, or constraints are needed.
   - Notes: decisions, risks, or follow-up details.
6. Set task owner, status, priority, start date, and due date.
7. Use the Timeline panel to review the order of work.
8. Export the workspace regularly as a JSON backup.

## What Is Included

- Local project workspace
- OPIR task detail: output, process, input, notes
- Status and priority tracking
- Timeline view
- JSON export and import for backups
- Tauri wrapper for Windows, macOS, and Linux desktop packaging

## Data Storage

The personal edition stores workspace data locally in the app webview's local storage. Use Export regularly if you want a portable backup or want to move your workspace to another machine.

Exported JSON files may contain personal project information. Treat them like personal documents.

## Development Requirements

- Node.js 20 or newer
- Rust stable
- Platform prerequisites for Tauri: https://tauri.app/start/prerequisites/

## Run Locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Run As A Desktop App

```bash
npm install
npm run tauri dev
```

## Build Installers

```bash
npm install
npm run tauri build
```

Installers are produced under `src-tauri/target/release/bundle/`.
