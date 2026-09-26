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
  const khal = (await which("khal")) || null;
  let version = null;
  let calendarCount = null;
  if (khal) {
    try {
      const ver = await run(khal, ["--version"], { timeoutMs: 5_000, maxOut: 500 });
      version = (ver.stdout || ver.stderr || "").trim().slice(0, 200) || null;
    } catch {
      /* ignore */
    }
    try {
      const cals = await khalCalendars({ timeoutMs: 8_000 });
      calendarCount = Array.isArray(cals.calendars) ? cals.calendars.length : null;
    } catch {
      calendarCount = null;
    }
  }
  return { ok: true, khal, version, calendarCount };
}

export async function khalCalendars({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["printcalendars"], { timeoutMs: timeoutMs || 10_000, maxOut: 8_000 });
  if (r.code !== 0) throw new Error(`khal printcalendars failed: ${r.stderr || r.code}`);
  const calendars = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
  return { ok: true, count: calendars.length, calendars };
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
