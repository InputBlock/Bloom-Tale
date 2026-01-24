
import productSchema from "../models/product.js";

// Categories that use single pricing ONLY (no sizes) - product_type: "simple"
const SINGLE_PRICE_CATEGORIES = ["Candles", "Combos", "Balloons"];

// Helper to determine product_type from category
const getProductType = (category) => {
  return SINGLE_PRICE_CATEGORIES.includes(category) ? "simple" : "sized";
};

export async function addItem(details) {
    // Validation
    if (!details.name || !details.name.trim()) {
        throw new Error("Product name is required");
    }
    if (!details.category || !details.category.trim()) {
        throw new Error("Category is required");
    }
    
    // Different pricing validation based on category
    const isSinglePriceCategory = SINGLE_PRICE_CATEGORIES.includes(details.category.trim());
    
    if (isSinglePriceCategory) {
        // For Candles/Combos/Balloons - use single price field, no sizes
        if (!details.price || details.price <= 0) {
            throw new Error("Price is required and must be greater than 0");
        }
        // Clear pricing object for single-price products
        details.pricing = { small: null, medium: null, large: null };
        details.sizes = []; // No sizes for simple products
        details.product_type = "simple";
        details.pricing_type = "fixed";
    } else {
        // For other categories (Flowers) - check pricing_type
        const pricingType = details.pricing_type || "sized"; // Default to sized
        
        if (pricingType === "both") {
            // Both pricing options - require fixed price and at least one size price
            if (!details.price || details.price <= 0) {
                throw new Error("Fixed price is required when using both pricing options");
            }
            if (!details.pricing || (!details.pricing.small && !details.pricing.medium && !details.pricing.large)) {
                throw new Error("At least one size price is required when using both pricing options");
            }
            details.product_type = "sized";
            details.pricing_type = "both";
        } else if (pricingType === "fixed") {
            // Fixed price only
            if (!details.price || details.price <= 0) {
                throw new Error("Price is required and must be greater than 0");
            }
            details.pricing = { small: null, medium: null, large: null };
            details.product_type = "simple";
            details.pricing_type = "fixed";
        } else {
            // Sized pricing (default)
            if (!details.pricing || !details.pricing.small || !details.pricing.medium || !details.pricing.large) {
                throw new Error("All pricing tiers (small, medium, large) are required");
            }
            if (details.pricing.small <= 0 || details.pricing.medium <= 0 || details.pricing.large <= 0) {
                throw new Error("All prices must be greater than 0");
            }
            details.price = null;
            details.product_type = "sized";
            details.pricing_type = "sized";
        }
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

    // Handle single-price categories (Candles, Combos, Balloons)
    const category = updateData.category || existing.category;
    const isSinglePrice = SINGLE_PRICE_CATEGORIES.includes(category);
    
    if (isSinglePrice) {
        // For single-price categories - use price field, clear pricing
        if (updateData.price) {
            updateData.pricing = { small: null, medium: null, large: null };
            updateData.sizes = [];
        }
        updateData.product_type = "simple";
        updateData.pricing_type = "fixed";
    } else {
        // For flower categories - check pricing_type
        const pricingType = updateData.pricing_type || existing.pricing_type || "sized";
        
        if (pricingType === "fixed") {
            // Fixed price for flower
            if (updateData.price) {
                updateData.pricing = { small: null, medium: null, large: null };
            }
            updateData.product_type = "simple";
            updateData.pricing_type = "fixed";
        } else {
            // Size-based pricing
            if (updateData.pricing) {
                updateData.price = null;
            }
            updateData.product_type = "sized";
            updateData.pricing_type = "sized";
        }
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


export async function getList() {
    const list = await productSchema.find();

    return {
        total: list.length,
        flowers: list.map(item => ({
            id: item.product_id,
            name: item.name,
            description: item.description,
            category: item.category,
            subcategory: item.subcategory,
            product_type: item.product_type || (SINGLE_PRICE_CATEGORIES.includes(item.category) ? "simple" : "sized"),
            pricing_type: item.pricing_type || (SINGLE_PRICE_CATEGORIES.includes(item.category) ? "fixed" : "sized"),
            price: item.price, // Single price for Candles/Combos/Balloons or fixed price flowers
            pricing: item.pricing, // Size-based pricing for other products
            sizes: item.sizes,
            stock: item.stock,
            images: item.images_uri || [],
            isActive: item.is_active,
            isBestSeller: item.bestSeller,
            isCombo: item.combo,
            sameDayDelivery: item.same_day_delivery,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }))
    };
}