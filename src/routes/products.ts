import { Router } from "express";
import ProductController from "../controllers/products";
import { productCreateValidationSchema } from "@/utils/middleware/validators/product";
import { checkSchema } from "express-validator";
import { uploadProductImage } from "@/utils/middleware/multer";

const router = Router();

router.post(
    "/create",
    uploadProductImage.single("productImage"),
    checkSchema(productCreateValidationSchema),
    ProductController.createProduct
);

router.get("/", ProductController.listAll);
router.get("/create", ProductController.createProductPage);

export { router as productRouter };
