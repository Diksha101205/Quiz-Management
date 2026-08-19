import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";

export const leaderboard = asyncHandler(async (req, res) => {
  const categoryId = req.query.categoryId?.toString();
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      status: "SUBMITTED",
      ...(categoryId ? { quiz: { categoryId } } : {})
    },
    include: {
      user: { select: { id: true, name: true } },
      quiz: { include: { category: true } }
    }
  });

  const rows = new Map();
  for (const attempt of attempts) {
    const current = rows.get(attempt.userId) || {
      userId: attempt.userId,
      name: attempt.user.name,
      totalScore: 0,
      averagePercentage: 0,
      bestPercentage: 0,
      attempts: 0
    };
    current.totalScore += Number(attempt.score);
    current.averagePercentage += Number(attempt.percentage);
    current.bestPercentage = Math.max(current.bestPercentage, Number(attempt.percentage));
    current.attempts += 1;
    rows.set(attempt.userId, current);
  }

  const rankedRows = [...rows.values()]
    .map((row) => ({ ...row, averagePercentage: row.attempts ? row.averagePercentage / row.attempts : 0 }))
    .sort((a, b) => b.totalScore - a.totalScore || b.averagePercentage - a.averagePercentage)
    .map((row, index) => ({ ...row, rank: index + 1 }))
    .slice(0, 20);

  res.json({
    scope: categoryId ? "category" : "overall",
    categoryId: categoryId || null,
    rows: rankedRows
  });
});
