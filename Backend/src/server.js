import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

//frontend-inu backend API access cheyyan permission/control kodukkan use cheyyunna package.
import cors from "cors";

import authRoutes from "./features/auth/routes/authRoutes.js";
import profileRoutes from "./features/profile/routes/profileRoutes.js";
import addressRoutes from "./features/address/routes/addressRoutes.js";
import adminRoutes from "./features/admin/routes/adminRoutes.js";

import productRoutes from "./features/product/routes/productRoutes.js";
import adminProductRoutes from "./features/admin/product/routes/adminProductRoutes.js";
import adminCategoryRoutes from "./features/admin/category/routes/adminCategoryRoutes.js";

import cartRoutes from "./features/cart/routes/cartRoutes.js";

import wishlistRoutes from "./features/wishlist/routes/wishlistRoutes.js";

import orderRoutes from "./features/order/routes/orderRoutes.js";
import returnRoutes from "./features/order/routes/returnRoutes.js";

import adminOrderRoutes from "./features/admin/routes/adminOrderRoutes.js";
import adminReturnRoutes from "./features/admin/routes/adminReturnRoutes.js";

import adminCollectionRoutes from "./features/admin/collection/routes/adminCollectionRoutes.js";




//.env file-ilulla values eduthu backend-il available aakku.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("CORS CONFIG LOADED");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(express.json());

app.use("/uploads", express.static("src/uploads"));

connectDB();

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("J-HUB Backend is running");
});

app.use("/api/profile", profileRoutes);
app.use("/api/address", addressRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/returns", adminReturnRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/collections", adminCollectionRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/orders/return", returnRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});