import { Router } from "express";
import admin_login, { admin_logout } from "../controller/admin/admin.controller.js";
import { add_item, list_item, unlist_item, update_item, delete_item,get_list } from "../controller/admin/admin.product.controller.js";
import { upload } from "../service/cloudinary.service.js";
import { upload as imagekitUpload } from "../service/image.service.js";
import { get_user_info, get_user_by_id, delete_user, get_user_stats } from "../controller/admin/status.controller.js"
import { getAllOrders, getOrderById, updateOrderStatus, getOrderStats } from "../controller/admin/order.admin.controller.js";
import { add_hero_section, get_hero_sections, update_hero_section, delete_hero_section } from "../controller/admin/editcontent.controller.js";
import { getAboutSection, getAllAboutSections, createAboutSection, updateAboutSection, deleteAboutSection, setActiveAboutSection } from "../controller/admin/aboutSection.controller.js";
import { getAllEnquiries, getEnquiryById, updateEnquiryStatus, deleteEnquiry, getEnquiryStats } from "../controller/admin/enquiry.admin.controller.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJwt.middleware.js";

const router = Router();

// Public route - admin login (no auth required)
router.post("/login", admin_login);

// Logout - clears httpOnly cookie
router.post("/logout", admin_logout);

// All routes below require admin authentication
// Product management routes
router.post("/add", verifyAdminJWT, upload.array("images", 5), add_item);
router.post("/list", verifyAdminJWT, list_item);
router.post("/unlist", verifyAdminJWT, unlist_item);
router.post("/update", verifyAdminJWT, upload.array("images", 5), update_item);
router.post("/delete", verifyAdminJWT, delete_item);
router.get("/showlist", verifyAdminJWT, get_list);

// User management routes
router.get("/users", verifyAdminJWT, get_user_info);
router.get("/users/stats", verifyAdminJWT, get_user_stats);
router.get("/users/:userId", verifyAdminJWT, get_user_by_id);
router.delete("/users/:userId", verifyAdminJWT, delete_user);

// Order routes
router.get("/orders", verifyAdminJWT, getAllOrders);
router.get("/orders/stats", verifyAdminJWT, getOrderStats);
router.get("/orders/:orderId", verifyAdminJWT, getOrderById);
router.patch("/orders/:orderId/status", verifyAdminJWT, updateOrderStatus);

// Hero Section routes (using ImageKit)
router.post("/hero", verifyAdminJWT, imagekitUpload.single("media"), add_hero_section);
router.get("/hero", get_hero_sections); // Public - frontend needs to display hero sections
router.put("/hero/:id", verifyAdminJWT, imagekitUpload.single("media"), update_hero_section);
router.delete("/hero/:id", verifyAdminJWT, delete_hero_section);

// About Section routes (using ImageKit)
router.get("/about", getAboutSection); // Public - frontend needs to display
router.get("/about/all", verifyAdminJWT, getAllAboutSections);
router.post("/about", verifyAdminJWT, imagekitUpload.array("images", 3), createAboutSection);
router.put("/about/:id", verifyAdminJWT, imagekitUpload.array("images", 3), updateAboutSection);
router.delete("/about/:id", verifyAdminJWT, deleteAboutSection);
router.patch("/about/:id/activate", verifyAdminJWT, setActiveAboutSection);

// Enquiry routes
router.get("/enquiries", verifyAdminJWT, getAllEnquiries);
router.get("/enquiries/stats", verifyAdminJWT, getEnquiryStats);
router.get("/enquiries/:enquiryId", verifyAdminJWT, getEnquiryById);
router.patch("/enquiries/:enquiryId/status", verifyAdminJWT, updateEnquiryStatus);
router.delete("/enquiries/:enquiryId", verifyAdminJWT, deleteEnquiry);

export default router;
