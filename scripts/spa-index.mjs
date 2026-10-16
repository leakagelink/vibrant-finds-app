// Ensures the static client build has an index.html so Capacitor/Android can serve it.
// Handles both output layouts: dist/client (sandbox) and .output/public (local nitro).
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

for (const dir of [join("dist", "client"), join(".output", "public")]) {
  const clientDir = join(process.cwd(), dir);
  const shell = join(clientDir, "_shell.html");
  const index = join(clientDir, "index.html");
  if (existsSync(shell) && !existsSync(index)) {
    copyFileSync(shell, index);
    console.log(`[spa-index] wrote ${dir}/index.html from _shell.html`);
  }
}
