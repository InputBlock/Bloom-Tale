
import productSchema from "../models/product.js";

export async function addItem(details) {
    // Validation
    if (!details.name || !details.name.trim()) {
        throw new Error("Product name is required");
    }
    if (!details.category || !details.category.trim()) {
        throw new Error("Category is required");
    }
    if (!details.price || details.price <= 0) {
        throw new Error("Valid price is required");
    }

    const existing = await productSchema.findOne({ name: details.name.trim() });
    if (existing) {
        throw new Error("Product with this name already exists");
    }
    

    let retries = 3;
    while (retries > 0) {
        try {
            const lastProduct = await productSchema.findOne({ product_id: { $regex: /^PRO\d+$/ } }).sort({ createdAt: -1 });
            let nextNum = 1;
            if (lastProduct && lastProduct.product_id) {
                const match = lastProduct.product_id.match(/PRO(\d+)/);
                if (match) {
                    nextNum = parseInt(match[1]) + 1;
                }
            }
            details.product_id = `PRO${nextNum}`;
            details.name = details.name.trim();
            
            const p = new productSchema(details);
            return await p.save();
        } catch (err) {
            if (err.code === 11000 && retries > 1) {
                retries--;
                continue;
            }
            throw err;
        }
    }
}

export async function listItem(id) {
    if (!id || !id.trim()) {
        throw new Error("Product ID is required");
    }
    const existing = await productSchema.findOne({ product_id: id.trim() });
    if (!existing) {
        throw new Error("Product is not available");
    }
    existing.is_active = true;
    return await existing.save();
}

export async function unlistItem(id) {
    if (!id || !id.trim()) {
        throw new Error("Product ID is required");
    }
    const existing = await productSchema.findOne({ product_id: id.trim() });
    if (!existing) {
        throw new Error("Product is not available");
    }
    existing.is_active = false;
    return await existing.save();
}

export async function updateItem(id, updateData) {
    if (!id || !id.trim()) {
        throw new Error("Product ID is required");
    }
    
    // Prevent updating product_id
    delete updateData.product_id;
    delete updateData._id;
    
    const existing = await productSchema.findOne({ product_id: id.trim() });
    if (!existing) {
        throw new Error("Product not found");
    }
    
    Object.assign(existing, updateData);
    return await existing.save();
}

export async function deleteItem(id) {
    if (!id || !id.trim()) {
        throw new Error("Product ID is required");
    }
    const existing = await productSchema.findOne({ product_id: id.trim() });
    if (!existing) {
        throw new Error("Product not found");
    }
    await productSchema.deleteOne({ product_id: id.trim() });
    return { deleted: true, product_id: id, image_public: existing.image_public };
}












