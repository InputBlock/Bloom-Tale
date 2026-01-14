import { Router } from "express";
import admin_login from "../controller/admin/admin.controller.js";
import { add_item, list_item, unlist_item, update_item, delete_item } from "../controller/admin/admin.product.controller.js";
import { upload } from "../service/cloudinary.service.js";

const router = Router();

router.post("/login", admin_login);
router.post("/add", upload.single("image"), add_item);
router.post("/list", list_item);
router.post("/unlist", unlist_item);
router.post("/update", upload.single("image"), update_item);
router.post("/delete", delete_item);

export default router;
