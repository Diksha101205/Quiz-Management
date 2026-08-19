import { Router } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory, categorySchema } from "../controllers/category.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", listCategories);
router.post("/", authenticate, requireAdmin, validate(categorySchema), createCategory);
router.put("/:id", authenticate, requireAdmin, validate(categorySchema), updateCategory);
router.delete("/:id", authenticate, requireAdmin, deleteCategory);

export default router;
