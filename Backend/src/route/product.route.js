import { Router } from "express";
import { getProductDetail } from "../controller/getProductDetails.controller.js";


const router = Router()

router.post("/:product_id",getProductDetail)

export default router;