
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//Configurations set
app.use(cors({
    origin:[process.env.CORS_ORIGIN, process.env.ADMIN_CORS_ORIGIN],
    credentials:true
}))

app.use(express.json({limit:"16kb"}))  //we accept json data
// app.use(express.urlencoded())       data is from url's
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

import authRoutes from "./route/auth.route.js"
import adminRoutes from "./route/admin.route.js"

app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);


import productRoutes from "./route/product.route.js"
app.use("/api/v1/getProductDetail",productRoutes)

import cartRoutes from "./route/cart.route.js"
app.use("/api/v1/cart",cartRoutes)

import getProductRoutes from "./route/getProduct.route.js"
app.use("/api/v1/getProduct",getProductRoutes)

import orderRoutes from "./route/order.route.js"
app.use("/api/v1/order",orderRoutes)

export {app}