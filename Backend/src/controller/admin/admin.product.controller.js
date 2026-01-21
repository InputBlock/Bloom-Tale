import { addItem, listItem, unlistItem, updateItem, deleteItem, getList } from "../../admin/product.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../service/cloudinary.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Categories that use single pricing (no sizes) - product_type: "simple"
const SINGLE_PRICE_CATEGORIES = ["Candles", "Combos", "Balloons"];

const add_item = asyncHandler(async (req, res) => {
    let images_uri = [];
    let image_public = [];

    // Handle multiple images - first image is the main image
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);
            images_uri.push(result.url);
            image_public.push(result.public_id);
        }
    }

    const category = req.body.category;
    const isSinglePrice = SINGLE_PRICE_CATEGORIES.includes(category);

    const details = {
        name: req.body.name,
        description: req.body.description,
        category: category,
        // For Candles/Combos: use single price field
        // For others: use pricing object with sizes
        price: isSinglePrice ? parseFloat(req.body.price) || 0 : null,
        pricing: isSinglePrice 
            ? { small: null, medium: null, large: null } 
            : (req.body.pricing ? JSON.parse(req.body.pricing) : { small: 0, medium: 0, large: 0 }),
        sizes: isSinglePrice ? [] : (req.body.sizes ? JSON.parse(req.body.sizes) : ["Small", "Medium", "Large"]),
        discount_percentage: parseFloat(req.body.discount_percentage) || 0,
        images_uri: images_uri,
        image_public: image_public,
        stock: parseInt(req.body.stock) || 0,
        bestSeller: req.body.bestSeller === 'true' || req.body.bestSeller === true,
        combo: req.body.combo === 'true' || req.body.combo === true,
        same_day_delivery: req.body.same_day_delivery === 'true' || req.body.same_day_delivery === true,
        is_active: req.body.is_active === 'true' || req.body.is_active === true || req.body.is_active === undefined
    };

    const p = await addItem(details);
    return res.status(201).json(
        new ApiResponse(201, p, "Product added successfully")
    );
});
const list_item = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }
    const p = await listItem(id);
    return res.status(200).json(
        new ApiResponse(200, p, "Product listed successfully")
    );
});

const unlist_item = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }
    const p = await unlistItem(id);
    return res.status(200).json(
        new ApiResponse(200, p, "Product unlisted successfully")
    );
});

const update_item = asyncHandler(async (req, res) => {
    const { id, ...updateData } = req.body;

    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }

    const updated = await updateItem(id, updateData);

    return res.status(200).json(
        new ApiResponse(200, updated, "Product updated successfully")
    );
});

const delete_item = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }
    const result = await deleteItem(id);

    // Delete images from cloudinary
    if (result.image_public && result.image_public.length > 0) {
        for (const publicId of result.image_public) {
            await deleteFromCloudinary(publicId);
        }
    }

    return res.status(200).json(
        new ApiResponse(200, { product_id: id }, "Product deleted successfully")
    );
});

const get_list = asyncHandler(async (req, res) => {
    const data = await getList();
    return res.status(200).json(
        new ApiResponse(200, data, "Products fetched successfully")
    );
});

export { add_item, list_item, unlist_item, update_item, delete_item, get_list };