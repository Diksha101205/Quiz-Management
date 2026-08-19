import { Router } from "express";
import { adminAttempt, allAttempts, analytics } from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/attempts", authenticate, requireAdmin, allAttempts);
router.get("/attempts/:id", authenticate, requireAdmin, adminAttempt);
router.get("/analytics", authenticate, requireAdmin, analytics);

export default router;
