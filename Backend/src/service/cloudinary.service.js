import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Simple memory storage
export const upload = multer({ storage: multer.memoryStorage() });

// Upload buffer to cloudinary
export async function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "bloom-tale" },
            (error, result) => {
                if (error) reject(error);
                else resolve({ url: result.secure_url, public_id: result.public_id });
            }
        ).end(buffer);
    });
}

// Delete from cloudinary
export async function deleteFromCloudinary(publicId) {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
}

