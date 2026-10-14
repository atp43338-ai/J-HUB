import express from "express";

import {
  adminLogin,
  createAdmin,
  getUsers,
  updateUserBlock,
} from "../controllers/adminController.js";
import { getDashboardStats } from "../dashboard/controllers/dashboardController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

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