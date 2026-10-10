import fs from "node:fs";
import { execFileSync } from "node:child_process";

const apiUrl = "https://api.firestorage.ai/dev/file/shares/TjL27kaRmMLM/files/01a126ed4b8371169d29d7ac0e11c98d/download";

const ticket = await fetch(apiUrl, { method: "POST", cache: "no-store" });
if (!ticket.ok) throw new Error(`Unable to prepare OSYSTIC v1.4.1 source: HTTP ${ticket.status}`);

const { downloadUrl } = await ticket.json();
if (!downloadUrl) throw new Error("OSYSTIC v1.4.1 download URL is missing.");

const response = await fetch(downloadUrl, { cache: "no-store" });
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
