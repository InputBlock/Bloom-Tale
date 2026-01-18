import Order from "../../models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Get all orders (for admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate("user", "username email mobile")
    .populate("items.product", "name images_uri price")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalOrders = await Order.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    }, "Orders fetched successfully")
  );
});

// Get single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("user", "username email mobile")
    .populate("items.product", "name images_uri price description");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, "Order fetched successfully")
  );
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "PLACED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "CREATED"
  ];
  
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { order_status: status },
    { new: true }
  ).populate("user", "username email mobile");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, `Order status updated to ${status}`)
  );
});

// Get order stats (for dashboard)
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "PENDING" });
  const paidOrders = await Order.countDocuments({ status: "PAID" });
  const cancelledOrders = await Order.countDocuments({ status: "CANCELLED" });

  // Revenue calculation
  const revenueResult = await Order.aggregate([
    { $match: { status: { $in: ["PAID", "DELIVERED"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  return res.status(200).json(
    new ApiResponse(200, {
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      totalRevenue,
    }, "Order stats fetched successfully")
  );
});
