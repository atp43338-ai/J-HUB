import express from "express";

import { adminLogin } from "../controllers/adminAuthController.js";
import { createAdmin, getUsers, updateUserBlock } from "../controllers/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/create", createAdmin);
router.get("/users", adminMiddleware, getUsers);
router.put("/users/:id/block", adminMiddleware, updateUserBlock);

export default router;