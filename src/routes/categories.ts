import { Router } from "express";
import { categoryCreationValidationSchema } from "@/utils/middleware/validators/category";
import { checkSchema } from "express-validator";
import CategoryController from "@/controllers/categories";

const router = Router();

router.post(
    "/categories/create",
    checkSchema(categoryCreationValidationSchema),
    CategoryController.createCategory
);
router.put(
    "/categories/:categoryId",
    checkSchema(categoryCreationValidationSchema),
    CategoryController.updateCategory
);
router.delete("/categories/:categoryId", CategoryController.deleteCategory);

router.get("/categories/create", CategoryController.createCategoryPage);
router.get("/categories/", CategoryController.listAll);

// get custom categories for product creation category listing
router.get("/categories/refined", CategoryController._listAll);

export { router as categoryRouter };
