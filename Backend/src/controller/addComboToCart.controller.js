import User from "../models/user.model.js";
import Product from "../models/product.js";
import Cart from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addComboToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { combo_items, delivery_pincode } = req.body;

  if (!combo_items || combo_items.length === 0) {
    throw new ApiError(400, "Combo items are required");
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of combo_items) {
    // Find product - allow is_active: true OR undefined (for backwards compatibility)
    const product = await Product.findOne({
      product_id: item.product_id,
      $or: [{ is_active: true }, { is_active: { $exists: false } }]
    });

    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product_id}`);
    }

    let price;

    // Categories that use single pricing (no sizes)
    const SINGLE_PRICE_CATEGORIES = ["Candles", "Combos", "Balloons"];
    const isSinglePrice = product.product_type === "simple" || 
                          SINGLE_PRICE_CATEGORIES.includes(product.category);

    // 🔹 DB-based price calculation
    if (isSinglePrice) {
      // Balloons, Candles, Combos - use single price
      // Fallback: if price is not set, try to use pricing.medium or pricing.small
      price = product.price || product.pricing?.medium || product.pricing?.small || product.pricing?.large;
    } else if (item.size) {
      // Product has size selected - use sized pricing
      const sizeKey = item.size.toLowerCase();
      if (product.pricing?.[sizeKey]) {
        price = product.pricing[sizeKey];
      } else {
        throw new ApiError(400, `Invalid size '${item.size}' for ${product.name}`);
      }
    } else if (product.price) {
      // Fallback to single price if no size and price exists
      price = product.price;
    } else if (product.pricing?.medium) {
      // Fallback to medium pricing if available
      price = product.pricing.medium;
    } else {
      throw new ApiError(400, `No valid price configuration for ${product.name}`);
    }

    if (!price) {
      throw new ApiError(400, `Price not available for ${product.name}`);
    }

    subtotal += price * item.quantity;

    validatedItems.push({
      product: product._id,
      product_id: product.product_id,
      name: product.name,
      size: item.size?.toLowerCase() || null,
      color: item.color?.name || item.color || null,
      quantity: item.quantity,
      price,
    });
  }

  // 🔹 Combo discount logic (backend controlled)
  const discountPercentage = 20;
  const discount = (subtotal * discountPercentage) / 100;
  const discountedTotal = subtotal - discount;
  
  // 🔹 Free delivery threshold
  const FREE_DELIVERY_THRESHOLD = 1500;
  const comboDeliveryCharge = 199;
  
  // Check if combo qualifies for free delivery:
  // - If discounted price >= threshold → FREE
  // - If discounted + delivery >= threshold → also FREE (edge case)
  const qualifiesForFreeDelivery = discountedTotal >= FREE_DELIVERY_THRESHOLD || 
                                   (discountedTotal + comboDeliveryCharge) >= FREE_DELIVERY_THRESHOLD;
  
  const finalDeliveryCharge = qualifiesForFreeDelivery ? 0 : comboDeliveryCharge;
  const finalPrice = discountedTotal + finalDeliveryCharge;
  
  // Calculate total savings (discount + free delivery if applicable)
  const totalSaved = discount + (qualifiesForFreeDelivery ? comboDeliveryCharge : 0);

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const comboCount = cart.items.filter((item) => item.isCombo).length;
  const comboName = `Combo ${comboCount + 1}`;

  cart.items.push({
    product_id: `COMBO_${Date.now()}`,
    isCombo: true,
    comboName: comboName,
    quantity: 1, // quantity of combo
    price: finalPrice, // final combo price
    combo_items: validatedItems,
    subtotal,
    discount: totalSaved, // Total savings (discount + free delivery)
    discount_percentage: discountPercentage,
    delivery_pincode,
    delivery_charge: finalDeliveryCharge,
    freeDeliveryApplied: qualifiesForFreeDelivery,
  });

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Combo added to cart successfully"));
});
