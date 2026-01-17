import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";
import Cart from "../models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { product_id, size, quantity } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

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

  // 4️⃣ Validate size availability
  // if (!product.sizes.includes(size)) {
  //   throw new ApiError(400, "Selected size not available for this product");
  // }

  // 5️⃣ Get price FROM DB (IMPORTANT)
  const price = product.pricing[size];
  if (!price) {
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
    (item) => item.product_id === product_id && item.size === size
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      product_id: product.product_id,
      size,
      quantity,
      price, // ✅ DB-derived snapshot
    });
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart"));
});
