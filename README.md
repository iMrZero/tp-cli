# dev-updater

A cross-platform CLI for checking whether common developer tools are up to date and updating them with the right package manager for the current OS.

## Overview

This project scans installed tool versions and compares them against the latest known releases from public package registries and release feeds. It can then suggest or execute OS-appropriate upgrade commands for:

- Node.js
- npm
- pnpm
- Git
- Python

## Features

- Check the current installed version of each supported tool
- Fetch the latest known version from public sources
- Display current vs latest in a readable CLI summary
- Run platform-aware update commands for Windows, macOS, and Linux
- Keep the CLI lightweight and dependency-focused using modern TypeScript tooling

## Project structure

- `src/index.ts` — CLI entrypoint and command definitions
- `src/api.ts` — version-fetching logic for package registries and release APIs
- `src/osDetect.ts` — OS/package manager detection utilities
- `tsup.config.ts` — build config for bundling the CLI
- `bin/tp.mjs` — local helper script for the binary entrypoint

## Requirements

- Node.js 18 or newer
- A supported shell environment for the tools you want to update
- Appropriate package managers on the machine, such as:
  - `fnm`, `nvm`, or `volta` for Node
  - `winget`, `scoop`, `brew`, `apt`, or `dnf` depending on OS

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd dev-updater
npm install
```

Build the CLI locally:

```bash
npm run build
```

To use it globally while developing:

```bash
npm link
```

## Usage

The package binary is exposed as `tp`.

### Check all supported tools

```bash
tp check
```

This prints the current version of each tool and, where available, the latest version from the remote source.

### Update a specific tool

```bash
tp update node
tp update npm
tp update pnpm
tp update git
tp update python
```

Examples:

```bash
tp update node
tp update python
```

If a supported package manager is not available for the current platform, the CLI will report that it could not find a supported updater.

## Supported tools

| Tool    | Check command                             | Latest source               |
| ------- | ----------------------------------------- | --------------------------- |
| Node.js | `node -v`                                 | Node.js LTS API             |
| npm     | `npm -v`                                  | npm registry                |
| pnpm    | `pnpm -v`                                 | pnpm registry               |
| Git     | `git --version`                           | OS-specific package manager |
| Python  | `python --version` or `python3 --version` | Python release feed         |

## Development

Run the CLI in development mode:

```bash
npm run dev -- check
```

Build the production bundle:

```bash
npm run build
```

## Scripts

```bash
npm run dev
npm run build
```

## Notes

- The tool uses platform-aware update logic to minimize OS-specific failure cases.
- Some update steps require elevated privileges, such as `sudo` on Linux.
- Git latest version is intentionally treated as skipped in some cases to avoid unnecessary API rate-limit issues.

## License

MIT
