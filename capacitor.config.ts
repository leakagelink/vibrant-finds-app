import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync } from "node:fs";

// Local Windows builds may emit to .output/public (nitro) instead of dist/client.
const candidates = ["dist/client", ".output/public"];
const webDir =
  candidates.find((d) => existsSync(`${d}/index.html`)) ??
  candidates.find((d) => existsSync(d)) ??
  "dist/client";

const config: CapacitorConfig = {
  appId: "com.jakas.app",
  appName: "JAKAS",
  webDir,
};

export default config;
