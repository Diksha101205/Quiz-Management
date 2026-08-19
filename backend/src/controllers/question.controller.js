import { z } from "zod";
import { prisma } from "../db.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export const questionSchema = z.object({
  body: z.object({
    text: z.string().min(3),
    options: z.array(z.string().min(1)).min(2).max(6),
    correctIndex: z.coerce.number().int().min(0),
    explanation: z.string().max(500).optional().nullable(),
    points: z.coerce.number().positive().default(1),
    negativePoints: z.coerce.number().min(0).default(0)
  })
});

export const listQuestions = asyncHandler(async (req, res) => {
  const questions = await prisma.question.findMany({
    where: { quizId: req.params.quizId },
    orderBy: { createdAt: "asc" }
  });
  res.json(questions);
});

export const createQuestion = asyncHandler(async (req, res) => {
  if (req.body.correctIndex >= req.body.options.length) {
    throw new ApiError(400, "Correct option must exist in options");
  }

  const question = await prisma.question.create({
    data: { ...req.body, quizId: req.params.quizId }
  });
  res.status(201).json(question);
});

export const updateQuestion = asyncHandler(async (req, res) => {
  if (req.body.correctIndex >= req.body.options.length) {
    throw new ApiError(400, "Correct option must exist in options");
  }

  const question = await prisma.question.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(question);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
