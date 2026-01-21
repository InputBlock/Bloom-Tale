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
    const product = await Product.findOne({
      product_id: item.product_id,
      is_active: true,
    });

    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product_id}`);
    }

    let price;

    // 🔹 DB-based price calculation
    if (product.product_type === "sized") {
      if (!item.size || !product.pricing[item.size]) {
        throw new ApiError(400, `Invalid size for ${product.name}`);
      }
      price = product.pricing[item.size];
    } else {
      price = product.price;
    }

    if (!price) {
      throw new ApiError(400, `Price not available for ${product.name}`);
    }

    subtotal += price * item.quantity;

    validatedItems.push({
      product: product._id,
      product_id: product.product_id,
      name: product.name,
      size: item.size || null,
      color: item.color?.name || item.color || null,
      quantity: item.quantity,
      price,
    });
  }

  // 🔹 Combo discount logic (backend controlled)
  const discountPercentage = 20;
  const discount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discount;

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
    price: total, // final combo price
    combo_items: validatedItems,
    subtotal,
    discount,
    discount_percentage: discountPercentage,
    delivery_pincode,
  });

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Combo added to cart successfully"));
});
