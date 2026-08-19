import assert from "node:assert/strict";
import test from "node:test";
import { requireAdmin, requireStudent } from "../src/middleware/auth.js";
import { hashPassword, signToken, verifyPassword } from "../src/utils/auth.js";
import { nextCapture } from "../src/utils/requestTest.js";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

test("password hashing stores a non-plain-text value and verifies matches", async () => {
  const hash = await hashPassword("Student@12345");
  assert.notEqual(hash, "Student@12345");
  assert.equal(await verifyPassword("Student@12345", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("JWT generation returns a signed token", () => {
  const token = signToken({ id: "user-1", role: "STUDENT", email: "student@test.local" });
  assert.equal(typeof token, "string");
  assert.equal(token.split(".").length, 3);
});

test("admin middleware allows admins and blocks students", () => {
  const allowed = nextCapture();
  requireAdmin({ user: { role: "ADMIN" } }, {}, allowed);
  assert.deepEqual(allowed.calls, [null]);

  const blocked = nextCapture();
  requireAdmin({ user: { role: "STUDENT" } }, {}, blocked);
  assert.equal(blocked.calls[0].statusCode, 403);
});

test("student middleware allows students and blocks admins", () => {
  const allowed = nextCapture();
  requireStudent({ user: { role: "STUDENT" } }, {}, allowed);
  assert.deepEqual(allowed.calls, [null]);

  const blocked = nextCapture();
  requireStudent({ user: { role: "ADMIN" } }, {}, blocked);
  assert.equal(blocked.calls[0].statusCode, 403);
});

