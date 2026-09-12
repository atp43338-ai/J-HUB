import {
  createAdminService,
  adminLoginService,
  getAllUsers,
  updateUserBlockStatus,
} from "../services/adminService.js";


// ==================================================
// ADMIN LOGIN
// ==================================================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await adminLoginService(
      email,
      password
    );

    res.status(200).json({
      message: "Admin login successful",
      token: result.token,
      admin: result.admin,
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(401).json({
      message: error.message,
    });
  }
};


// ==================================================
// CREATE ADMIN
// ==================================================

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const admin = await createAdminService(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// GET USERS
// ==================================================

export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await getAllUsers(
      page,
      limit
    );

    res.status(200).json(result);

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// BLOCK / UNBLOCK USER
// ==================================================

export const updateUserBlock = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({
        message: "isBlocked must be true or false",
      });
    }

    const user = await updateUserBlockStatus(
      id,
      isBlocked
    );

    res.status(200).json({
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });

  } catch (error) {
    console.error(
      "Update user block error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};