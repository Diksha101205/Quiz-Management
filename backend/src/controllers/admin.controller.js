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
  const [
    users,
    activeStudents,
    inactiveStudents,
    admins,
    quizzes,
    publishedQuizzes,
    draftQuizzes,
    attempts,
    inProgressAttempts,
    passedAttempts,
    failedAttempts,
    categories
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "STUDENT", isActive: true } }),
    prisma.user.count({ where: { role: "STUDENT", isActive: false } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.quiz.count(),
    prisma.quiz.count({ where: { isPublished: true } }),
    prisma.quiz.count({ where: { isPublished: false } }),
    prisma.quizAttempt.count({ where: { status: "SUBMITTED" } }),
    prisma.quizAttempt.count({ where: { status: "IN_PROGRESS" } }),
    prisma.quizAttempt.count({ where: { status: "SUBMITTED", passed: true } }),
    prisma.quizAttempt.count({ where: { status: "SUBMITTED", passed: false } }),
    prisma.category.count()
  ]);

  const submittedAttempts = await prisma.quizAttempt.findMany({
    where: { status: "SUBMITTED" },
    select: { percentage: true, score: true }
  });

  const quizPerformance = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      isPublished: true,
      _count: { select: { attempts: true } },
      attempts: { where: { status: "SUBMITTED" }, select: { score: true, totalPoints: true, percentage: true, passed: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({
    totals: { users, quizzes, attempts, categories },
    studentStats: { total: users, active: activeStudents, inactive: inactiveStudents, admins },
    quizStats: { total: quizzes, published: publishedQuizzes, drafts: draftQuizzes },
    attemptStats: {
      submitted: attempts,
      inProgress: inProgressAttempts,
      passed: passedAttempts,
      failed: failedAttempts,
      passRate: attempts ? (passedAttempts / attempts) * 100 : 0,
      averagePercentage: submittedAttempts.length
        ? submittedAttempts.reduce((sum, attempt) => sum + Number(attempt.percentage), 0) / submittedAttempts.length
        : 0
    },
    quizPerformance: quizPerformance.map((quiz) => {
      const submitted = quiz.attempts.length;
      const averageScore = submitted
        ? quiz.attempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / submitted
        : 0;
      const averagePercentage = submitted
        ? quiz.attempts.reduce((sum, attempt) => sum + Number(attempt.percentage), 0) / submitted
        : 0;
      const passed = quiz.attempts.filter((attempt) => attempt.passed).length;
      return {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        isPublished: quiz.isPublished,
        attempts: quiz._count.attempts,
        submitted,
        averageScore,
        averagePercentage,
        passed,
        failed: submitted - passed
      };
    })
  });
});
