import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.get("/:id/related", getRelatedProducts);


export default router;