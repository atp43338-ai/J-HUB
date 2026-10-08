import express from "express";

import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../controllers/adminReturnController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();


// GET ALL RETURN REQUESTS
router.get( "/", adminMiddleware, getAllReturns );


// APPROVE RETURN
router.patch(
  "/:returnId/approve",
  adminMiddleware,
  approveReturn
);


// REJECT RETURN
router.patch(
  "/:returnId/reject",
  adminMiddleware,
  rejectReturn
);


export default router;