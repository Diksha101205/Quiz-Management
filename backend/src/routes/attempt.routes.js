import { Router } from "express";
import { getAttempt, myAttempts, startQuiz, submitQuiz, submitSchema } from "../controllers/attempt.controller.js";
import { authenticate, requireStudent } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, requireStudent);
router.post("/quizzes/:quizId/start", startQuiz);
router.post("/quizzes/:quizId/submit", validate(submitSchema), submitQuiz);
router.get("/attempts", myAttempts);
router.get("/attempts/:id", getAttempt);

export default router;
