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
        const { categoryId } = req.query;

        if (categoryId) {
            if (!Types.ObjectId.isValid(categoryId as string)) {
                res.status(400).render("./products/products");
                return;
            }

            try {
                // Validate and find the category
                const _category = await Category.findById(categoryId);
                if (!_category) {
                    res.status(404).json({ message: "Category not found!" });
                    return;
                }

                const filteredProducts = await Product.filterProductsByCategory(
                    _category.name
                );

                res.render("./products/products", {
                    products: filteredProducts,
                });
                return;
            } catch (err: any) {
                console.error(
                    "Error filtering products by category:",
                    err.message
                );
                res.status(500).json({ message: "Internal Server Error" });
                return;
            }
        }
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
            res.status(400).json({ message: "Invalid Product ID" });
            return;
        }

        try {
            const product = await Product.findById(productId).populate(
                "category"
            );

            if (!product) {
                res.status(404).json({ message: "Product not found!" });
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
        // Handle validation errors using the custom middleware
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { productId } = req.params;

        // Validate productId
        if (!Types.ObjectId.isValid(productId)) {
            res.status(400).json({
                message: "Invalid Product ID",
                success: false,
            });
            return;
        }

        const { name, description, categoryId, price, stock } =
            matchedData(req);

        if (!Types.ObjectId.isValid(categoryId)) {
            res.status(400).json({
                message: "Invalid category ID",
                success: false,
            });
            return;
        }

        // Check if category exists
        const categoryExist = await Category.findById(categoryId);
        if (!categoryExist) {
            res.status(400).json({
                message: "Category not found",
                success: false,
            });
            return;
        }

        // set image file
        const image = req.file;

        //get old image file path to be removed from server
        const oldProductInfo = await Product.findById(productId);

        try {
            const product = await Product.findByIdAndUpdate(
                productId,
                {
                    name,
                    description,
                    category: new Types.ObjectId(categoryId),
                    price,
                    stock,
                    image: image?.filename,
                },
                { new: true }
            );

            // remove old omage from server
            const pathToOldImage = path.resolve(
                __dirname,
                "..",
                "..",
                "public",
                "products",
                oldProductInfo?.image as string
            );

            console.log(pathToOldImage);
            fs.unlinkSync(pathToOldImage);

            if (!product) {
                res.status(404).json({
                    message: "Product not found",
                    success: false,
                });
                return;
            }

            res.status(200).json({
                message: "Product updated successfully",
                success: true,
                product,
            });
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
            });
        }
    }
}

export default ProductController;
