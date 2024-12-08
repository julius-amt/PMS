import { requestBodyErrorsInterrupt } from "@/utils/middleware/handleReqBodyErrors";
import { Response, Request } from "express";
import { matchedData } from "express-validator";
import Product from "@/models/products";
import Category from "@/models/categories";

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
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { name, description, categoryId, price, stock } =
            matchedData(req);

        const categoryExist = await Category.findById({ _id: categoryId });
        if (!categoryExist) {
            res.status(400).render("products", {
                error: "Category not found!",
            });
            return;
        }

        const newProduct = new Product({
            name,
            description,
            categoryId: [categoryId],
            price,
            stock,
        });
        await newProduct.save();
        res.status(201).redirect("/products/prducts");
    }

    static async createProductPage(req: Request, res: Response) {
        res.render("./products/create");
    }
}

export default ProductController;
