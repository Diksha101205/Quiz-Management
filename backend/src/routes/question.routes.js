import { Router } from "express";
import { createQuestion, deleteQuestion, listQuestions, questionSchema, updateQuestion } from "../controllers/question.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/quizzes/:quizId/questions", authenticate, requireAdmin, listQuestions);
router.post("/quizzes/:quizId/questions", authenticate, requireAdmin, validate(questionSchema), createQuestion);
router.put("/questions/:id", authenticate, requireAdmin, validate(questionSchema), updateQuestion);
router.delete("/questions/:id", authenticate, requireAdmin, deleteQuestion);

export default router;
