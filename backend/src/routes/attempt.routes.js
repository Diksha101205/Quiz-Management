import { Router } from "express";
import { getAttempt, myAttempts, startQuiz, submitQuiz, submitSchema } from "../controllers/attempt.controller.js";
import { authenticate, requireStudent } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/quizzes/:quizId/start", authenticate, requireStudent, startQuiz);
router.post("/quizzes/:quizId/submit", authenticate, requireStudent, validate(submitSchema), submitQuiz);
router.get("/attempts", authenticate, requireStudent, myAttempts);
router.get("/attempts/:id", authenticate, requireStudent, getAttempt);

export default router;
