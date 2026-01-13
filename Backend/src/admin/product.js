
import productSchema from "../models/product.js";

export async function addItem(details) {
    const existing=await productSchema.findOne({name:details.name})
    if (existing) {
        throw new Error("Product with this name already exists");
    }
    const p = new productSchema(details);
    return await p.save();
}

export async function listItem(name) {
    const existing=await productSchema.findOne({name:name})
    if(!existing){
        throw new Error("Prouct is not available");
    }
    existing.is_active=true;
    return await existing.save();
}

export async function unlistItem(name) {
    const existing = await productSchema.findOne({ name: name })
    if (!existing) {
        throw new Error("Product is not available");
    }
    existing.is_active = false;
    return await existing.save();
}











