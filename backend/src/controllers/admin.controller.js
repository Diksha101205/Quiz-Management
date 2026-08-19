import { prisma } from "../db.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export const allAttempts = asyncHandler(async (_req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      quiz: { select: { id: true, title: true, difficulty: true } }
    },
    orderBy: { startedAt: "desc" }
  });
  res.json(attempts);
});

export const adminAttempt = asyncHandler(async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      quiz: { include: { questions: true, category: true } }
    }
  });
  if (!attempt) throw new ApiError(404, "Attempt not found");
  res.json(attempt);
});

export const analytics = asyncHandler(async (_req, res) => {
  const [users, quizzes, attempts, categories] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.quiz.count(),
    prisma.quizAttempt.count({ where: { status: "SUBMITTED" } }),
    prisma.category.count()
  ]);

  const quizPerformance = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      _count: { select: { attempts: true } },
      attempts: { where: { status: "SUBMITTED" }, select: { score: true, totalPoints: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({
    totals: { users, quizzes, attempts, categories },
    quizPerformance: quizPerformance.map((quiz) => {
      const submitted = quiz.attempts.length;
      const averageScore = submitted
        ? quiz.attempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / submitted
        : 0;
      return { id: quiz.id, title: quiz.title, attempts: quiz._count.attempts, averageScore };
    })
  });
});

