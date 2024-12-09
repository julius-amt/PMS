import { models, model, Schema, Types } from "mongoose";

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category" }, // Reference to Category
        price: {
            type: Schema.Types.Decimal128,
            required: true,
            default: 0,
            min: 0,
        },
        stock: { type: Number, required: true, default: 0, min: 0 },
        image: { type: String, required: false },
    },
    { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
