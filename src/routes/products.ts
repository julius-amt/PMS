import { Router } from "express";
import { productCreateValidationSchema } from "@/utils/middleware/validators/product";
import { checkSchema } from "express-validator";
import { uploadProductImage } from "@/utils/middleware/multer";
import ProductController from "../controllers/products";

const router = Router();

router.post(
    "/create",
    uploadProductImage.single("productImage"),
    checkSchema(productCreateValidationSchema),
    ProductController.createProduct
);
router.put(
    "/:productId",
    uploadProductImage.single("productImage"),
    checkSchema(productCreateValidationSchema),
    ProductController.updateProduct
);
router.delete("/:productId", ProductController.deleteProduct);

router.get("/", ProductController.listAll);
router.get("/create", ProductController.createProductPage); // the arrangement of these 2 routes is intentional here
router.get("/:productId", ProductController.productDetailsPage);

export { router as productRouter };
