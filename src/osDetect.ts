// src/osDetect.ts
import os from "os";
import { execa } from "execa";

export async function isCommandAvailable(cmd: string): Promise<boolean> {
  try {
    await execa(cmd, ["--version"]);
    return true;
  } catch {
    return false;
  }
}

export async function getUpdateCommand(tool: string): Promise<string | null> {
  const platform = os.platform();

  if (tool === "git") {
    if (platform === "win32") {
      if (await isCommandAvailable("winget"))
        return "winget upgrade --id Git.Git -e";
      if (await isCommandAvailable("scoop")) return "scoop update git";
    } else if (platform === "darwin") {
      if (await isCommandAvailable("brew")) return "brew upgrade git";
    } else if (platform === "linux") {
      if (await isCommandAvailable("apt"))
        return "sudo apt update && sudo apt install --only-upgrade git";
      if (await isCommandAvailable("dnf")) return "sudo dnf upgrade git";
    }
  }

  if (tool === "node") {
    if (await isCommandAvailable("fnm"))
      return "fnm install --lts && fnm use lts-latest";
    if (await isCommandAvailable("nvm")) return "nvm install --lts";
    if (await isCommandAvailable("volta")) return "volta install node@lts";
  }

  return null; // Fallback if no known package manager is found
}
