import { models, model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, required: false },
        role: { type: String, required: true, default: "user" },
        resetToken: { type: String, required: false },
        resetTokenExpiry: { type: Date, required: false },
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
