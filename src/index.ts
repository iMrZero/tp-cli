// src/index.ts
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import os from "os";
import {
  getLatestNodeLTS,
  getLatestNpm,
  getLatestPnpm,
  getLatestPython,
} from "./api";

const program = new Command();
program
  .name("devup")
  .description("Cross-platform developer tool updater")
  .version("1.0.0");

// Helper to check if a package manager exists
async function isCommandAvailable(cmd: string): Promise<boolean> {
  try {
    await execa(cmd, ["--version"]);
    return true;
  } catch {
    return false;
  }
}

// 🌟 THE CORE: Define all tools here
interface ToolConfig {
  name: string;
  key: string;
  checkCmd: string;
  checkArgs: string[];
  parseVersion: (stdout: string) => string;
  getLatestVersion: () => Promise<string>;
  getUpdateCmd: () => Promise<string | null>;
}

const tools: ToolConfig[] = [
  {
    name: "Node.js",
    key: "node",
    checkCmd: "node",
    checkArgs: ["-v"],
    parseVersion: (out) => out.trim(),
    getLatestVersion: getLatestNodeLTS,
    getUpdateCmd: async () => {
      if (await isCommandAvailable("fnm"))
        return "fnm install --lts && fnm use lts-latest";
      if (await isCommandAvailable("nvm")) return "nvm install --lts";
      if (await isCommandAvailable("volta")) return "volta install node@lts";
      return null;
    },
  },
  {
    name: "npm",
    key: "npm",
    checkCmd: "npm",
    checkArgs: ["-v"],
    parseVersion: (out) => out.trim(),
    getLatestVersion: getLatestNpm,
    getUpdateCmd: async () => "npm install -g npm@latest",
  },
  {
    name: "pnpm",
    key: "pnpm",
    checkCmd: "pnpm",
    checkArgs: ["-v"],
    parseVersion: (out) => out.trim(),
    getLatestVersion: getLatestPnpm,
    getUpdateCmd: async () => "npm install -g pnpm@latest",
  },
  {
    name: "Git",
    key: "git",
    checkCmd: "git",
    checkArgs: ["--version"],
    parseVersion: (out) => out.replace("git version ", "").trim(),
    getLatestVersion: async () => "N/A", // Skipped to avoid GitHub API rate limits
    getUpdateCmd: async () => {
      const platform = os.platform();
      if (platform === "win32") {
        if (await isCommandAvailable("winget"))
          return "winget upgrade --id Git.Git -e";
        if (await isCommandAvailable("scoop")) return "scoop update git";
      } else if (platform === "darwin") {
        if (await isCommandAvailable("brew")) return "brew upgrade git";
      } else if (platform === "linux") {
        if (await isCommandAvailable("apt"))
          return "sudo apt update && sudo apt install --only-upgrade git";
      }
      return null;
    },
  },
  {
    name: "Python",
    key: "python",
    // On Mac/Linux, the command is usually 'python3', on Windows it's 'python'
    checkCmd: os.platform() === "win32" ? "python" : "python3",
    checkArgs: ["--version"],
    parseVersion: (out) => {
      // Output is "Python 3.11.5", we use Regex to extract just "3.11.5"
      const match = out.match(/Python\s+([\d.]+)/);
      return match ? match[1] : out.trim();
    },
    getLatestVersion: getLatestPython,
    getUpdateCmd: async () => {
      const platform = os.platform();
      if (platform === "win32") {
        if (await isCommandAvailable("winget"))
          return 'winget upgrade --name "Python"';
        if (await isCommandAvailable("scoop")) return "scoop update python";
      } else if (platform === "darwin") {
        if (await isCommandAvailable("brew")) return "brew upgrade python";
      } else if (platform === "linux") {
        if (await isCommandAvailable("apt"))
          return "sudo apt update && sudo apt install --only-upgrade python3";
      }
      return null;
    },
  },
];

// 🔄 DYNAMIC CHECK COMMAND
program
  .command("check")
  .description("Check current vs latest versions for all tools")
  .action(async () => {
    console.log(chalk.blue.bold("\n🔍 Checking for updates...\n"));

    for (const tool of tools) {
      const spinner = ora(`Checking ${tool.name}...`).start();
      try {
        const { stdout } = await execa(tool.checkCmd, tool.checkArgs);
        const current = tool.parseVersion(stdout);

        let latestStr = "";
        try {
          const latest = await tool.getLatestVersion();
          latestStr =
            latest === "N/A" ? "" : ` | Latest ${chalk.green(latest)}`;
        } catch {
          latestStr = ` | ${chalk.gray("Latest check skipped")}`;
        }

        spinner.succeed(
          `${tool.name}: Current ${chalk.yellow(current)}${latestStr}`,
        );
      } catch (e) {
        spinner.fail(`${tool.name} not found.`);
      }
    }
  });

// 🔄 DYNAMIC UPDATE COMMAND
program
  .command("update <tool>")
  .description("Update a specific tool (node, npm, pnpm, git, python)")
  .action(async (toolKey) => {
    const tool = tools.find((t) => t.key === toolKey);

    if (!tool) {
      console.log(chalk.red(`❌ Unknown tool: ${toolKey}.`));
      console.log(
        chalk.gray(`Available tools: ${tools.map((t) => t.key).join(", ")}`),
      );
      return;
    }

    console.log(chalk.blue.bold(`\n🚀 Updating ${tool.name}...\n`));
    const cmd = await tool.getUpdateCmd();

    if (!cmd) {
      console.log(
        chalk.red(
          `❌ Could not find a supported package manager to update ${tool.name} on your OS.`,
        ),
      );
      return;
    }

    console.log(chalk.gray(`Executing: ${cmd}`));
    try {
      await execa(cmd, { shell: true, stdio: "inherit" });
      console.log(chalk.green.bold(`\n✅ Successfully updated ${tool.name}!`));
    } catch (e) {
      console.log(chalk.red(`\n❌ Failed to update ${tool.name}.`));
    }
  });

program.parse();
