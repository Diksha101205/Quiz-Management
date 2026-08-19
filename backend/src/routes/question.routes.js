import { Router } from "express";
import { createQuestion, deleteQuestion, listQuestions, questionSchema, updateQuestion } from "../controllers/question.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, requireAdmin);
router.get("/quizzes/:quizId/questions", listQuestions);
router.post("/quizzes/:quizId/questions", validate(questionSchema), createQuestion);
router.put("/questions/:id", validate(questionSchema), updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
