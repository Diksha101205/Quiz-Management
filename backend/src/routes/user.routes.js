import { Router } from "express";
import { deleteUser, getUser, listUsers, setUserStatus, updateUser, updateUserSchema, userStatusSchema } from "../controllers/user.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, requireAdmin);
router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/status", validate(userStatusSchema), setUserStatus);

export default router;
