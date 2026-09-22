import { spawn } from "node:child_process";

export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
}

export function run(bin, args, { timeoutMs = 15_000, maxOut = 40_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export async function calStatus() {
  return { ok: true, khal: (await which("khal")) || null };
}

export async function khalList({ days = 7, timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const d = Math.min(31, Math.max(1, Number(days) || 7));
  // khal list today today+Nd
  const r = await run(bin, ["list", "today", `${d}d`], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`khal list failed: ${r.stderr || r.code}`);
  return { ok: true, days: d, truncated: r.truncated, output: r.stdout };
}

export async function khalAgenda({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["list", "today"], { timeoutMs, maxOut: 20_000 });
  if (r.code !== 0) throw new Error(`khal agenda failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
}
