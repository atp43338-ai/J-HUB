import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    // authentication
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Real-time active session interception: check user status in MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found or account no longer exists",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the admin.",
        isBlocked: true,
      });
    }

    req.user = decoded;
    req.userDoc = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;