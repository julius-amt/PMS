import { Response, Request } from "express";
import { requestBodyErrorsInterrupt } from "@/utils/middleware/handleReqBodyErrors";
import { matchedData } from "express-validator";
import { Types } from "mongoose";
import Category from "@/models/categories";

class CategoryController {
    static async categories() {
        return await Category.find();
    }

    static async listAll(req: Request, res: Response) {
        res.render("./categories/categories", {
            categories: await CategoryController.categories(),
        });
    }

    // get all category endpoint for product creation page category selection
    static async _listAll(req: Request, res: Response) {
        try {
            const categories = await CategoryController.categories();
            const refinedCategories = categories.map((category) => ({
                id: category._id,
                name: category.name,
            }));

            res.json({ categories: refinedCategories });
        } catch (error) {
            res.status(500).json({
                error: "An error occurred while fetching categories.",
            });
        }
    }

    static async createCategory(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { name, description } = matchedData(req);
        const categoryExist = await Category.findOne({ name });
        if (categoryExist) {
            res.status(400).render("./categories/create");
            return;
        }

        const newCategory = new Category({
            name,
            description,
        });
        await newCategory.save();
        res.status(201).render("./categories/create", {
            message: "Category created successfuly!",
        });
    }

    static async createCategoryPage(req: Request, res: Response) {
        res.render("./categories/create");
    }

    // update category endpoint
    static async updateCategory(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { categoryId } = req.params;
        if (!categoryId || !Types.ObjectId.isValid(categoryId as string)) {
            res.status(400).json({
                error: "Category ID is required",
                success: false,
            });
            return;
        }

        const { name, description } = matchedData(req);
        const categoryExist = await Category.findById(categoryId);
        if (!categoryExist) {
            res.status(400).json({
                error: "Category not found!",
                success: false,
            });
            return;
        }

        await Category.findByIdAndUpdate(categoryId, { name, description });

        res.status(200).json({
            message: "Category updated successfully",
            success: true,
        });
    }

    static async deleteCategory(req: Request, res: Response) {
        const { categoryId } = req.params;
        console.log(`request path: ${req.params}`);
        if (!categoryId || !Types.ObjectId.isValid(categoryId as string)) {
            res.status(400).json({
                error: "Category ID is required",
                success: false,
            });
            return;
        }

        // Attempt to delete the category
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            res.status(404).json({
                error: "Category not found",
                success: false,
            });
            return;
        }

        res.status(200).json({
            message: "Category deleted successfully",
            success: true,
        });
    }
}

export default CategoryController;
