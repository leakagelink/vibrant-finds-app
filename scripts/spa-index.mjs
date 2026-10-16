// Copies the TanStack Start SPA shell to index.html so the static client build
// (dist/client) is a complete bundle that Capacitor/Android can serve.
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "dist", "client");
const shell = join(clientDir, "_shell.html");
const index = join(clientDir, "index.html");

if (existsSync(shell)) {
  copyFileSync(shell, index);
  console.log("[spa-index] wrote dist/client/index.html from _shell.html");
} else {
  console.log("[spa-index] no _shell.html found — skipping (SSR build)");
}
