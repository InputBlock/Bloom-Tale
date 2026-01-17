import { Router } from "express"
import { testimonialcomment, getAllTestimonials, getMyTestimonials, deleteTestimonial } from "../controller/whatourcustomersay.controller.js"
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js"

const router = Router()

// Public route - get all testimonials
router.get("/", getAllTestimonials)

// Protected routes (require auth)
router.post("/add", verifyJWT, testimonialcomment)
router.get("/my", verifyJWT, getMyTestimonials)
router.delete("/:testimonialId", verifyJWT, deleteTestimonial)

export default router
