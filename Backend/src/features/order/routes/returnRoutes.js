import express from "express";

import { createReturn } from "../controllers/returnController.js";
import authMiddleware from "../../auth/middleware/authMiddleware.js";

const router = express.Router();


// CREATE RETURN REQUEST
router.post(
  "/",
  authMiddleware,
  createReturn
);


export default router;