import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";

export const leaderboard = asyncHandler(async (_req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { status: "SUBMITTED" },
    include: { user: { select: { id: true, name: true } } }
  });

  const rows = new Map();
  for (const attempt of attempts) {
    const current = rows.get(attempt.userId) || {
      userId: attempt.userId,
      name: attempt.user.name,
      totalScore: 0,
      attempts: 0
    };
    current.totalScore += Number(attempt.score);
    current.attempts += 1;
    rows.set(attempt.userId, current);
  }

  res.json([...rows.values()].sort((a, b) => b.totalScore - a.totalScore).slice(0, 20));
});

