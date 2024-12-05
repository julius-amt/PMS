import multer from "multer";
import path from "path";

const pathToUploads = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "public/avatars"
);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pathToUploads);
    },
    filename: (req, file, cb) => {
        const filename = `${new Date().toUTCString()}-${file.originalname}`;
        console.log("filename", filename);

        cb(null, filename);
    },
});

export const uploadImage = multer({ storage });
