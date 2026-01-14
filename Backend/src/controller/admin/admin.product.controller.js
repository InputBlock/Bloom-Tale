import { addItem, listItem, unlistItem, updateItem, deleteItem ,getList} from "../../admin/product.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../service/cloudinary.service.js";

const add_item = async (req, res) => {
    try {
        let images_uri = [];
        let image_public = [];
        
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            images_uri.push(result.url);
            image_public.push(result.public_id);
        }

        const details = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            price: parseFloat(req.body.price) || 0,
            sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
            images_uri: images_uri,
            image_public: image_public,
            stock: parseInt(req.body.stock) || 0,
            bestSeller: req.body.bestSeller === 'true' || req.body.bestSeller === true
        };

        const p = await addItem(details);
        return res.status(201).json(p);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
const list_item = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        const p = await listItem(id);
        return res.status(200).json(p);
    } catch (err) {
        const statusCode = err.message.includes("not available") ? 404 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
}

const unlist_item = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        const p = await unlistItem(id);
        return res.status(200).json(p);
    } catch (err) {
        const statusCode = err.message.includes("not available") ? 404 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
}

const update_item = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;

        if (!id) {
            return res.status(400).json({ error: "id is required" });
        }

        const updated = await updateItem(id, updateData);

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
};

const delete_item = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        const result = await deleteItem(id);
        
        // Delete images from cloudinary
        if (result.image_public && result.image_public.length > 0) {
            for (const publicId of result.image_public) {
                await deleteFromCloudinary(publicId);
            }
        }
        
        return res.status(200).json({ message: "Product deleted", product_id: id });
    } catch (err) {
        const statusCode = err.message.includes("not found") ? 404 : 500;
        return res.status(statusCode).json({ error: err.message });
    }
};

const get_list = async (req, res) => {
    try {
        const data = await getList();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export { add_item, list_item, unlist_item, update_item, delete_item  , get_list};