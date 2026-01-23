import Order from "../../models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Get all orders (for admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  // If search is provided, we need to search across order ID and user fields
  let orders;
  let totalOrders;

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    
    // First, get all orders with populated user data, then filter
    const allOrders = await Order.find(query)
      .populate("user", "fullName email mobile")
      .populate("items.product", "name images_uri price")
      .sort({ createdAt: -1 });

    // Filter orders by order ID or user info
    const filteredOrders = allOrders.filter(order => {
      const orderId = order._id.toString();
      const userFullName = order.user?.fullName || '';
      const userEmail = order.user?.email || '';
      const userMobile = order.user?.mobile || '';
      
      return searchRegex.test(orderId) || 
             searchRegex.test(userFullName) || 
             searchRegex.test(userEmail) ||
             searchRegex.test(userMobile);
    });

    totalOrders = filteredOrders.length;
    const skip = (page - 1) * limit;
    orders = filteredOrders.slice(skip, skip + parseInt(limit));
  } else {
    orders = await Order.find(query)
      .populate("user", "fullName email mobile")
      .populate("items.product", "name images_uri price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    totalOrders = await Order.countDocuments(query);
  }

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
    .populate("user", "fullName email mobile")
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
  ).populate("user", "fullName email mobile");

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
// Get monthly stats for charts (for dashboard)
export const getMonthlyStats = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  
  // Get monthly order counts and revenue for the last 6 months
  const monthlyStats = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, new Date().getMonth() - 5, 1),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalOrders: { $sum: 1 },
        totalSales: {
          $sum: {
            $cond: [
              { $in: ["$status", ["PAID", "DELIVERED"]] },
              "$totalAmount",
              0
            ]
          }
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Format the data for the frontend
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Create a map of the last 6 months with 0 values as default
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    last6Months.push({
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      monthNum: date.getMonth() + 1,
      orders: 0,
      sales: 0,
    });
  }

  // Fill in actual data
  monthlyStats.forEach(stat => {
    const idx = last6Months.findIndex(
      m => m.monthNum === stat._id.month && m.year === stat._id.year
    );
    if (idx !== -1) {
      last6Months[idx].orders = stat.totalOrders;
      last6Months[idx].sales = stat.totalSales;
    }
  });

  return res.status(200).json(
    new ApiResponse(200, {
      salesData: last6Months.map(m => ({ month: m.month, value: m.sales })),
      ordersData: last6Months.map(m => ({ month: m.month, value: m.orders })),
    }, "Monthly stats fetched successfully")
  );
});