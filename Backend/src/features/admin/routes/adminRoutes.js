import express from "express";

import {
  adminLogin,
  createAdmin,
  getUsers,
  updateUserBlock,
} from "../controllers/adminController.js";
import { getDashboardStats } from "../dashboard/controllers/dashboardController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";
import adminReviewRoutes from "../review/routes/adminReviewRoutes.js";

const router = express.Router();

// Reviews Management sub-router
router.use("/reviews", adminReviewRoutes);

// Dashboard Statistics
router.get("/dashboard-stats", adminMiddleware, getDashboardStats);


// Admin Login
router.post("/login", adminLogin);


// Create Admin
router.post("/create", createAdmin);


// Get Users
router.get("/users", adminMiddleware, getUsers);


// Block / Unblock User
router.put(
  "/users/:id/block",
  adminMiddleware,
  updateUserBlock
);

export default router;