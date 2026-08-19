import assert from "node:assert/strict";
import test from "node:test";
import { calculateResult, didPass } from "../src/utils/scoring.js";

const questions = [
  {
    id: "q1",
    text: "First",
    options: ["A", "B"],
    correctIndex: 1,
    points: 2,
    negativePoints: 0.5,
    explanation: "B is correct."
  },
  {
    id: "q2",
    text: "Second",
    options: ["A", "B"],
    correctIndex: 0,
    points: 2,
    negativePoints: 0.5
  }
];

test("score calculation handles correct, incorrect, and review details", () => {
  const result = calculateResult(questions, { q1: 1, q2: 1 });
  assert.equal(result.score, 1.5);
  assert.equal(result.totalPoints, 4);
  assert.equal(result.percentage, 37.5);
  assert.equal(result.review[0].isCorrect, true);
  assert.equal(result.review[1].isCorrect, false);
  assert.equal(result.review[1].earnedPoints, -0.5);
});

test("skipped answers receive zero and pass/fail uses passing percent", () => {
  const result = calculateResult(questions, { q1: 1 });
  assert.equal(result.score, 2);
  assert.equal(result.review[1].isSkipped, true);
  assert.equal(didPass(result.percentage, 50), true);
  assert.equal(didPass(result.percentage, 75), false);
});

