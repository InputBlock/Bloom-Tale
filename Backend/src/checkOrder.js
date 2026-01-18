import mongoose from "mongoose";
import Order from "./models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find order by order_id
    const order = await Order.findOne({ order_id: "KJ5S72Z0" });
    
    if (order) {
      console.log("\n📦 Order found:");
      console.log("Order ID:", order.order_id);
      console.log("MongoDB _id:", order._id);
      console.log("Status (payment):", order.status);
      console.log("Order Status:", order.order_status);
      console.log("Payment Method:", order.paymentMethod);
      console.log("Total Amount:", order.totalAmount);
    } else {
      console.log("❌ Order not found with order_id: KJ5S72Z0");
      
      // List all orders
      const allOrders = await Order.find().select("order_id status order_status paymentMethod");
      console.log("\n📋 All orders in database:");
      console.log(JSON.stringify(allOrders, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkOrder();
