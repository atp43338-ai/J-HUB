import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addVariant,
  getVariants,
  updateVariant,
  deleteVariant,
  updateProductStock,
} from "../controllers/adminProductController.js";
import upload from "../middleware/uplod.js";

const router = express.Router();

router.post("/", upload.array("images", 5) , createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", upload.array("images",5 ), updateProduct);

router.delete("/:id", deleteProduct);

router.post("/:id/variants", addVariant);

router.get("/:id/variants", getVariants);

router.put("/:id/variants/:variantId", updateVariant);

router.delete("/:id/variants/:variantId", deleteVariant);

router.patch(
  "/:productId/stock",
  adminMiddleware,
  updateProductStock
);

export default router;