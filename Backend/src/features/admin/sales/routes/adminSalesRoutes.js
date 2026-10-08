import express from "express";

import {
  getSalesReportController,
  downloadSalesReportPDF,
  downloadSalesReportExcel,
} from "../controllers/adminSalesController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/report",
  adminMiddleware,
  getSalesReportController
);

router.get(
  "/report/pdf",
  adminMiddleware,
  downloadSalesReportPDF
);

router.get(
  "/report/excel",
  adminMiddleware,
  downloadSalesReportExcel
);

export default router;