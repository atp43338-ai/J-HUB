import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import upload from "../middleware/uplod.js";

const router = express.Router();

router.post("/", upload.array("images", 5) , createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", upload.array("images",5 ), updateProduct);

router.delete("/:id", deleteProduct);

export default router;