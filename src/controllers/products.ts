import { requestBodyErrorsInterrupt } from "@/utils/middleware/handleReqBodyErrors";
import { Response, Request } from "express";
import { matchedData } from "express-validator";
import Product from "@/models/products";
import Category from "@/models/categories";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";

class ProductController {
    static async products() {
        return await Product.find();
    }

    static async listAll(req: Request, res: Response) {
        const { categoryId, sortBy } = req.query;
        console.log(`Is category ${categoryId} and sort by ${sortBy}`);

        try {
            let sortOption = {};
            if (sortBy === "title-asc") {
                sortOption = { name: 1 }; // Ascending order
            } else if (sortBy === "title-desc") {
                sortOption = { name: -1 }; // Descending order
            }

            if (categoryId) {
                // If categoryId exists, validate and fetch filtered products by category
                if (!Types.ObjectId.isValid(categoryId as string)) {
                    res.status(400).render("./products/products");
                    return;
                }

                const _category = await Category.findById(categoryId);
                if (!_category) {
                    res.status(404).render("./products/products", {
                        error: "Category not found!",
                    });
                    return;
                }

                // Filter products by category and apply sorting
                const filteredProducts = await Product.find({
                    category: _category._id,
                }).sort(sortOption);

                res.render("./products/products", {
                    products: filteredProducts,
                });
                return;
            }

            const allProducts = await Product.find({}).sort(sortOption);
            res.render("./products/products", {
                products: allProducts,
            });
        } catch (err: any) {
            console.error("Error fetching products:", err.message);
            res.status(500).render("./products/products", {
                message: "Internal Server Error",
            });
        }
    }

    static async createProduct(req: Request, res: Response) {
        // Handle validation errors using the custom middleware
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { name, description, categoryId, price, stock } =
            matchedData(req);
        console.log(name, description, categoryId, price, stock);
        console.log(req.body);

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
                category: new Types.ObjectId(categoryId),
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

        // Validate productId
        if (!Types.ObjectId.isValid(productId)) {
            res.status(400).render("./products/detail", {
                message: "Invalid Product ID",
            });
            return;
        }

        try {
            const product = await Product.findById(productId).populate(
                "category"
            );
            console.log("Simgle product found", product);

            if (!product) {
                res.status(404).render("./products/detail", {
                    message: "Product not found!",
                });
                return;
            }

            // select all other products with their categories
            const otherProducts = await Product.find({
                _id: { $ne: productId },
                category: product.category,
            }).populate("category");

            res.render("./products/detail", {
                product,
                category: product.category,
                otherProducts,
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        const { productId } = req.params;

        // Validate productId
        if (!Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                message: "Invalid Product ID",
                success: false,
            });
            return;
        }

        const productInfo = await Product.findById(productId);

        try {
            await Product.findByIdAndDelete(productId);

            // remove old omage from server
            const pathToOldImage = path.resolve(
                __dirname,
                "..",
                "..",
                "public",
                "products",
                productInfo?.image as string
            );

            console.log(pathToOldImage);
            fs.unlinkSync(pathToOldImage);

            res.status(200).json({
                message: "Product deleted successfully",
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
            });
        }
    }

    static async updateProduct(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { productId } = req.params;

        if (!Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                message: "Invalid Product ID",
                success: false,
            });
            return;
        }

        const { name, description, categoryId, price, stock } =
            matchedData(req);

        const categoryExist = await Category.findById(categoryId);
        if (!categoryExist) {
            res.status(400).json({
                message: "Category not found",
                success: false,
            });
            return;
        }

        const image = req.file;
        const oldProductInfo = await Product.findById(productId);

        if (!oldProductInfo) {
            res.status(404).json({
                message: "Product not found",
                success: false,
            });
            return;
        }

        const pathToOldImage = path.resolve(
            path.resolve(__dirname, "..", "..", "public", "products"),
            oldProductInfo.image as string
        );

        try {
            const product = await Product.findByIdAndUpdate(
                productId,
                {
                    name,
                    description,
                    category: new Types.ObjectId(categoryId),
                    price,
                    stock,
                    image: image?.filename ?? oldProductInfo.image,
                },
                { new: true }
            );

            if (!product) {
                res.status(404).json({
                    message: "Product not found",
                    success: false,
                });
                return;
            }

            // Remove old image file if a new one was uploaded
            if (image && fs.existsSync(pathToOldImage)) {
                fs.unlink(pathToOldImage, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }

            res.status(200).json({
                message: "Product updated successfully",
                success: true,
                product,
                imageUpdated: !!image?.filename,
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
            });
        }
    }

    static async queryProductByNameOrDesc(req: Request, res: Response) {
        const { query } = req.body;
        console.log("Search query is:", query);

        if (!query) {
            return res.render("./products/search-result", {
                error: "Please enter a search query",
            });
        }

        try {
            const products = await Product.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                ],
            });

            res.render("./products/search-result", {
                searchProducts: products,
            });
        } catch (error) {
            res.status(500).render("./products/products", {
                products: await ProductController.products(),
                error: "Error fetching products",
            });
        }
    }
}

export default ProductController;
