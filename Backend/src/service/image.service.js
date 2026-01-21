import ImageKit from "imagekit"
import multer from "multer"

// Multer for file uploads (memory storage for ImageKit)
const upload = multer({ storage: multer.memoryStorage() })

// Initialize ImageKit instance
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

// Upload image
const uploadImage = async (file, fileName, folder = "bloomtalestatus") => {
    try {
        // Convert buffer to base64 if needed
        const fileData = Buffer.isBuffer(file) ? file.toString('base64') : file;
        
        const response = await imagekit.upload({
            file: fileData,
            fileName: fileName,
            folder: folder
        })
        return response
    } catch (error) {
        throw new Error(`ImageKit upload failed: ${error.message}`)
    }
}

// Delete image by fileId
const deleteImage = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId)
        return { success: true }
    } catch (error) {
        throw new Error(`ImageKit delete failed: ${error.message}`)
    }
}

// Get transformed URL
const getTransformedUrl = (filePath, transformations = []) => {
    return imagekit.url({
        path: filePath,
        transformation: transformations
    })
}

export { imagekit, upload, uploadImage, deleteImage, getTransformedUrl }