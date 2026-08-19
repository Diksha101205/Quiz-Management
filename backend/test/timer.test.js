import assert from "node:assert/strict";
import test from "node:test";

function canSubmit({ startedAt, durationMinutes, now, autoSubmitted }) {
  const deadline = new Date(startedAt.getTime() + durationMinutes * 60_000);
  return now <= deadline || autoSubmitted;
}

test("manual submission is blocked after the deadline", () => {
  const startedAt = new Date("2026-08-19T10:00:00.000Z");
  const now = new Date("2026-08-19T10:11:00.000Z");
  assert.equal(canSubmit({ startedAt, durationMinutes: 10, now, autoSubmitted: false }), false);
});

test("automatic submission is accepted after the deadline", () => {
  const startedAt = new Date("2026-08-19T10:00:00.000Z");
  const now = new Date("2026-08-19T10:11:00.000Z");
  assert.equal(canSubmit({ startedAt, durationMinutes: 10, now, autoSubmitted: true }), true);
});

