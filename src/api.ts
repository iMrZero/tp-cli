// src/api.ts
import fetch from "node-fetch";

export async function getLatestNodeLTS(): Promise<string> {
  const res = await fetch("https://nodejs.org/dist/index.json");
  const data = (await res.json()) as any[];
  const latestLTS = data.find((item) => item.lts);
  return latestLTS.version;
}

// --- NEW ADDITIONS BELOW ---

export async function getLatestNpm(): Promise<string> {
  const res = await fetch("https://registry.npmjs.org/npm/latest");
  const data = (await res.json()) as any;
  return data.version;
}

export async function getLatestPnpm(): Promise<string> {
  const res = await fetch("https://registry.npmjs.org/pnpm/latest");
  const data = (await res.json()) as any;
  return data.version;
}

export async function getLatestPython(): Promise<string> {
  const res = await fetch("https://endoflife.date/api/python.json");
  const data = (await res.json()) as any[];
  // The first item is the latest release cycle, .latest is the exact version (e.g., '3.12.1')
  return data[0].latest;
}
