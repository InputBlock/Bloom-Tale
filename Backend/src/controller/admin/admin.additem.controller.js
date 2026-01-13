import { addItem } from "../../admin/additem.js";

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
export default add_item;