import { models, model, Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        price: { type: Number, required: true, default: 0, min: 0 },
        stock: { type: Number, required: true, default: 0, min: 0 },
        image: { type: String, required: false },
    },
    { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
