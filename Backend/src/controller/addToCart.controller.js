import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";
import Cart from "../models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { product_id, size, quantity, isCombo, combo_items, price, name, delivery_pincode, delivery_charge, subtotal, discount, discount_percentage } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //Change by Faraaaaaaaaaazzzzzzzzzzz for carttttttttttttttt start

  // Handle combo products differently
  if (isCombo) {
    if (!product_id || !quantity || !combo_items || combo_items.length === 0) {
      throw new ApiError(400, "Combo product requires product_id, quantity, and combo_items");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        username: user.username,
        email: user.email,
        items: [],
      });
    } else if (!cart.username || !cart.email) {
      cart.username = user.username;
      cart.email = user.email;
    }

    // Add combo as a single item
    cart.items.push({
      product_id: product_id,
      quantity: quantity,
      price: price,
      isCombo: true,
      name: name || 'Custom Combo Package',
      combo_items: combo_items,
      delivery_pincode: delivery_pincode,
      delivery_charge: delivery_charge,
      subtotal: subtotal,
      discount: discount,
      discount_percentage: discount_percentage
    });

    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Combo added to cart successfully"));
  }
  // Change by Faraaaaaaaaaazzzzzzzzzzz for carttttttttttttttt end
  // Regular product handling
  if (!product_id || !size || !quantity) {
    throw new ApiError(400, "Product id, size and quantity are required");
  }

  if (!["small", "medium", "large"].includes(size)) {
    throw new ApiError(400, "Invalid size selected");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const product = await Product.findOne({ product_id });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Get price FROM DB (IMPORTANT)
  const productPrice = product.pricing[size];
  if (!productPrice) {
    throw new ApiError(400, "Price not defined for selected size");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      username: user.username,
      email: user.email,
      items: [],
    });
  } else if (!cart.username || !cart.email) {
    // Update existing cart with missing user info
    cart.username = user.username;
    cart.email = user.email;
  }

  // check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product_id === product_id && item.size === size && !item.isCombo
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      product_id: product.product_id,
      size,
      quantity,
      price: productPrice, // ✅ DB-derived snapshot
    });
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart"));
});
