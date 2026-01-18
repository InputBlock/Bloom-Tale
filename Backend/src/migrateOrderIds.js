import mongoose from "mongoose";
import Order from "./models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

// Generate unique order ID (same logic as order.controller.js)
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${timestamp.slice(-4)}${random}`;
};

const migrateOrderIds = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/bloom-tale";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Find orders without order_id
    const ordersWithoutId = await Order.find({
      $or: [
        { order_id: { $exists: false } },
        { order_id: null },
        { order_id: "" }
      ]
    });

    console.log(`📦 Found ${ordersWithoutId.length} orders without order_id`);

    // Update each order with a unique order_id
    for (const order of ordersWithoutId) {
      const newOrderId = generateOrderId();
      await Order.findByIdAndUpdate(order._id, { order_id: newOrderId });
      console.log(`✅ Updated order ${order._id} with order_id: ${newOrderId}`);
    }

    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateOrderIds();
