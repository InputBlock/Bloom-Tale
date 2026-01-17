import { Router } from "express";
import admin_login from "../controller/admin/admin.controller.js";
import { add_item, list_item, unlist_item, update_item, delete_item,get_list } from "../controller/admin/admin.product.controller.js";
import { upload } from "../service/cloudinary.service.js";
import { upload as imagekitUpload } from "../service/image.service.js";
import {get_user_info} from "../controller/admin/status.controller.js"
import { getAllOrders, getOrderById, updateOrderStatus, getOrderStats } from "../controller/admin/order.admin.controller.js";
import { add_hero_section, get_hero_sections, update_hero_section, delete_hero_section } from "../controller/admin/editcontent.controller.js";

const router = Router();

router.post("/login", admin_login);
router.post("/add", upload.array("images", 5), add_item); // Accept up to 5 images
router.post("/list", list_item);
router.post("/unlist", unlist_item);
router.post("/update", upload.array("images", 5), update_item); // Accept up to 5 images
router.post("/delete", delete_item);
router.get("/showlist",get_list);
router.get("/user_list",get_user_info);

// Order routes
router.get("/orders", getAllOrders);
router.get("/orders/stats", getOrderStats);
router.get("/orders/:orderId", getOrderById);
router.patch("/orders/:orderId/status", updateOrderStatus);

// Hero Section routes (using ImageKit)
router.post("/hero", imagekitUpload.single("media"), add_hero_section);
router.get("/hero", get_hero_sections);
router.put("/hero/:id", imagekitUpload.single("media"), update_hero_section);
router.delete("/hero/:id", delete_hero_section);

export default router;
