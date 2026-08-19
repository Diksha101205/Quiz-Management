import { Router } from "express";
import { createQuiz, deleteQuiz, getQuiz, listQuizzes, publishQuiz, quizSchema, updateQuiz } from "../controllers/quiz.controller.js";
import { authenticate, optionalAuthenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", optionalAuthenticate, listQuizzes);
router.get("/:id", optionalAuthenticate, getQuiz);
router.post("/", authenticate, requireAdmin, validate(quizSchema), createQuiz);
router.put("/:id", authenticate, requireAdmin, validate(quizSchema), updateQuiz);
router.delete("/:id", authenticate, requireAdmin, deleteQuiz);
router.patch("/:id/publish", authenticate, requireAdmin, publishQuiz);

export default router;
