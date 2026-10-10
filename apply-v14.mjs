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

const packageFile = "package.json";
if (fs.existsSync(packageFile)) {
  const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  if (pkg.dependencies) {
    delete pkg.dependencies.jspdf;
    delete pkg.dependencies["jspdf-autotable"];
  }
  fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2) + "\n");
}

const capabilityFile = "app/components/home/HomeCapabilitiesExperience.tsx";
if (fs.existsSync(capabilityFile)) {
  let source = fs.readFileSync(capabilityFile, "utf8");
  source = source.replace(
    `      if (!sectionRef.current || reducedMotion) return;

      const media = gsap.matchMedia();

      media.add("(min-width: 1025px)", () => {
        const intro = sectionRef.current?.querySelector(".future-capabilities-intro");
        const consoleShell = stageRef.current?.querySelector(".future-capability-console");
        const bridge = sectionRef.current?.querySelector(".future-capabilities-handoff");
        const energy = sectionRef.current?.querySelector(".future-capability-energy");

        gsap.set(intro, { y: 42, opacity: 0 });`,
    `      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage || reducedMotion) return;

      const media = gsap.matchMedia();

      media.add("(min-width: 1025px)", () => {
        const intro = section.querySelector(".future-capabilities-intro");
        const consoleShell = stage.querySelector(".future-capability-console");
        const bridge = section.querySelector(".future-capabilities-handoff");
        const energy = section.querySelector(".future-capability-energy");

        if (!intro || !consoleShell || !bridge || !energy) return;

        gsap.set(intro, { y: 42, opacity: 0 });`,
  );
  source = source.replaceAll("trigger: sectionRef.current,", "trigger: section,");
  fs.writeFileSync(capabilityFile, source);
}

const careersFile = "app/careers/_components/CareersClient.tsx";
if (fs.existsSync(careersFile)) {
  let source = fs.readFileSync(careersFile, "utf8");
  source = source.replace(
    '<h1 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", color: BLK, margin: "0 0 8px", fontFamily: FONT }}>\n                Application\n              </h1>',
    '<h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", color: BLK, margin: "0 0 8px", fontFamily: FONT }}>\n                Application\n              </h2>',
  );
  fs.writeFileSync(careersFile, source);
}

console.log("OSYSTIC v1.4.1 deployment source applied with production type + semantic fixes.");
