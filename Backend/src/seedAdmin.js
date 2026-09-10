import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import Admin from "./features/admin/models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Main Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Admin creation error:", error);
    process.exit(1);
  }
};

seedAdmin();