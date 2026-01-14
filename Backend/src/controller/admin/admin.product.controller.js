import { addItem, listItem, unlistItem } from "../../admin/product.js";

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
        const { name } = req.body;
        const p = await listItem(name);
        return res.status(200).json(p);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const unlist_item = async (req, res) => {
    try {
        const { name } = req.body;
        const p = await unlistItem(name);
        return res.status(200).json(p);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export { add_item, list_item, unlist_item };