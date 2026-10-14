import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Protected by Admin authentication middleware
router.use(adminMiddleware);

// GET /api/admin/dashboard-stats or /api/admin/dashboard/stats
router.get("/dashboard-stats", getDashboardStats);
router.get("/stats", getDashboardStats);
router.get("/", getDashboardStats);

export default router;
