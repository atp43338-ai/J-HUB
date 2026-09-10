import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { getAllUsers, updateUserBlockStatus } from "../services/adminService.js";


export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//get users

export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await getAllUsers(page, limit);

    res.status(200).json(result);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


//block unblock

export const updateUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({
        message: "isBlocked must be true or false",
      });
    }

    const user = await updateUserBlockStatus(id, isBlocked);

    res.status(200).json({
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    console.error("Update user block error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};