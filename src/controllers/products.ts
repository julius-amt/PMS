import { requestBodyErrorsInterrupt } from "@/utils/middleware/handleReqBodyErrors";
import { Response, Request } from "express";
import { matchedData } from "express-validator";
import Product from "@/models/products";
import Category from "@/models/categories";
import { Types } from "mongoose";

class ProductController {
    static async products() {
        return await Product.find();
    }

    static async listAll(req: Request, res: Response) {
        res.render("./products/products", {
            products: await ProductController.products(),
        });
    }

    static async createProduct(req: Request, res: Response) {
        // Handle validation errors using the custom middleware
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { name, description, categoryId, price, stock } =
            matchedData(req);

        if (!Types.ObjectId.isValid(categoryId)) {
            res.status(400).render("products/create", {
                error: "Invalid category ID!",
                formData: { name, description, price, stock },
            });
            return;
        }

        // Check if category exists
        const categoryExist = await Category.findById(categoryId);
        if (!categoryExist) {
            res.status(400).render("products/create", {
                error: "Category not found!",
                formData: { name, description, categoryId, price, stock },
            });
            return;
        }

        // Check if the image file was uploaded
        const imageFilename = req.file?.filename;
        if (!imageFilename) {
            res.status(400).render("products/create", {
                error: "Image file is required!",
            });
            return;
        }

        // Create a new product
        try {
            const newProduct = new Product({
                name,
                description,
                categories: [new Types.ObjectId(categoryId)],
                price,
                stock,
                image: imageFilename,
            });
            await newProduct.save();
            res.status(201).redirect("/products/create");
        } catch (error) {
            res.status(500).render("products/create", {
                error: "An error occurred while creating the product.",
            });
        }
    }

    static async createProductPage(req: Request, res: Response) {
        res.render("./products/create");
    }

    static async productDetailsPage(req: Request, res: Response) {
        const { productId } = req.params;
        console.log(`Product ID: ${productId}`);

        // Validate productId
        if (!Types.ObjectId.isValid(productId)) {
            res.status(400).json({ message: "Invalid Product ID" });
            return;
        }

        try {
            const product = await Product.findById(productId).populate(
                "categories"
            );

            if (!product) {
                res.status(404).json({ message: "Product not found!" });
                return;
            }

            console.log("Product Details:", product);

            res.render("./products/detail", {
                product,
                categories: product.categories,
            });
        } catch (error) {
            console.error("Error fetching product details:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default ProductController;
