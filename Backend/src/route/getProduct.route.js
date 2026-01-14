import { Router } from "express";
import { getBestSellerProducts, getProducts } from "../controller/getProduct.controller.js";


const router = Router()

router.post("/getProduct",getProducts)
router.post("/bestseller",getBestSellerProducts)

export default router;