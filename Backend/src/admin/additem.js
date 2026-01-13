
import productSchema from "../models/product.js";

export async function addItem(details) {
    const existing=await productSchema.findOne({name:details.name})
    if (existing) {
        throw new Error("Product with this name already exists");
    }
    const p = new productSchema(details);
    return await p.save();
}
