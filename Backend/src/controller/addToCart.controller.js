import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.js";
import Cart from "../models/cart.model.js";


export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { product_id, quantity } = req.body;

  const user=await User.findById(userId);
  if(!user){
    throw new ApiError(404, "User not found");
  }

  if (!product_id || !quantity)
    throw new ApiError(400, "Product id and quantity are required");

  const product = await Product.findOne({ product_id });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

    let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      username: user.username,
      email: user.email,
      items: [],
    });
  }

   // check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product_id === product_id
  );

  if (itemIndex > -1) {
    // update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // add new item
    cart.items.push({
      product: product._id,
      product_id: product.product_id,
      quantity,
      price: product.price,
    });
  }

  await cart.save();

  return res.status(200).json(
    new ApiResponse(200, cart, "Product added to cart")
  );
});
