import { Router } from "express";
import  admin_login from "../controller/admin/admin.controller.js";
import add_item from "../controller/admin/admin.product.controller.js";

const router = Router();

router.post("/login", admin_login);
router.post("/add", add_item);

export default router;
