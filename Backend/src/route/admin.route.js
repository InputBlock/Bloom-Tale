import { Router } from "express";
import admin_login from "../controller/admin/admin.controller.js";
import { add_item, list_item, unlist_item, update_item, delete_item,get_list } from "../controller/admin/admin.product.controller.js";
import { upload } from "../service/cloudinary.service.js";
import {get_user_info} from "../controller/admin/status.controller.js"
import { getAllOrders, getOrderById, updateOrderStatus, getOrderStats } from "../controller/admin/order.admin.controller.js";

const router = Router();

router.post("/login", admin_login);
router.post("/add", upload.single("image"), add_item);
router.post("/list", list_item);
router.post("/unlist", unlist_item);
router.post("/update", upload.single("image"), update_item);
router.post("/delete", delete_item);
router.get("/showlist",get_list);
router.get("/user_list",get_user_info);

// Order routes
router.get("/orders", getAllOrders);
router.get("/orders/stats", getOrderStats);
router.get("/orders/:orderId", getOrderById);
router.patch("/orders/:orderId/status", updateOrderStatus);

export default router;
