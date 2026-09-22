import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calStatus } from "../lib/cal.js";
describe("cal", () => {
  it("status", async () => assert.equal((await calStatus()).ok, true));
});
