import { z } from "zod";
import { prisma } from "../db.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

const difficulty = z.enum(["EASY", "MEDIUM", "HARD"]);

export const quizSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    durationMinutes: z.coerce.number().int().positive(),
    difficulty: difficulty.default("MEDIUM"),
    categoryId: z.string().optional().nullable(),
    maxAttempts: z.coerce.number().int().positive().default(1),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable()
  })
});

const quizInclude = {
  category: true,
  questions: { select: { id: true, text: true, options: true, points: true } },
  _count: { select: { attempts: true, questions: true } }
};

export const listQuizzes = asyncHandler(async (req, res) => {
  const where = req.user?.role === "ADMIN" ? {} : { isPublished: true };
  const search = req.query.search?.toString();
  const categoryId = req.query.categoryId?.toString();

  const quizzes = await prisma.quiz.findMany({
    where: {
      ...where,
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {})
    },
    include: { category: true, _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(quizzes);
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id }, include: quizInclude });
  if (!quiz) throw new ApiError(404, "Quiz not found");
  if (!quiz.isPublished && req.user?.role !== "ADMIN") throw new ApiError(404, "Quiz not found");
  res.json(quiz);
});

export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.create({
    data: normalizeQuiz(req.body),
    include: { category: true }
  });
  res.status(201).json(quiz);
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.update({
    where: { id: req.params.id },
    data: normalizeQuiz(req.body),
    include: { category: true }
  });
  res.json(quiz);
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  await prisma.quiz.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { questions: true } } }
  });
  if (!quiz) throw new ApiError(404, "Quiz not found");
  if (!quiz.isPublished && quiz._count.questions === 0) {
    throw new ApiError(400, "Add at least one question before publishing");
  }

  const updated = await prisma.quiz.update({
    where: { id: req.params.id },
    data: { isPublished: !quiz.isPublished }
  });
  res.json(updated);
});

function normalizeQuiz(body) {
  return {
    ...body,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null
  };
}

