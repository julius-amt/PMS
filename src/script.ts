import express, { json, urlencoded } from "express";
import morgan from "morgan";
import { authRouter } from "@/routes/auth";
import path from "path";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

// static files
app.use(express.static(path.resolve(__dirname, "..", "public")));

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// auth routes
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
