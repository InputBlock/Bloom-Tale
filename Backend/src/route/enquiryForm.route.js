import Router from "router"
import { createEnquiry } from "../controller/enquiryForm.controller.js";
const router = Router();
router.post("/createEnquiry",createEnquiry)

export default router;