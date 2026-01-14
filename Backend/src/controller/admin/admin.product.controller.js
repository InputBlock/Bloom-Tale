import { addItem, listItem, unlistItem ,updateItem } from "../../admin/product.js";

const add_item = async (req, res) => {
    try {
        //cloudinary image upload logic can be added here
        const details = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            price: req.body.price,
            sizes: req.body.sizes,
            //images: IMAGE_URI,
            stock: req.body.stock
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

export { add_item, list_item, unlist_item , update_item};