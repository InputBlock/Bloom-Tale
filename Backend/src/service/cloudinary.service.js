import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bloom-tale/products",  
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }]
    }
});


export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPG, PNG, and WebP are allowed."), false);
        }
    }
});

export async function uploadItem(imagePath) {
    const result = await cloudinary.uploader.upload(imagePath, {
        folder: "bloom-tale/products",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }]
    });
    return {
        url: result.secure_url,
        public_id: result.public_id
    };
}

export async function deleteImage(publicId) {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
}

export default cloudinary;

