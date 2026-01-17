import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

import order from "../models/order.model.js";

export const getMyOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get all orders for the user, sorted by newest first
  const orders = await order.find({ user: userId })
    .populate('items.product', 'name images_uri price') // Populate product details
    .sort({ createdAt: -1 }); // Newest orders first

  return res.status(200).json(new ApiResponse(
    200,
    orders,
    "Orders fetched successfully"
  ))
  
});
