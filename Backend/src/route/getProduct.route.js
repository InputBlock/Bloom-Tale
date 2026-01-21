import { Router } from "express";
import { getBestSellerProducts, getComboProducts, getProducts, getActiveProducts } from "../controller/getProduct.controller.js";

const router = Router()

router.post("/getProduct",getProducts)
router.post("/bestseller",getBestSellerProducts)
router.post("/combo",getComboProducts)
router.post("/list", getActiveProducts)

export default router;