import { Routes, Route } from "react-router";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import OTPVerification from "./features/auth/pages/OTPVerification";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";

import Home from "./features/home/pages/Home";

import Profile from "./features/profile/pages/Profile";
import EditProfile from "./features/profile/pages/EditProfile";
import ChangePassword from "./features/profile/pages/ChangePassword";

import Address from "./features/address/pages/Address";
import AddEditAddress from "./features/address/pages/AddEditAddress";
import EmailVerification from "./features/profile/pages/EmailVerification";

import AdminLogin from "./features/admin/pages/AdminLogin";
import UserManagement from "./features/admin/pages/UserManagement";

import ProtectedRoute from "./middleware/ProtectedRoute";
import PublicRoute from "./middleware/PublicRoute";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />

      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
      <Route path="/address/add" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />
      <Route path="/address/edit/:id" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />
      <Route path="/email-verification" element={<ProtectedRoute><EmailVerification /></ProtectedRoute>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Routes>
  );
}

export default App;