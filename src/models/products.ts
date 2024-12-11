import { models, model, Schema, Model, Document } from "mongoose";

// Define an interface for the Product document
interface IProduct extends Document {
    name: string;
    description: string;
    category: Schema.Types.ObjectId;
    price: Schema.Types.Decimal128;
    stock: number;
    image?: string;
}

// Define a custom static method interface
interface ProductModel extends Model<IProduct> {
    filterProductsByCategory(categoryName: string): Promise<IProduct[]>;
}

// Define the schema
const ProductSchema = new Schema<IProduct>(
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

// Add the static method
ProductSchema.statics.filterProductsByCategory = async function (
    categoryName: string
) {
    return await this.find()
        .populate("category")
        .where("category.name")
        .equals(categoryName);
};

const Product = (models.Product ||
    model<IProduct, ProductModel>("Product", ProductSchema)) as ProductModel;

export default Product;
