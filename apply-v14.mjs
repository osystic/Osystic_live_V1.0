import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const parts = fs.readdirSync(root)
  .filter((name) => /^v14\.payload\.part\d+\.txt$/.test(name))
  .sort();

if (!parts.length) throw new Error("v1.4 payload parts are missing.");

const encoded = parts.map((name) => fs.readFileSync(path.join(root, name), "utf8").trim()).join("");
const compressed = Buffer.from(encoded, "base64");
const payload = JSON.parse(zlib.gunzipSync(compressed).toString("utf8"));

for (const item of payload.files) {
  const target = path.join(root, item.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.from(item.data, "base64"));
}

for (const rel of payload.delete || []) {
  const target = path.join(root, rel);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

console.log(`OSYSTIC ${payload.version}: applied ${payload.files.length} files, deleted ${(payload.delete || []).length}.`);
