import { Router } from "express";
import { adminAttempt, allAttempts, analytics } from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);
router.get("/attempts", allAttempts);
router.get("/attempts/:id", adminAttempt);
router.get("/analytics", analytics);

export default router;
