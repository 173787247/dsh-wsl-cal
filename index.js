import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await khalCalendars({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "cal calendars" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal calendars", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_today",
    description: "khal list today.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "(none)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await khalAgenda({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "cal today" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal today", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_list",
    description: "khal list next N days (default 7, max 31).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { days: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "(none)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await khalList({ days: args?.days, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "cal list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal list", content: r.content }),
  });
}

function positive(v, fb) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fb;
}
