import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema, registerSchema } from "../src/controllers/auth.controller.js";
import { questionSchema } from "../src/controllers/question.controller.js";
import { quizSchema } from "../src/controllers/quiz.controller.js";
import { validate } from "../src/middleware/validate.js";
import { nextCapture } from "../src/utils/requestTest.js";

test("registration validation rejects weak input", () => {
  const result = registerSchema.safeParse({ body: { name: "A", email: "bad", password: "short" } });
  assert.equal(result.success, false);
});

test("login validation accepts email and password", () => {
  const result = loginSchema.safeParse({ body: { email: "student@test.local", password: "Student@12345" } });
  assert.equal(result.success, true);
});

test("quiz validation coerces numeric fields and requires valid passing score", () => {
  const result = quizSchema.safeParse({
    body: {
      title: "Node Basics",
      description: "Backend fundamentals",
      durationMinutes: "20",
      difficulty: "MEDIUM",
      maxAttempts: "2",
      passingScorePercent: "70"
    }
  });
  assert.equal(result.success, true);
  assert.equal(result.data.body.durationMinutes, 20);
  assert.equal(result.data.body.passingScorePercent, 70);
});

test("question validation requires at least two options", () => {
  const result = questionSchema.safeParse({
    body: { text: "Pick one", options: ["A"], correctIndex: 0 }
  });
  assert.equal(result.success, false);
});

test("validation middleware blocks invalid requests", () => {
  const next = nextCapture();
  validate(registerSchema)({ body: { name: "A", email: "bad", password: "x" }, params: {}, query: {} }, {}, next);
  assert.equal(next.calls[0].statusCode, 400);
});

