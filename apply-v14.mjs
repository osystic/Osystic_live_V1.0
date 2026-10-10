import fs from "node:fs";
import { execFileSync } from "node:child_process";

const url = "https://firestorage.ai/en/f/TjL27kaRmMLM/OSYSTIC_ENTERPRISE_SEO_SECURITY_US_v1.4.1_DEPLOY.zip";
const response = await fetch(url);
if (!response.ok) throw new Error(`Unable to download OSYSTIC v1.4.1 source: HTTP ${response.status}`);

const archive = "/tmp/osystic-v1.4.1.zip";
fs.writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
execFileSync("unzip", ["-oq", archive, "-d", "."], { stdio: "inherit" });

for (const target of [
  "package-lock.json",
  "local.db",
  "local.db-shm",
  "local.db-wal",
  "public/team/shawaiz-arif.png",
  "app/api/contact/route.tsx",
]) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

console.log("OSYSTIC v1.4.1 deployment source applied.");
