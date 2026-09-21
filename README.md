# dev-updater

A lightweight cross-platform CLI for checking and updating common developer tools.

## Why this tool?

Keeping local development tools current is often repetitive and platform-specific. This package helps you:

- check the installed version of key tools
- compare them against the latest available release
- run the correct upgrade command for your OS and package manager

Supported tools include:

- Node.js
- npm
- pnpm
- Git
- Python

## Features

- Detect the current version of each supported tool
- Fetch the latest version from official release sources
- Display current vs latest versions in a readable terminal output
- Use OS-aware upgrade logic for Windows, macOS, and Linux
- Update a single tool without manually remembering the correct command

## Install

### Global install

```bash
npm install -g tp-cli
```

### Local development install

```bash
git clone <your-repo-url>
cd dev-updater
npm install
```

## Usage

After installing, the CLI command is:

```bash
tp
```

### Check all tools

```bash
tp check
```

This checks the installed version for all supported tools and prints the latest known version when available.

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

If a supported updater is not available for the current system, the CLI will explain that it could not find a supported way to update that tool.

## Supported tools and behavior

| Tool    | Check command                            | Update strategy                                                    |
| ------- | ---------------------------------------- | ------------------------------------------------------------------ |
| Node.js | `node -v`                                | Uses `fnm`, `nvm`, `volta`, or returns a clear unsupported message |
| npm     | `npm -v`                                 | Runs `npm install -g npm@latest`                                   |
| pnpm    | `pnpm -v`                                | Runs `npm install -g pnpm@latest`                                  |
| Git     | `git --version`                          | Uses `winget`, `scoop`, `brew`, or `apt` depending on OS           |
| Python  | `python --version` / `python3 --version` | Uses `winget`, `scoop`, `brew`, or `apt` depending on OS           |

## Development

Run the CLI in development mode:

```bash
npm run dev -- check
```

Build the package:

```bash
npm run build
```

Link the local binary for testing:

```bash
npm link
```

## Project structure

```text
src/
  api.ts        # Fetches latest release data
  index.ts      # CLI commands and tool definitions
  osDetect.ts   # OS and package-manager detection
bin/
  tp.mjs        # Binary helper
package.json    # Package metadata and CLI binary config
```

## Notes

- Some upgrades require administrator privileges or shell tools that are already installed on your machine.
- The CLI is designed to be simple and useful for local developer environments.
- It focuses on the most common developer tools rather than a broad system package manager.

## License

MIT
