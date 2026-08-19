import { z } from "zod";
import { prisma } from "../db.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { calculateResult, didPass } from "../utils/scoring.js";

export const submitSchema = z.object({
  body: z.object({
    attemptId: z.string(),
    answers: z.record(z.string(), z.coerce.number().int()).default({}),
    autoSubmitted: z.boolean().optional().default(false)
  })
});

export const startQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.quizId },
    include: { questions: true, _count: { select: { attempts: true } } }
  });
  if (!quiz || !quiz.isPublished) throw new ApiError(404, "Quiz not available");
  assertQuizAvailable(quiz);

  const previousAttempts = await prisma.quizAttempt.count({
    where: { quizId: quiz.id, userId: req.user.id, status: "SUBMITTED" }
  });
  if (previousAttempts >= quiz.maxAttempts) throw new ApiError(403, "Maximum attempts reached");

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: req.user.id,
      totalPoints: quiz.questions.reduce((sum, question) => sum + Number(question.points), 0)
    }
  });

  res.status(201).json({
    attemptId: attempt.id,
    quiz: {
      id: quiz.id,
      title: quiz.title,
      durationMinutes: quiz.durationMinutes,
      passingScorePercent: quiz.passingScorePercent,
      questions: quiz.questions.map(({ correctIndex, explanation, ...question }) => question)
    }
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: req.body.attemptId, quizId: req.params.quizId, userId: req.user.id },
    include: { quiz: { include: { questions: true } } }
  });

  if (!attempt) throw new ApiError(404, "Attempt not found");
  if (attempt.status === "SUBMITTED") throw new ApiError(400, "Attempt already submitted");

  const deadline = new Date(attempt.startedAt.getTime() + attempt.quiz.durationMinutes * 60_000);
  if (new Date() > deadline && !req.body.autoSubmitted) throw new ApiError(400, "Quiz time has expired");

  const answers = req.body.answers;
  const { score, totalPoints, percentage, review } = calculateResult(attempt.quiz.questions, answers);
  const passed = didPass(percentage, attempt.quiz.passingScorePercent);

  const updated = await prisma.quizAttempt.update({
    where: { id: attempt.id },
    data: { answers, score, totalPoints, percentage, passed, status: "SUBMITTED", submittedAt: new Date() }
  });

  res.json({ attempt: updated, review, passed, percentage, passingScorePercent: attempt.quiz.passingScorePercent });
});

export const myAttempts = asyncHandler(async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user.id },
    include: { quiz: { include: { category: true } } },
    orderBy: { startedAt: "desc" }
  });
  res.json(attempts);
});

export const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { quiz: { include: { questions: true, category: true } } }
  });
  if (!attempt) throw new ApiError(404, "Attempt not found");
  const review = calculateResult(attempt.quiz.questions, attempt.answers || {}).review;
  res.json({ attempt, review, passed: attempt.passed, percentage: attempt.percentage, passingScorePercent: attempt.quiz.passingScorePercent });
});

function assertQuizAvailable(quiz) {
  const now = new Date();
  if (quiz.startDate && now < quiz.startDate) throw new ApiError(403, "Quiz has not started");
  if (quiz.endDate && now > quiz.endDate) throw new ApiError(403, "Quiz has ended");
  if (quiz.questions.length === 0) throw new ApiError(400, "Quiz has no questions");
}
